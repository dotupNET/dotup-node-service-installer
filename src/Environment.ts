import { IAppConfig } from "./interfaces/IAppConfig";
import fs from "fs";

export class Environment {

  filePath: string;

  createFile(filePath: string, config: IAppConfig | undefined): void {
    if (config === undefined || config.Environment === undefined || config.Environment.length < 1) {
      return;
    }

    const content = config.Environment.join("\n");
    fs.writeFileSync(filePath, content, { encoding: "utf8" });

    this.filePath = filePath;
  }

}

