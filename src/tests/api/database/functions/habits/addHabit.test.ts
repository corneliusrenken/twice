import Database from 'better-sqlite3';
import { addHabit, createTables, openDatabase } from '../../../../../api/database/functions';

let db: Database.Database;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
});

afterEach(() => {
  db.close();
});

/**
 * @param date "YYYY-MM-DD"
 */
const addDay = (date: string) => {
  const addDayStmt = db.prepare('INSERT INTO days (date) VALUES (?)');
  return addDayStmt.run(date).lastInsertRowid;
};

test('if the days table doesn\'t contain an entry with the date passed into the addHabit function, the function should throw an error', () => {
  expect(() => addHabit(db, { name: 'exercise', date: '2023-01-17' })).toThrow('No day entry exists with the passed date');
});

test('adding a habit with a pre-existing name will throw an error', () => {
  addDay('2023-01-17');
  expect(() => addHabit(db, { name: 'exercise', date: '2023-01-17' })).not.toThrow();
  expect(() => addHabit(db, { name: 'exercise', date: '2023-01-17' })).toThrow('UNIQUE constraint failed: habits.name');
});

test('adding a habit with an invalid name will throw an error', () => {
  addDay('2023-01-17');
  expect(() => addHabit(db, { name: '', date: '2023-01-17' })).toThrow('CHECK constraint failed: name NOT IN (\'\')');
});

test('if either the adding of the occurrence or the habit fails, neither should be saved in the database', () => {
  const getHabitsStmt = db.prepare('SELECT id FROM habits');
  const getOccurrencesStmt = db.prepare('SELECT id FROM occurrences');

  expect(() => addHabit(db, { name: '', date: '2023-01-17' })).toThrow();
  expect(getHabitsStmt.all().length).toBe(0);
  expect(getOccurrencesStmt.all().length).toBe(0);

  addDay('2023-01-17');
  addHabit(db, { name: 'exercise', date: '2023-01-17' });
  expect(() => addHabit(db, { name: 'exercise', date: '2023-01-17' })).toThrow();
  expect(getHabitsStmt.all().length).toBe(1);
  expect(getOccurrencesStmt.all().length).toBe(1);
});

test('adding a habit creates a row in habits with the correct name', () => {
  addDay('2023-01-17');
  const habitName = 'exercise';
  addHabit(db, { name: habitName, date: '2023-01-17' });
  const getHabitsStmt = db.prepare('SELECT name FROM habits');
  const habits = getHabitsStmt.all();
  expect(habits.length).toBe(1);
  expect(habits[0].name).toBe(habitName);
});

test('adding a habit returns an object with data that matches the data in the database', () => {
  addDay('2023-01-17');
  const habit = addHabit(db, { name: 'exercise', date: '2023-01-17' });
  const getHabitsStmt = db.prepare('SELECT id, name FROM habits');
  const habitInDb = getHabitsStmt.get();
  expect(habit.id).toBe(habitInDb.id);
  expect(habit.name).toBe(habitInDb.name);
});

test('a new habit will automatically get a list position assigned, equal to how many habits existed before adding the new habit', () => {
  addDay('2023-01-17');
  const exerciseHabit = addHabit(db, { name: 'exercise', date: '2023-01-17' });
  const readHabit = addHabit(db, { name: 'run', date: '2023-01-17' });
  const sleepHabit = addHabit(db, { name: 'sleep', date: '2023-01-17' });
  const getListPositionStmt = db.prepare('SELECT list_position FROM habits WHERE name = ?');
  expect(getListPositionStmt.get(exerciseHabit.name).list_position).toBe(0);
  expect(getListPositionStmt.get(readHabit.name).list_position).toBe(1);
  expect(getListPositionStmt.get(sleepHabit.name).list_position).toBe(2);
});

test('when adding a habit, a visible, but incomplete occurrence is created for that habit on the date that was passed into the addHabit function', () => {
  const date = '2023-01-17';

  const dayId = addDay(date);

  const habit = addHabit(db, { name: 'exercise', date });

  const getOccurrencesStmt = db.prepare('SELECT id, visible, complete, habit_id, day_id FROM occurrences');
  const occurrences = getOccurrencesStmt.all();

  expect(occurrences.length).toBe(1);
  expect(occurrences[0].habit_id).toBe(habit.id);
  expect(occurrences[0].day_id).toBe(dayId);
  expect(occurrences[0].visible).toBe(1);
  expect(occurrences[0].complete).toBe(0);
});
