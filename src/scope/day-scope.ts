import { format as formatDate, addMonths, startOfMonth, startOfDay, addDays, getDate } from 'date-fns';

import { AbstractScope } from './abstract-scope';
import { getFirstDayOfWeek } from './helpers';

export class DayScope extends AbstractScope {
  public next(selectedDate: Date) {
    return addMonths(selectedDate, 1);
  }

  public previous(selectedDate: Date) {
    return addMonths(selectedDate, -1);
  }

  public getItems(selectedDate: Date) {
    // TODO: locale startofweek
    const initialDate = [selectedDate]
      .map(date => startOfMonth(date))
      .map(date => getFirstDayOfWeek(date))
      .map(date => startOfDay(date))
      .pop();

    const days = Array.from(new Array(42), (_, index) => addDays(initialDate, index));

    return days;
  }

  public formatDate(date: Date): string {
    return formatDate(date, 'D');
  }

  public title(date: Date, locale?: any): string {
    const options = locale ? { locale } : this._formattiongOptions;

    return formatDate(date, 'MMMM YYYY', options);
  }

  public isEqual(a: Date, b: Date): boolean {
    return this.previousScope().isEqual(a, b)
     && getDate(a) === getDate(b);
  }
}
