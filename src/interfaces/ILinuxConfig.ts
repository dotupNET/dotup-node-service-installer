import { ILinuxServiceConfig } from "./ILinuxServiceConfig";

export interface ILinuxConfig  {
  bin?: string;
  systemd?: ILinuxServiceConfig;
}
