import { format as formatDate, addMinutes, startOfDay, startOfHour, getMinutes } from 'date-fns';

import { AbstractScope } from './abstract-scope';

export class MinuteSelectionStrategy extends AbstractScope {
  public next(selectedDate: Date) {
    return addMinutes(selectedDate, 1);
  }

  public previous(selectedDate: Date) {
    return addMinutes(selectedDate, -1);
  }

  public getItems(selectedDate: Date) {
    const initialDate = [selectedDate]
      .map(date => startOfDay(date))
      .map(date => startOfHour(date))
      .pop();

    const minutes = Array.from(new Array(12), (_, index) => addMinutes(initialDate, index * 5));

    return minutes;
  }

  public formatDate(date: Date): string {
    return formatDate(date, 'mm');
  }

  public title(date: Date): string {
    return formatDate(date, 'DD. MM. YYYY');
  }

  public isEqual(a: Date, b: Date): boolean {
    return this.previousScope().isEqual(a, b)
     && getMinutes(a) === getMinutes(b);
  }
}
