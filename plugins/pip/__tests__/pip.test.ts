import mockFs from "mock-fs";
import Pip from "../src";
import endent from "endent";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { execSync } from "child_process";
import fs from "fs";
import { SEMVER } from "@auto-it/core";

const logger = dummyLog();

const execSyncSpy = jest.fn();
jest.mock("child_process");
// @ts-ignore
execSync.mockImplementation(execSyncSpy);

const execSpy = jest.fn();
execSpy.mockReturnValue("");

// @ts-ignore
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => execSpy(...args)
);

afterEach(() => {
  mockFs.restore();
});
describe("Pip Plugin", () => {
  test("throws without a setup config", async () => {
    expect(() => new Pip({})).toThrow();
  });

  test("throws when provided a setup config without a name", async () => {
    mockFs({
      "setup.cfg": endent`
        [metadata]
        version = 1.0.0
        `,
    });
    expect(() => new Pip({})).toThrow();
  });

  test("doesn't throw any errors with a valid setup config", async () => {
    mockFs({
      "setup.cfg": endent`
        [metadata]
        name = test-package
        version = 1.0.0
      `,
    });
    expect(() => new Pip({})).not.toThrow();
  });

  describe("getPreviousVersion", () => {
    test("gets previous version from the setup cfg", async () => {
      mockFs({
        "setup.cfg": endent`
        [metadata]
        name = test-package
        version = 1.8.99
      `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getPreviousVersion.promise()).toBe("1.8.99");
    });

    test("throws if no version is specified in the setup cfg", async () => {
      mockFs({
        "setup.cfg": endent`
        [metadata]
        name = test-package
      `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      await expect(hooks.getPreviousVersion.promise()).rejects.toBeInstanceOf(
        Error
      );
    });
  });

  describe("getAuthor", () => {
    test("gets author from setup cfg", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          author = Example Author
          author_email = author@example.com
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getAuthor.promise()).toStrictEqual({
        name: "Example Author",
        email: "author@example.com",
      });
    });
    test("gets author from setup cfg using alias", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          author = Example Author
          author-email = author@example.com
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getAuthor.promise()).toStrictEqual({
        name: "Example Author",
        email: "author@example.com",
      });
    });
  });

  describe("getRepository", () => {
    test("returns if no url found", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getRepository.promise()).toBeUndefined();
    });

    test("returns if no repo found in url", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          url = http://example.com
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getRepository.promise()).toBeUndefined();
    });

    test("find repo in homepage", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          url = http://github.com/mediasuitenz/auto
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getRepository.promise()).toStrictEqual({
        owner: "mediasuitenz",
        repo: "auto",
      });
    });
  });

  describe("version", () => {
    test("bump version", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          version = 0.1.0
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);
      await hooks.version.promise({ bump: SEMVER.minor });

      expect(fs.readFileSync("setup.cfg", { encoding: "utf-8" })).toBe(endent`
          [metadata]
          name = test-package
          version = 0.2.0
      `);
    });

    test("throws with invalid version", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          version = 0.1.nope
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      await expect(
        hooks.version.promise({ bump: SEMVER.minor })
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe("publish", () => {
    beforeEach(() => {
      execSpy.mockClear();
    });

    test("calls the python wheel build command", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          version = 0.1.0
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);
      await hooks.publish.promise({ bump: SEMVER.minor });

      expect(execSpy).toHaveBeenCalledWith(
        "python3",
        ["setup.py", "bdist_wheel", "sdist"]);
    });

    test("calls the twine upload command", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          version = 0.1.0
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);
      await hooks.publish.promise({ bump: SEMVER.minor });

      expect(execSpy).toHaveBeenCalledWith(
        "python3", [
          "-m", "twine",
          "upload",
          "dist/test-package-0.1.0*",
          "--verbose"
        ]);
    });

    test("calls the twine upload command with a custom repo", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          version = 0.1.0
        `,
      });

      const plugin = new Pip({repository: 'example-repo'});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);
      await hooks.publish.promise({ bump: SEMVER.minor });

      expect(execSpy).toHaveBeenCalledWith(
        "python3", [
          "-m", "twine",
          "upload",
          "--repository", "example-repo",
          "dist/test-package-0.1.0*",
          "--verbose"
        ]);
    });
  });

  describe("canary", () => {
    beforeEach(() => {
      execSpy.mockClear();
    });

    test("dry-run not execute any commands", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          version = 0.1.0
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      await hooks.canary.promise({
        bump: SEMVER.minor,
        canaryIdentifier: "-canary",
        dryRun: true,
        quiet: false,
      });

      expect(execSpy).not.toHaveBeenCalled();
    });

    test("calls the twine upload command", async () => {
      mockFs({
        "setup.cfg": endent`
          [metadata]
          name = test-package
          version = 0.1.0
        `,
      });

      const plugin = new Pip({});
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      const result = await hooks.canary.promise({
        bump: SEMVER.minor,
        canaryIdentifier: "-canary.1a2b3c4",
        dryRun: false,
        quiet: false,
      });

      expect(result).not.toBe(undefined)

      expect(result.newVersion).toBe(
        `0.2.0-dev0+1a2b3c4`
      );
      expect(result.details).toBe(endent`
       :sparkles: Test out this PR via:

       \`\`\`bash
       pip install test-package==0.2.0-dev0+1a2b3c4
       \`\`\`
      `);

      expect(execSpy).toHaveBeenCalledWith(
        "python3", [
          "-m", "twine",
          "upload",
          "dist/test-package-0.2.0.dev0+1a2b3c4*",
          "--verbose"
        ]);
    });
  });
});
