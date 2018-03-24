import { format as formatDate, addHours, startOfDay, getHours, addDays } from 'date-fns';

import { AbstractScope } from './abstract-scope';

export class HourScope extends AbstractScope {
  public next(selectedDate: Date) {
    return addDays(selectedDate, 1);
  }

  public previous(selectedDate: Date) {
    return addDays(selectedDate, -1);
  }

  public getItems(selectedDate: Date) {
    const initialDate = [selectedDate]
      .map(date => startOfDay(date))
      .pop();

    const hours = Array.from(new Array(12), (_, index) => addHours(initialDate, index));

    return hours;
  }

  public formatDate(date: Date, locale?: any): string {
    return formatDate(date, 'HH');
  }

  public title(date: Date): string {
    return formatDate(date, 'DD. MM. YYYY');
  }

  public isEqual(a: Date, b: Date): boolean {
    return this.previousScopeIsEqual(a, b)
     && getHours(a) === getHours(b);
  }
}
