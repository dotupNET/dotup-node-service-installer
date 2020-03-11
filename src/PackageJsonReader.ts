import fs from "fs";
import path from "path";
import { IPackageJSON, IBin } from "./interfaces/IPackageJSON";

export class PackageJsonReader {

  packageJson: IPackageJSON;

  constructor(pathToPackageJson: string) {
    const fileName = path.join(pathToPackageJson, "package.json");
    this.packageJson = JSON.parse((fs.readFileSync(fileName, "utf8"))) as IPackageJSON;
  }


  getServiceBinPath(root: string): string {
    let bin: string | IBin | undefined;

    if (this.packageJson.systemd !== undefined) {
      // systemd
      bin = this.packageJson.systemd;
    }
    else if (this.packageJson.bin !== undefined) {
      // bin
      bin = this.packageJson.systemd;
    }
    else if (this.packageJson.main !== undefined) {
      // main
      bin = this.packageJson.main;
    }

    if (bin === undefined) {
      throw new Error("Could not find systemd entry in package.json");
    }

    if (typeof bin !== "string") {
      bin = bin[Object.keys(bin)[0]];
    }

    return path.join(root, bin);
  }

  getWorkingDirectory(projectDir: string): string {
    const exec = this.getServiceBinPath(projectDir);

    return path.dirname(exec);
  }
}
