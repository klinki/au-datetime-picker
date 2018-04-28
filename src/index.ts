import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export * from './au-date-time-picker';
export * from './configuration';
export * from './scope';

export function configure(config: FrameworkConfiguration) {
  config.globalResources(PLATFORM.moduleName('./au-date-time-picker'));
}
