import { ILinuxServiceConfig } from "./ILinuxServiceConfig";

export interface ILinuxConfig  {
  targetPath: string;
  bin?: string;
  systemd?: ILinuxServiceConfig;
}
