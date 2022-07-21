import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import * as t from "io-ts";
import glob from "fast-glob";
import ConfigParser from "configparser";
import parseGitHubUrl from "parse-github-url";
import { inc, ReleaseType } from "semver";
import { readFile, writeFile } from "fs/promises";
import { execPromise } from "@auto-it/core";

const pluginOptions = t.partial({
  repository: t.string,
});

export type IPipPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Python Pip publishing plugin for auto */
export default class PipPlugin implements IPlugin {
  /** The name of the plugin */
  name = "pip";

  /** The options of the plugin */
  readonly options: IPipPluginOptions;
  readonly config: ConfigParser;
  readonly packageName: string;

  /** Initialize the plugin with it's options */
  constructor(options: IPipPluginOptions) {
    const setupConfig = glob.sync("setup.cfg")[0];

    if (!setupConfig) {
      throw new Error("No setup.cfg found");
    }
    this.config = new ConfigParser();
    this.config.read(setupConfig);

    if (!this.config.hasSection("metadata"))
      throw new Error("No metadata section of setup.cfg");

    const packageName = this.config.get("metadata", "name");
    if (!packageName)
      throw new Error("No name in metadata section of setup.cfg");

    this.packageName = packageName;
    this.options = options;
  }

  private parseSetupConfig(): {
    name: string;
    version: string | undefined;
    author: { name: string | undefined; email: string | undefined };
    url: string | undefined;
  } {
    const name = this.config.get("metadata", "name");
    if (!name) throw new Error("No name in metadata section of setup.cfg");

    const version = this.config.get("metadata", "version");

    const author = this.config.get("metadata", "author");
    const authorEmail =
      this.config.get("metadata", "author_email") ??
      this.config.get("metadata", "author-email");

    const url = this.config.get("metadata", "url");

    return { name, version, author: { name: author, email: authorEmail }, url };
  }

  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `auto-plugin-${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      const { version } = this.parseSetupConfig();

      if (version === undefined)
        throw new Error("No version in metadata section of setup.cfg");

      return version;
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      const { author } = this.parseSetupConfig();
      return author;
    });

    auto.hooks.getRepository.tapPromise(this.name, async () => {
      const { url } = this.parseSetupConfig();

      if (!url) return;

      const { owner, name } = parseGitHubUrl(url) || {};

      if (!owner || !name) {
        return;
      }

      return {
        repo: name,
        owner,
      };
    });

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        const { version, newVersion } = await this.getNewVersion(
          bump as ReleaseType
        );

        if (dryRun && newVersion) {
          if (quiet) {
            console.log(newVersion);
          } else {
            auto.logger.log.info(`Would have published: ${newVersion}`);
          }

          return;
        }

        await this.writeNewVersion(version, newVersion);
      }
    );

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ bump, canaryIdentifier, dryRun, quiet }) => {
        const { version, newVersion } = await this.getNewVersion(
          bump as ReleaseType
        );

        const pipCanaryIdentifier = this.canaryIdentifierToPep404ValidIdentifier(
          canaryIdentifier
        );
        const canaryVersion = `${newVersion}${pipCanaryIdentifier}`;

        if (dryRun) {
          if (quiet) {
            console.log(canaryVersion);
          } else {
            auto.logger.log.info(`Would have published: ${canaryVersion}`);
          }

          return;
        }

        await this.writeNewVersion(version, canaryVersion);

        auto.logger.verbose.info("Running default release command");
        await execPromise("python3", ["setup.py", "bdist_wheel", "sdist"]);

        // will push the canary gem
        await execPromise("python3", [
          "-m",
          "twine",
          "upload",
          ...(this.options.repository
            ? ["--repository", this.options.repository]
            : []),
          `dist/${this.packageName}-${canaryVersion.replace('-', '.')}*`,
          "--verbose",
        ]);

        auto.logger.verbose.info("Successfully published canary version");

        return {
          newVersion: canaryVersion,
          details: this.makeInstallDetails(this.packageName, canaryVersion),
        };
      }
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      const { version } = await this.parseSetupConfig();

      await execPromise("git", [
        "commit",
        "-am",
        `"update version: ${version} [skip ci]"`,
        "--no-verify",
      ]);

      auto.logger.verbose.info("Running default release command");
      await execPromise("python3", ["setup.py", "bdist_wheel", "sdist"]);

      await execPromise("python3", [
        "-m",
        "twine",
        "upload",
        ...(this.options.repository
          ? ["--repository", this.options.repository]
          : []),
        `dist/${this.packageName}-${version}*`,
        "--verbose",
      ]);
    });
  }
  private async getNewVersion(releaseType: ReleaseType) {
    const { version } = this.parseSetupConfig();
    if (!version)
      throw new Error("No version in metadata section of setup.cfg");
    const newVersion = inc(version, releaseType);

    if (!newVersion)
      throw new Error(
        `The version "${version}" parsed from setup.cfg was invalid and could not be incremented.`
      );

    return { version, newVersion };
  }

  private async writeNewVersion(version: string, newVersion: string) {
    const content = await readFile("setup.cfg", { encoding: "utf-8" });
    await writeFile("setup.cfg", content.replace(version, newVersion));
  }

  private makeInstallDetails(name: string | undefined, canaryVersion: string) {
    return [
      ":sparkles: Test out this PR via:\n",
      "```bash",
      `pip install ${name}==${canaryVersion}`,
      "```",
    ].join("\n");
  }

  private canaryIdentifierToPep404ValidIdentifier(identifier: string) {
    return identifier
      .replace("-canary", "-dev")
      .replace(".", "+")
      .replace('dev+', 'dev0+');
  }
}
