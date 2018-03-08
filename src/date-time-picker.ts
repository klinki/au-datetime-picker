import { autoinject, bindable, bindingMode } from 'aurelia-framework';
import { addDays, addHours, addMinutes, addMonths, addYears,
  format as formatDate, getDate, getMonth, getYear, parse as parseDate,
  startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';

// TOOD: Import only required parts
// (window as any).Popper = Popper;
// import 'bootstrap/js/dist/dropdown';
import 'bootstrap';
import Popper from 'popper.js';

import { userLocale } from '../../../shared/services/moment.service';

import { BaseStrategy, DaySelectionStrategy, MonthSelectionStrategy,
  SelectionStrategy, YearSelectionStrategy } from './date-time-picker-strategies';

@autoinject()
export class DateTimePicker {
  protected locale: any;

  @bindable({defaultBindingMode: bindingMode.twoWay})
  protected selectedDate: Date;
  protected viewedDate: Date;

  protected now: Date;

  protected currentScope: SelectionStrategy;
  protected strategies: BaseStrategy[];

  @bindable
  protected options: any = { format: 'DD. MM. YYYY HH:mm' };

  protected popper: Popper;
  protected poppedElement: Element;

  constructor(protected element: Element) {
    this.locale = userLocale;

    this.strategies = [
      new YearSelectionStrategy(),
      new MonthSelectionStrategy(),
      new DaySelectionStrategy()
    ];

    this.strategies.forEach((strategy, index, array) => {
      if (index + 1 < array.length) {
        strategy.setNextStrategy(array[index + 1]);
      }

      if (index - 1 >= 0) {
        strategy.setPreviousStrategy(array[index - 1]);
      }
    });

    this.currentScope = this.strategies[this.strategies.length - 1];
  }

  public created() {
    this.initialize();
  }

  protected hideCallback;

  public attached() {
    const reference = $(this.element).find('.datepicker-input');
    this.poppedElement = $(this.element).find('.dropdown-menu').get(0);

    const self = this;

    this.hideCallback = (event) => {
      if (!$(self.poppedElement).is(event.target) &&
        $(self.poppedElement).has(event.target).length === 0
        && !$(reference).is(event.target)) {
          self.hide();
      }
    };

    $('body').on('click', this.hideCallback);

    this.popper = new Popper(reference.get(0), this.poppedElement, {
      placement: 'auto-start'
    });
  }
/*
  public bind(bindingContext: object, overrideContext: object) {
    const options = this.element.getAttribute('options');
    const selectedDate = this.element.getAttribute('selected-date') as any;

    this.selectedDate = selectedDate ? selectedDate : new Date();
  }
*/
  public detached() {
    $('body').off('click', this.hideCallback);
  }

  public optionsChanged(newValue, oldValue) {
    if (!newValue) {
      this.options = { format: 'DD. MM. YYYY HH:mm' };
    }
  }

  public selectedDateChanged(newValue, oldValue) {
    if (isNaN(Date.parse(newValue)) && newValue !== null) {
      throw new Error('Datetimepicker, model.bind must be of type Date');
    }

    if (!newValue) {
      this.selectedDate = new Date();
    }
  }

  private initialize() {
    this.locale = userLocale;
    this.now = this.viewedDate = this.selectedDate = new Date();
  }

  public getDaysOfWeek() {
    const firstDay = this.getFirstDayOfWeek(new Date());

    const daysOfWeek = Array.from(new Array(7), (_, index) => addDays(firstDay, index))
      .map((date) => this.formatDate(date, 'dd'));

    return daysOfWeek;
  }

  public getOptions(currentScope: SelectionStrategy, date) {
    return currentScope.getItems(date);
  }

  public getFirstDayOfWeek(date) {
    return startOfWeek(date, { weekStartsOn: 1 } );
  }

  public next() {
    this.viewedDate = this.currentScope.next(this.viewedDate);
  }

  public previous() {
    this.viewedDate = this.currentScope.previous(this.viewedDate);
  }

  public selectItem(item: Date): void {
    this.viewedDate = item;

    if (this.currentScope.isFinal()) {
      this.selectedDate = item;
    } else {
      this.currentScope = this.currentScope.nextStrategy();
    }
  }

  public isSelected(date: Date) {
    return this.currentScope.isEqual(date, this.selectedDate);
  }

  public isDisplayed(date: Date) {
    return !this.currentScope.isFinal() &&
      this.currentScope.isEqual(date, this.viewedDate);
  }

  public isNow(date: Date) {
    return this.currentScope.isEqual(date, this.now);
  }

  public showDays(): boolean {
    return this.currentScope.isFinal();
  }

  public getLabel(item: Date): string {
    return this.currentScope.formatDate(item, this.locale);
  }

  public zoomOut() {
    const previousStrategy = this.currentScope.previousStrategy();

    if (previousStrategy != null) {
      this.currentScope = previousStrategy;
      this.viewedDate = new Date(this.viewedDate);
    }
  }

  public formatDate(date, format) {
    return formatDate(date, format, { locale: this.locale });
  }

  public getTitle(date: Date): string {
    return this.currentScope.title(date, this.locale);
  }

  public getItemClasses(date: Date): string {
    const classes = [];

    if (this.isDisplayed(date)) {
      classes.push('displayed');
    }

    if (this.isSelected(date)) {
      classes.push('selected');
    }

    if (this.isNow(date)) {
      classes.push('now');
    }

    if (this.currentScope.isFinal()) {
      classes.push('picker-small');
    } else {
      classes.push('picker-large');
    }

    return classes.join(' ');
  }

  public amPm = 'AM';
  public mode = 'date';

  public toggleAmPm() {
    if (this.amPm === 'AM') {
      this.selectedDate = addHours(this.selectedDate, 12);
      this.amPm = 'PM';
    } else {
      this.selectedDate = addHours(this.selectedDate, -12);
      this.amPm = 'AM';
    }
  }

  public toggleMode() {
    this.mode = this.mode === 'date' ? 'time' : 'date';
  }

  public addHours(hours: number) {
    this.selectedDate = addHours(this.selectedDate, hours);
  }

  public addMinutes(minutes: number) {
    this.selectedDate = addMinutes(this.selectedDate, minutes);
  }

  public selectHours() {

  }

  public selectMinutes() {

  }

  public show() {
    $(this.poppedElement).toggle();
  }

  public hide() {
    $(this.poppedElement).hide();
  }
}
