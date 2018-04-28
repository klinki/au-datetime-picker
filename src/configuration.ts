import { DEFAULT_SCOPES } from './scope/default-scopes';
import { DateTimePickerConfiguration } from './configuration';
import { SelectionScope } from './scope/scope-interface';

export interface DateTimePickerConfiguration {
  format?: string;
  locale?: any;
  weekStartsOn?: 0|1;
  scopes?: SelectionScope[];
  initialScope?: SelectionScope;
  showOnInputFocus?: boolean;
}

export const DEFAULT_CONFIGURATION: DateTimePickerConfiguration = {
  format: 'DD. MM. YYYY HH:mm',
  weekStartsOn: 1,
  scopes: DEFAULT_SCOPES.array,
  initialScope: DEFAULT_SCOPES.initial,
  showOnInputFocus: true
};
