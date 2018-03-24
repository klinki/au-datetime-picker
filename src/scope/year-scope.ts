import { format as formatDate, addYears, startOfYear, getYear } from 'date-fns';

import { AbstractScope } from './abstract-scope';

export class YearScope extends AbstractScope {
  public next(selectedDate: Date) {
    return addYears(selectedDate, 10);
  }

  public previous(selectedDate: Date) {
    return addYears(selectedDate, -10);
  }

  public getItems(selectedDate: Date) {
    const initialDate = [selectedDate]
      .map(date => startOfYear(date))
      .pop();

    const years = Array.from(new Array(12), (_, index) => addYears(initialDate, index));

    return years;
  }

  public formatDate(date: Date): string {
    return formatDate(date, 'YYYY');
  }

  public title(date: Date): string {
    const nextDecade = addYears(date, 11);

    const start = formatDate(date, 'YYYY');
    const end = formatDate(nextDecade, 'YYYY');

    return `${start} - ${end}`;
  }

  public isEqual(a: Date, b: Date): boolean {
    return this.previousScopeIsEqual(a, b)
      && getYear(a) === getYear(b);
  }
}
