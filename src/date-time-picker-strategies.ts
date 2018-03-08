// tslint:disable:max-classes-per-file
import { addDays, addHours, addMinutes, addMonths, addYears,
  format as formatDate, getDate, getHours, getMinutes, getMonth,
  getYear, startOfDay, startOfHour, startOfMonth, startOfWeek,
  startOfYear } from 'date-fns';

export interface SelectionStrategy {
  next(date: Date): Date;
  previous(date: Date): Date;
  getItems(date: Date): Date[];

  nextStrategy(): SelectionStrategy;
  previousStrategy(): SelectionStrategy;
  isFinal(): boolean;

  formatDate(date: Date, loacale?: any): string;
  title(date: Date, locale?: any): string;

  isEqual(a: Date, b: Date): boolean;
}

export abstract class BaseStrategy implements SelectionStrategy {
  protected _previousStrategy: SelectionStrategy = null;
  protected _nextStrategy: SelectionStrategy = null;
  protected _locale: any;
  protected _formattiongOptions: any;

  constructor(locale?: any) {
    this.setLocale(locale);
  }

  public abstract next(date: Date): Date;
  public abstract previous(date: Date): Date;
  public abstract getItems(date: Date): Date[];

  public setNextStrategy(strategy: SelectionStrategy) {
    this._nextStrategy = strategy;
  }

  public nextStrategy(): SelectionStrategy {
    return this._nextStrategy;
  }

  public setPreviousStrategy(strategy: SelectionStrategy) {
    this._previousStrategy = strategy;
  }

  public previousStrategy(): SelectionStrategy {
    return this._previousStrategy;
  }

  public isFinal(): boolean {
    return this._nextStrategy === null;
  }

  public abstract formatDate(date: Date): string;

  public abstract title(date: Date): string;

  public abstract isEqual(a: Date, b: Date): boolean;

  public setLocale(locale: any) {
    this._locale = locale;

    if (this._locale) {
      this._formattiongOptions = { locale: this._locale };
    } else {
      this._formattiongOptions = undefined;
    }
  }
}

export class YearSelectionStrategy extends BaseStrategy {
  public next(selectedDate) {
    return addYears(selectedDate, 10);
  }

  public previous(selectedDate) {
    return addYears(selectedDate, -10);
  }

  public getItems(selectedDate) {
    // todo locale startofweek
    const initialDate = [selectedDate]
      .map(startOfYear)
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
    return getYear(a) === getYear(b);
  }
}

export class MonthSelectionStrategy extends BaseStrategy {
  public next(selectedDate) {
    return addYears(selectedDate, 1);
  }

  public previous(selectedDate) {
    return addYears(selectedDate, -1);
  }

  public getItems(selectedDate) {
    // todo locale startofweek
    const initialDate = [selectedDate]
      .map(startOfMonth)
      .map((date) => getFirstDayOfWeek(date))
      .map(startOfDay)
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
    return this.previousStrategy().isEqual(a, b)
     && getMonth(a) === getMonth(b);
  }
}

export class DaySelectionStrategy extends BaseStrategy {
  protected _previousStrategy: SelectionStrategy;
  protected _nextStrategy: SelectionStrategy;

  public next(selectedDate) {
    return addMonths(selectedDate, 1);
  }

  public previous(selectedDate) {
    return addMonths(selectedDate, -1);
  }

  public getItems(selectedDate) {
    // todo locale startofweek
    const initialDate = [selectedDate]
      .map(startOfMonth)
      .map((date) => getFirstDayOfWeek(date))
      .map(startOfDay)
      .pop();

    const days = Array.from(new Array(42), (_, index) => addDays(initialDate, index));

    return days;
  }

  public formatDate(date: Date): string {
    return formatDate(date, 'D');
  }

  public title(date: Date, locale?: any): string {
    const options = locale ? { locale } : this._formattiongOptions;

    return formatDate(date, 'MMMM YYYY', this._formattiongOptions);
  }

  public isEqual(a: Date, b: Date): boolean {
    return this.previousStrategy().isEqual(a, b)
     && getDate(a) === getDate(b);
  }
}

export class HourSelectionStrategy extends BaseStrategy {
  protected _previousStrategy: SelectionStrategy;
  protected _nextStrategy: SelectionStrategy;

  public next(selectedDate) {
    return addHours(selectedDate, 1);
  }

  public previous(selectedDate) {
    return addHours(selectedDate, -1);
  }

  public getItems(selectedDate) {
    // todo locale startofweek
    const initialDate = [selectedDate]
      .map(startOfDay)
      .pop();

    const hours = Array.from(new Array(12), (_, index) => addHours(initialDate, index));

    return hours;
  }

  public formatDate(date: Date): string {
    return formatDate(date, 'HH');
  }

  public title(date: Date): string {
    return formatDate(date, 'DD. MM. YYYY');
  }

  public isEqual(a: Date, b: Date): boolean {
    return this.previousStrategy().isEqual(a, b)
     && getHours(a) === getHours(b);
  }
}

export class MinuteSelectionStrategy extends BaseStrategy {
  protected _previousStrategy: SelectionStrategy;
  protected _nextStrategy: SelectionStrategy;

  public next(selectedDate) {
    return addMinutes(selectedDate, 1);
  }

  public previous(selectedDate) {
    return addMinutes(selectedDate, -1);
  }

  public getItems(selectedDate) {
    const initialDate = [selectedDate]
      .map(startOfDay)
      .map(startOfHour)
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
    return this.previousStrategy().isEqual(a, b)
     && getMinutes(a) === getMinutes(b);
  }
}

function getFirstDayOfWeek(date) {
  return startOfWeek(date, { weekStartsOn: 1 } );
}
