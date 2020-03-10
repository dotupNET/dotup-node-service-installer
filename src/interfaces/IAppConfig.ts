export interface IAppConfig {
  Environment: string[];
  postCommands: string[];
  User: string;
  // # Use 'nogroup' group for Ubuntu / Debian
  // # use 'nobody' group for Fedora
  Group: string;
}
