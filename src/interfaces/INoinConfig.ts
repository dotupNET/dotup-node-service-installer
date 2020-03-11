import { ILinuxConfig } from "./ILinuxConfig";

export interface INoinConfig {
  linux?: ILinuxConfig;
  // win32?: IWindowsConfig;
  override: boolean;
}
