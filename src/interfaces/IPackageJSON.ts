export interface IPackageJSON {

  readonly name: string;

  readonly version?: string;

  readonly description?: string;

  readonly keywords?: string[];

  readonly homepage?: string;

  readonly bugs?: string | IBugs;

  readonly license?: string;

  readonly author?: string | IAuthor;

  readonly contributors?: string[] | IAuthor[];

  readonly files?: string[];

  readonly main?: string;

  readonly bin?: string | IBin;
  readonly systemd?: string | IBin;

  readonly man?: string | string[];

  readonly directories?: IDirectories;

  readonly repository?: string | IRepository;

  readonly scripts?: IScripts;

  readonly config?: IConfig;

  readonly dependencies?: IDependency;

  readonly devDependencies?: IDependency;

  readonly peerDependencies?: IDependency;

  readonly optionalDependencies?: IDependency;

  readonly bundledDependencies?: string[];

  readonly engines?: IEngines;

  readonly os?: string[];

  readonly cpu?: string[];

  readonly preferGlobal?: boolean;

  readonly private?: boolean;

  readonly publishConfig?: IPublishConfig;

}

export interface IAuthor {
  name: string;
  email?: string;
  homepage?: string;
}

export interface IBin {
  [commandName: string]: string;
}

export interface IBugs {
  email: string;
  url: string;
}

export interface IConfig {
  name?: string;
  config?: Record<string, any>;
}

export interface IDependency {
  [dependencyName: string]: string;
}

export interface IDirectories {
  lib?: string;
  bin?: string;
  man?: string;
  doc?: string;
  example?: string;
}

export interface IEngines {
  node?: string;
  npm?: string;
}

export interface IPublishConfig {
  registry?: string;
}

export interface IRepository {
  type: string;
  url: string;
}

export interface IScripts {
  [scriptName: string]: string;
}
