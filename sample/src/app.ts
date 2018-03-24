/** Load variables from DefinePlugin */
declare const ENV_VERSION: string;
declare const ENV_COMMITHASH: string;
declare const ENV_DATE: string;
declare const ENV_BRANCH: string;

export class App {
  protected appInfo = {
    version: ENV_VERSION,
    commitHash: ENV_COMMITHASH,
    date: ENV_DATE,
    branch: ENV_BRANCH
  };

  protected message: string;
  protected date: Date;

  constructor() {
    this.message = 'au-datetime-picker example';
  }
}
