import { SelectionScope } from './scope-interface';

export abstract class AbstractScope implements SelectionScope {
  protected _previousScope: SelectionScope = null;
  protected _nextScope: SelectionScope = null;
  protected _locale: any;
  protected _formattiongOptions: any;

  constructor(locale?: any) {
    this.setLocale(locale);
  }

  public abstract next(date: Date): Date;
  public abstract previous(date: Date): Date;
  public abstract getItems(date: Date): Date[];

  public setNextScope(strategy: SelectionScope) {
    this._nextScope = strategy;
  }

  public nextScope(): SelectionScope {
    return this._nextScope;
  }

  public setPreviousScope(strategy: SelectionScope) {
    this._previousScope = strategy;
  }

  public previousScope(): SelectionScope {
    return this._previousScope;
  }

  public isFinal(): boolean {
    return this._nextScope === null;
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
