import { Database } from 'better-sqlite3';
import { getHabits } from '../queries';

// eslint-disable-next-line import/prefer-default-export
export function verifyOrderInListValues(database: Database, expectedNameOrder?: string[]) {
  const habits = getHabits(database);

  habits.forEach((habit, index) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, order_in_list } = habit;
    expect(order_in_list).toBe(index);
    if (expectedNameOrder) {
      expect(name).toBe(expectedNameOrder[index]);
    }
  });
}