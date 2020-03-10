import { ConfigManager } from "./ConfigManager";
import { InstallMode } from "./Enumerations";
import { ILinuxConfig } from "./interfaces/ILinuxConfig";
import { ILinuxService } from "./interfaces/ILinuxService";
import { ILinuxServiceConfig } from "./interfaces/ILinuxServiceConfig";
import { INoinConfig } from "./interfaces/INoinConfig";

export class Configurator {

  cm: ConfigManager;
  get config(): INoinConfig {
    return this.cm.config;
  }

  loadConfig(projectDir: string) {
    this.cm = new ConfigManager();
    this.cm.loadConfig(projectDir);
  }

  async getInstallMode(): Promise<InstallMode> {
    const runtime = this.cm.getPlatformConfig<ILinuxConfig>();

    const mode = InstallMode.service;

    // service
    runtime.app = undefined;
    if (runtime.systemd === undefined) {
      // const name = await Enquirer.getServiceName();
      runtime.systemd = {} as ILinuxServiceConfig;
      // runtime.systemd.serviceName = name;
    }


    return mode;
  }

  async getLinuxService(): Promise<ILinuxService | undefined> {

    return this.config.linux?.systemd;
  }

}
