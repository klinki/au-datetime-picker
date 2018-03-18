import { DayScope } from './day-scope';
import { YearScope } from './year-scope';
import { MonthScope } from './month-scope';

const defaultScopesArray = [
  new YearScope(),
  new MonthScope(),
  new DayScope()
].map((scope, index, array) => {
  if (index + 1 < array.length) {
    scope.setNextScope(array[index + 1]);
  }

  if (index - 1 >= 0) {
    scope.setPreviousScope(array[index - 1]);
  }

  return scope;
});


export const DefaultScopes = {
  array: defaultScopesArray,
  initial: defaultScopesArray[defaultScopesArray.length - 1]
};
