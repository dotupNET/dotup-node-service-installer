import { IAppConfig } from "./IAppConfig";

export interface ILinuxService extends IAppConfig {
  Description: string;
  After: string;
  // [Service]
  ExecStart: string;
  Restart: string;
  // [Install]
  WantedBy: string;
  WorkingDirectory: string;
}
