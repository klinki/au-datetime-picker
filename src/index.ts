import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export * from './au-date-time-picker';


export function configure(config: FrameworkConfiguration) {
  config.globalResources(PLATFORM.moduleName('./au-date-time-picker'));
}
