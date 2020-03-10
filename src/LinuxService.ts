import { renderFile } from "ejs";
import fs from "fs";
import path from "path";
import { ILinuxService } from "./interfaces/ILinuxService";
import { ILinuxServiceConfig } from "./interfaces/ILinuxServiceConfig";
import { shelly } from "./Shelly";

export class LinuxService {

  async generateFile(templateFilePath: string, data: ILinuxService): Promise<string> {
    return await renderFile(templateFilePath, data);
  }

  install(config: ILinuxServiceConfig | undefined, serviceFile: string): void {
    if (config === undefined) {
      throw new Error("config === undefined");
    }

    const serviceName = `${config.serviceName}.service`;
    const srcFile = path.join(shelly.getTempDir(), serviceName);
    const targetFile = `/etc/systemd/system/${serviceName}`;

    // Write to tmp
    fs.writeFileSync(srcFile, serviceFile);

    // move to target folder
    const cmd = `sudo mv ${srcFile} ${targetFile}`;
    shelly.exec(cmd);

    // shelly.exec('sudo systemctl daemon-reload');
    // shelly.exec(`sudo systemctl enable ${serviceName}`);
    // shelly.exec(`sudo systemctl restart ${serviceName}`);
  }

}
