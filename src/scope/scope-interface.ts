export interface SelectionScope {
  next(date: Date): Date;
  previous(date: Date): Date;
  getItems(date: Date): Date[];

  nextScope(): SelectionScope;
  previousScope(): SelectionScope;
  isFinal(): boolean;

  formatDate(date: Date, loacale?: any): string;
  title(date: Date, locale?: any): string;

  isEqual(a: Date, b: Date): boolean;
}
