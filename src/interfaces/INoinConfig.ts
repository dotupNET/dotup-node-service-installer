import { IGitConfig } from "./IGitConfig";
import { ILinuxConfig } from "./ILinuxConfig";
import { IWindowsConfig } from "./IWindowsConfig";

export interface INoinConfig {
  production: boolean;
  git: IGitConfig;
  linux?: ILinuxConfig;
  win32?: IWindowsConfig;
  override: boolean;
  InstallScript?: string;
  BuildScript?: string;

}
