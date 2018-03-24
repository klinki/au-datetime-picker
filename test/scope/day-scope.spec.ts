import { DayScope, SelectionScope } from '../../src/scope';

describe('DayScope', () => {
  const date = new Date(2018, 3, 24, 15, 0, 0, 0);
  let dayScope: DayScope;

  beforeEach(() => {
    dayScope = new DayScope();
  });

  it('next should move to next moth', () => {
    const result = dayScope.next(date);

    expect(result.getMonth()).toBe(date.getMonth() + 1);
  });

  it('previous should move to previous month', () => {
    const result = dayScope.previous(date);

    expect(result.getMonth()).toBe(date.getMonth() - 1);
  });

  it('getItems should return expected items', () => {
    const result = dayScope.getItems(date);

    expect(result.length).toBe(42);
  });

  it('formatDate should use correct format', () => {
    const result = dayScope.formatDate(date);
    expect(result).toBe('24');
  });

  it('title should return expected result', () => {
    const result = dayScope.title(date);
    expect(result).toBe('April 2018');
  });

  it('isEqual should compare only date parts when there is no previous scope', () => {
    let a = new Date(2018, 3, 24, 0, 0, 0, 0);
    let b = new Date(2018, 3, 24, 15, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(true);

    a = new Date(2018, 3, 24, 0, 0, 0, 0);
    b = new Date(2018, 3, 25, 0, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(false);

    a = new Date(2018, 3, 23, 0, 0, 0, 0);
    b = new Date(2018, 3, 24, 0, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(false);

    /** This tests if only days are compared or not */
    a = new Date(2018, 3, 23, 0, 0, 0, 0);
    b = new Date(2019, 3, 23, 0, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(true);

    a = new Date(2018, 2, 23, 0, 0, 0, 0);
    b = new Date(2018, 3, 23, 0, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(true);
  });

  it('isEqual should use also previous scopes in comparison', () => {
    const previousScope: Partial<SelectionScope> = {
      isEqual: (first: Date, second: Date) => first.getMonth() === second.getMonth()
    };

    dayScope.setPreviousScope(previousScope as SelectionScope);

    let a = new Date(2018, 3, 24, 0, 0, 0, 0);
    let b = new Date(2018, 3, 24, 15, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(true);

    a = new Date(2018, 3, 24, 0, 0, 0, 0);
    b = new Date(2018, 3, 25, 0, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(false);

    a = new Date(2018, 3, 23, 0, 0, 0, 0);
    b = new Date(2018, 3, 24, 0, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(false);

    /** These test if previous is correctly called or not */
    a = new Date(2018, 2, 23, 0, 0, 0, 0);
    b = new Date(2018, 3, 23, 0, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(false);

    a = new Date(2019, 3, 23, 0, 0, 0, 0);
    b = new Date(2018, 3, 23, 0, 0, 0, 0);

    expect(dayScope.isEqual(a, b)).toBe(true);
  });
});
