import { startOfWeek } from 'date-fns';

export function getFirstDayOfWeek(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 } );
}
