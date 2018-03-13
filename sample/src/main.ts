export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
//    .plugin('aurelia-testing')
    .plugin('au-datetime-picker')
    .developmentLogging();

  aurelia.start().then(() => aurelia.setRoot());
}
