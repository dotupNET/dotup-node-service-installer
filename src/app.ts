#!/usr/bin/env node

import commander from "commander";
import path from "path";
import { Configurator } from "./Configurator";
import { LinuxService } from "./LinuxService";
import { PackageJsonReader } from "./PackageJsonReader";
import { shelly } from "./Shelly";
import { PostCommands } from "./PostCommands";
import { Environment } from "./Environment";

export class App extends Configurator {

  readonly installerDir: string;
  // readonly rootDir: string;
  repositoryDir: string;

  constructor() {
    super();

    const args = commander
      .option("-p, --project", "Project root directory")
      .parse(process.argv || []);

    // this.rootDir = shelly.pwd().toString();
    shelly.silent(true);
    const dir = shelly.exec("npm root -g").toString().split("\n")[0];
    console.log(`NPM global directory: ${dir}`);
    shelly.silent(false);
    this.installerDir = path.join(dir, "@dotup", "node-service-installer", "dist");

    const pdir = args.args[0];
    console.log(`Project directory: ${pdir}`);
    console.log(`nosi directory: ${this.installerDir}`);

    // Get configuration
    this.loadConfig(pdir);
  }

  async install(): Promise<void> {

    // cd into temp folder
    shelly.cdTemp();

    // Load config from repository
    this.loadConfig(this.repositoryDir);

    // Load cloned project package json
    const preader = new PackageJsonReader(this.repositoryDir);

    // Get install mode (runtime service or app)
    const mode = await this.getInstallMode();
    const runtimeConfig = this.cm.getPlatformConfig();
    runtimeConfig.bin = preader.getBin(runtimeConfig.targetPath);

    // Create dotenv file
    const env = new Environment();
    const platformConfig = this.cm.getPlatformConfig();
    env.createFile(
      path.join(platformConfig.targetPath, ".env"),
      this.cm.getRuntimeConfig(mode)
    );

    // Install service
    if (this.cm.canInstallService(mode)) {
      await this.installService(preader, env);
    } else {
      throw new Error("Service installation only on linux systems.");
    }

    // Post commands
    const commands = new PostCommands(this.cm);
    commands.execute();

    // Done
    shelly.echoGreen("Installation completed");
  }

  async installService(preader: PackageJsonReader, env: Environment): Promise<void> {

    const runtimeConfig = this.cm.getPlatformConfig();
    const serviceConfig = this.cm.getServiceConfig();

    if (serviceConfig === undefined) {
      throw new Error("serviceConfig === undefined");
    }

    const serviceName = serviceConfig.serviceName;
    const targetPath = runtimeConfig.targetPath;

    if (
      serviceConfig.ExecStart === undefined ||
      serviceConfig.WorkingDirectory === undefined
    ) {
      const node = shelly.which("node");
      const bin = preader.getBin(targetPath);
      let exec = `${node}`;
      if (env.filePath !== undefined) {
        exec = `${exec} -r dotenv/config ${bin} dotenv_config_path=${path.join(targetPath, ".env")}`;
      } else {
        exec = `${exec} ${bin}`;
      }
      serviceConfig.ExecStart = exec;
      serviceConfig.WorkingDirectory = preader.getPathToExec(targetPath);
    }

    const service = await this.getLinuxService();
    const template = path.join(this.installerDir, "assets", "template.service");

    if (service === undefined) {
      throw new Error("service === undefined");
    }

    // Generate service file
    const ls = new LinuxService();
    const serviceFile = await ls.generateFile(template, service);

    // Install
    shelly.echoGreen(`Installing linux service '${serviceName}'`);
    ls.install(serviceConfig, serviceFile);
  }

}

const app = new App();
app.install();
