import { IAppConfig } from "./IAppConfig";

export interface IPlatformConfig {
  targetPath: string;
  bin?: string;
  app?: IAppConfig;
}
