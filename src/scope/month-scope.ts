import { format as formatDate, addYears, startOfMonth, startOfDay, addMonths, getMonth } from 'date-fns';

import { AbstractScope } from './abstract-scope';
import { getFirstDayOfWeek } from './helpers';

export class MonthScope extends AbstractScope {
  public next(selectedDate: Date) {
    return addYears(selectedDate, 1);
  }

  public previous(selectedDate: Date) {
    return addYears(selectedDate, -1);
  }

  public getItems(selectedDate: Date) {
    // todo locale startofweek
    const initialDate = [selectedDate]
      .map(date => startOfMonth(date))
      .map(date => getFirstDayOfWeek(date))
      .map(date => startOfDay(date))
      .pop();

    const months = Array.from(new Array(12), (_, index) => addMonths(initialDate, index));

    return months;
  }

  public formatDate(date: Date, locale?: any): string {
    const options = locale ? { locale } : this._formattiongOptions;

    return formatDate(date, 'MMM', options);
  }

  public title(date: Date): string {
    return formatDate(date, 'YYYY');
  }
  public isEqual(a: Date, b: Date): boolean {
    return this.previousScopeIsEqual(a, b)
     && getMonth(a) === getMonth(b);
  }
}
