import { PLATFORM } from "aurelia-pal";

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-testing'))
    .plugin(PLATFORM.moduleName('au-datetime-picker'))
    .developmentLogging();

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
