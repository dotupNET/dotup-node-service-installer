import { ILinuxServiceConfig } from "./ILinuxServiceConfig";
import { IAppConfig } from "./IAppConfig";
import { IPlatformConfig } from "./IPlatformConfig";

export interface ILinuxConfig extends IPlatformConfig {
  systemd?: ILinuxServiceConfig;
}
