import { Auto, IPlugin, validatePluginConfiguration } from '@auto-it/core';
import * as t from "io-ts";

const pluginOptions = t.partial({
});

export type IPipPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Python Pip publishing plugin for auto */
export default class PipPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'pip';

  /** The options of the plugin */
  readonly options: IPipPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IPipPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });
  }
}
