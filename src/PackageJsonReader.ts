import fs from "fs";
import path from "path";
import { IPackageJSON } from "./interfaces/IPackageJSON";

export class PackageJsonReader {

  packageJson: IPackageJSON;

  constructor(pathToPackageJson: string) {
    const fileName = path.join(pathToPackageJson, "package.json");
    this.packageJson = JSON.parse((fs.readFileSync(fileName, "utf8"))) as IPackageJSON;
  }

  getBin(root: string): string {
    let bin: string;

    if (this.packageJson.bin === undefined) {
      bin = this.packageJson.main || "";
    } else {
      if (typeof this.packageJson.bin === "string") {
        bin = this.packageJson.bin;
      } else {
        bin = this.packageJson.bin[Object.keys(this.packageJson.bin)[0]];
      }
    }

    return path.join(root, bin);
  }

  getPathToExec(root: string): string {
    const exec = this.getBin(root);

    return path.dirname(exec);
  }

}
