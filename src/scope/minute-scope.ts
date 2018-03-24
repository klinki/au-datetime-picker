import { format as formatDate, addMinutes, startOfDay, startOfHour, getMinutes, addHours } from 'date-fns';

import { AbstractScope } from './abstract-scope';

export class MinuteScope extends AbstractScope {
  public next(selectedDate: Date) {
    return addHours(selectedDate, 1);
  }

  public previous(selectedDate: Date) {
    return addHours(selectedDate, -1);
  }

  public getItems(selectedDate: Date) {
    const initialDate = [selectedDate]
      .map(date => startOfDay(date))
      .map(date => startOfHour(date))
      .pop();

    const minutes = Array.from(new Array(12), (_, index) => addMinutes(initialDate, index * 5));

    return minutes;
  }

  public formatDate(date: Date, locale?: any): string {
    return formatDate(date, 'mm');
  }

  public title(date: Date): string {
    return formatDate(date, 'DD. MM. YYYY');
  }

  public isEqual(a: Date, b: Date): boolean {
    return this.previousScopeIsEqual(a, b)
     && getMinutes(a) === getMinutes(b);
  }
}
