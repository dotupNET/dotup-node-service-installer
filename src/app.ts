#!/usr/bin/env node

import commander from "commander";
import fs from "fs";
import path from "path";
import { Configurator } from "./Configurator";
import { LinuxService } from "./LinuxService";
import { PackageJsonReader } from "./PackageJsonReader";
import { shelly } from "./Shelly";
import { PostCommands } from "./PostCommands";
import { Environment } from "./Environment";
import { ILinuxServiceConfig } from "./interfaces/ILinuxServiceConfig";

export class App extends Configurator {

  readonly serviceTemplatePath: string;
  projectDir: string;

  constructor() {
    super();

    const args = commander
      .option("-p, --project", "Project root directory")
      .parse(process.argv || []);

    // this.rootDir = shelly.pwd().toString();
    // shelly.silent(true);
    // shelly.silent(false);
    this.serviceTemplatePath = this.getInstallerDir();
    this.projectDir = this.getProjectDir(args.args[0]);

    console.log(`Project directory: ${this.projectDir}`);
    // console.log(`nosi directory: ${this.installerDir}`);

    // Get configuration
    this.loadConfig(this.projectDir);
  }

  getProjectDir(argsDir?: string): string {
    const dir = argsDir || process.cwd();

    if (!fs.existsSync(path.join(dir, "package.json"))) {
      throw new Error(`Could not find package.json file. ${dir}`);
    }

    return dir;
  }

  getInstallerDir(): string {
    const npmGlobalDir = shelly.exec("npm root -g").toString().split("\n")[0];
    console.log(`NPM global directory: ${npmGlobalDir}`);

    // Global installation path. nosi called from anywhere
    let dirToTest = path.join(npmGlobalDir, "@dotup", "node-service-installer");
    dirToTest = path.join(dirToTest, "dist", "assets", "template.service");
    if (fs.existsSync(dirToTest)) {
      return dirToTest;
    }

    console.log(`File not found: ${dirToTest}`);

    if (process.env.NODE_ENV !== "production") {

      dirToTest = path.join(process.cwd(), "assets", "template.service");
      if (fs.existsSync(dirToTest)) {
        return dirToTest;
      }

      console.log(`File not found: ${dirToTest}`);
      dirToTest = path.join(process.cwd(), "..");

      dirToTest = path.join(dirToTest, "assets", "template.service");
      if (fs.existsSync(dirToTest)) {
        return dirToTest;
      }

      console.log(`File not found: ${dirToTest}`);
    }

    throw new Error("Could not find service installer assets folder.");
  }

  async install(): Promise<void> {

    // cd into temp folder
    shelly.cdTemp();

    // Load config from repository
    this.loadConfig(this.projectDir);

    // Load cloned project package json
    const preader = new PackageJsonReader(this.projectDir);

    // Get install mode (runtime service or app)
    const runtimeConfig = this.cm.getPlatformConfig();
    runtimeConfig.bin = preader.getServiceBinPath(this.projectDir);

    const platformConfig = this.cm.getPlatformConfig();

    // Generate dotenv file
    const env = new Environment(
      path.join(this.projectDir, ".env"),
      this.cm.getRuntimeConfig()
    );

    // Generate service file
    const serviceConfig = this.cm.getServiceConfig();

    if (serviceConfig === undefined) {
      throw new Error("serviceConfig === undefined");
    }

    const serviceFileContent = await this.generateService(serviceConfig, preader, env);

    // Install service
    if (this.cm.canInstallService()) {
      await this.installService(serviceConfig, serviceFileContent);

      // Post commands
      const commands = new PostCommands(this.cm);
      commands.execute();

      env.createFile();

      // Done
      shelly.echoGreen("Installation completed");
    } else {
      shelly.echoYellow("Service installation only on linux systems.");
      console.log(serviceFileContent);

      // Post commands
      const commands = new PostCommands(this.cm);
      commands.print();

      shelly.echoGreen("Generation completed");
    }
  }

  async generateService(serviceConfig: ILinuxServiceConfig, preader: PackageJsonReader, env: Environment): Promise<string> {

    const runtimeConfig = this.cm.getPlatformConfig();

    if (serviceConfig === undefined) {
      throw new Error("serviceConfig === undefined");
    }

    const targetPath = this.projectDir;

    const node = shelly.which("node");
    const bin = preader.getServiceBinPath(targetPath);
    let exec = `${node}`;
    if (env.filePath !== undefined) {
      exec = `${exec} -r dotenv/config ${bin} dotenv_config_path=${path.join(targetPath, ".env")}`;
    } else {
      exec = `${exec} ${bin}`;
    }
    serviceConfig.ExecStart = exec;
    serviceConfig.WorkingDirectory = preader.getWorkingDirectory(targetPath);

    const service = await this.getLinuxService();
    const template = path.join(this.serviceTemplatePath);

    if (service === undefined) {
      throw new Error("service === undefined");
    }

    // Generate service file
    const ls = new LinuxService();
    const serviceFile = await ls.generateFile(template, service);

    return serviceFile;
  }

  async installService(serviceConfig: ILinuxServiceConfig, serviceFileContent: string): Promise<void> {

    const serviceName = serviceConfig.serviceName;
    shelly.echoGreen(`Installing linux service '${serviceName}'`);

    // Install
    const ls = new LinuxService();
    ls.install(serviceConfig, serviceFileContent);
  }

}

const app = new App();
app.install();
