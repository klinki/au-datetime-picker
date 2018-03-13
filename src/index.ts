import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export * from './date-time-picker';


export function configure(config: FrameworkConfiguration) {
  config.globalResources(PLATFORM.moduleName('./date-time-picker'));
}
