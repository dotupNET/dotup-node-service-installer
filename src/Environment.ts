import { IAppConfig } from "./interfaces/IAppConfig";
import fs from "fs";
import { shelly } from "./Shelly";

export class Environment {

  filePath: string | undefined;
  fileContent: string | undefined;

  constructor(filePath: string, config: IAppConfig | undefined) {
    if (config === undefined || config.Environment === undefined || config.Environment.length < 1) {
      this.fileContent = undefined;
      this.filePath = undefined;
    } else {
      this.fileContent = config.Environment.join("\n");
      this.filePath = filePath;
    }

  }

  createFile(): void {
    if (this.filePath === undefined || this.fileContent === undefined) {
      shelly.echoYellow("No env file to create");
      return;
    }
    fs.writeFileSync(this.filePath, this.fileContent, { encoding: "utf8" });
  }

}

