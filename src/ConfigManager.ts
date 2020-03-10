import path from "path";
import fs from "fs";
import os from "os";
import { InstallMode } from "./Enumerations";
import { ILinuxConfig } from "./interfaces/ILinuxConfig";
import { ILinuxServiceConfig } from "./interfaces/ILinuxServiceConfig";
import { INoinConfig } from "./interfaces/INoinConfig";
import { IPlatformConfig } from "./interfaces/IPlatformConfig";
import { IAppConfig } from "./interfaces/IAppConfig";
import { IWindowsConfig } from "./interfaces/IWindowsConfig";
import { shelly } from "./Shelly";
import { ObjectTools } from "@dotup/dotup-ts-types";

export class ConfigManager {

  config: INoinConfig;

  loadConfig(projectDir: string): INoinConfig | undefined {
    const configFile = path.join(projectDir, ".noin.json");
    if (fs.existsSync(configFile)) {
      // Config from file
      shelly.echoGrey(`Loading configuration from ${configFile}`);
      const fileConfig = JSON.parse((fs.readFileSync(configFile, "utf8"))) as INoinConfig;
      this.config = fileConfig;

      return this.config;
    }
  }

  getServiceConfig(): ILinuxServiceConfig | undefined {
    if (this.config.linux === undefined) { return undefined; }
    // this.config.linux.systemd.WorkingDirectory = this.config.linux.targetPath;
    return this.config.linux.systemd;
  }

  canInstallService(mode: InstallMode): boolean {
    if (mode === InstallMode.service) {
      if (os.platform() === "linux") {
        return true;
      } else {
        shelly.echoYellow(`Service installation not support on platform '${os.platform()}'`);
      }
    }

    return false;
  }

  setPlatformConfig(config: Partial<IPlatformConfig>): void {

    if (os.platform() === "win32") {
      if (this.config.win32 === undefined) {
        this.config.win32 = {} as IWindowsConfig;
      }
      ObjectTools.CopyEachSource(this.config.win32, config);
    } else if (os.platform() === "linux") {
      if (this.config.linux === undefined) {
        this.config.linux = {} as ILinuxConfig;
      }
      ObjectTools.CopyEachSource(this.config.linux, config);
    } else {
      throw new Error(`Platform '${os.platform()}' not supported`);
    }
  }

  getRuntimeConfig(mode: InstallMode | undefined): IAppConfig | undefined {
    if (mode === InstallMode.app) {
      return this.getPlatformConfig<IPlatformConfig>().app;
    } else {
      return this.config.linux?.systemd;
    }
  }

  getPlatformConfig<T extends IPlatformConfig>(): T {
    const result = (this.config as any)[os.platform()];

    if (result === undefined) {
      shelly.echoYellow(JSON.stringify(this.config, undefined, 2));
      throw new Error(`Platform '${result}' not configured`);
    }

    return result;
  }

}
