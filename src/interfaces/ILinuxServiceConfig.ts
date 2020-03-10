import { ILinuxService } from "./ILinuxService";

export interface ILinuxServiceConfig extends ILinuxService {
  serviceName: string;
}
