import { autoinject, bindable, bindingMode } from 'aurelia-framework';
import { addDays, addHours, addMinutes, addMonths, addYears,
  format as formatDate, getDate, getMonth, getYear, parse as parseDate,
  startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';

import Popper from 'popper.js';

import { BaseStrategy, DaySelectionStrategy, MonthSelectionStrategy,
  SelectionStrategy, YearSelectionStrategy } from './date-time-picker-strategies';

@autoinject()
export class DateTimePicker {
  protected locale: any;

  @bindable({defaultBindingMode: bindingMode.twoWay})
  protected selectedDate: Date;

  @bindable({defaultBindingMode: bindingMode.twoWay})
  protected textValue: string;

  protected viewedDate: Date;
  protected now: Date;

  protected currentScope: SelectionStrategy;
  protected strategies: BaseStrategy[];

  @bindable
  protected options: any = { format: 'DD. MM. YYYY HH:mm' };

  protected popper: Popper;
  protected poppedElement: HTMLElement;
  protected hideCallback: (event: any) => void;

  public amPm = 'AM';
  public mode = 'date';

  constructor(protected element: Element) {
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

  protected jQueryHas(element: HTMLElement, target: HTMLElement): boolean {
    return element !== target && element.contains(target);
  }

  public attached() {
    const reference = this.element.querySelectorAll('.datepicker-input').item(0) as HTMLElement;
    this.poppedElement = this.element.querySelectorAll('.dropdown-menu').item(0) as HTMLElement;

    const self = this;

    this.hideCallback = (event) => {
      if (self.poppedElement !== event.target &&
        !self.jQueryHas(self.poppedElement, event.target) &&
        reference !== event.target) {
          self.hide();
      }
    };

    document.getElementsByTagName('body').item(0).addEventListener('click', this.hideCallback);

    this.popper = new Popper(reference, this.poppedElement, {
      placement: 'auto-start'
    });
  }

  public detached() {
    document.getElementsByTagName('body').item(0).removeEventListener('click', this.hideCallback);
  }

  public optionsChanged(newValue: any, oldValue: any) {
    if (!newValue) {
      this.options = { format: 'DD. MM. YYYY HH:mm' };
    }

    if (newValue !== oldValue) {
      console.error('Not yet implemented');
    }
  }

  public selectedDateChanged(newValue: any, oldValue: any) {
    if (isNaN(Date.parse(newValue)) && newValue !== null) {
      throw new Error('Datetimepicker, model.bind must be of type Date');
    }

    if (!newValue) {
      newValue = new Date();
    }

    if (newValue !== oldValue && newValue) {
      this.textValue = this.formatDate(this.selectedDate, this.options.format);
    }
  }

  public textValueChanged(newValue: any, oldValue: any) {
    if (newValue !== oldValue && newValue) {
      this.selectedDate = parseDate(newValue, this.options.format, new Date());
    }
  }

  private initialize() {
    this.now = this.viewedDate = this.selectedDate = new Date();
  }

  public getDaysOfWeek() {
    const firstDay = this.getFirstDayOfWeek(new Date());

    const daysOfWeek = Array.from(new Array(7), (_, index) => addDays(firstDay, index))
      .map((date) => this.formatDate(date, 'dd'));

    return daysOfWeek;
  }

  public getOptions(currentScope: SelectionStrategy, date: Date): Date[] {
    return currentScope.getItems(date);
  }

  public getFirstDayOfWeek(date: Date): Date {
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

  public formatDate(date: Date, format: string) {
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
    console.error('Not yet implemented');
  }

  public selectMinutes() {
    console.error('Not yet implemented');
  }

  public show() {
    this.poppedElement.style.display = '';
  }

  public hide() {
    this.poppedElement.style.display = 'none';
  }
}
