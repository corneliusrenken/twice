import { Database } from 'better-sqlite3';
import setUniqueIndexOnListPosition from './setUniqueIndexOnListPosition';

export default function createTables(database: Database) {
  const createHabitsTableStmt = database.prepare(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL CHECK (name NOT IN ('')),
      list_position INTEGER NOT NULL
    )
  `);

  createHabitsTableStmt.run();

  // use an index instead of a constraint so that it can be dropped when updating list position
  // as that temporarily creates overlapping values during the update process
  setUniqueIndexOnListPosition(database);

  const createDaysTableStmt = database.prepare(`
    CREATE TABLE IF NOT EXISTS days (
      id INTEGER PRIMARY KEY,
      date TEXT UNIQUE NOT NULL CHECK (date IS strftime('%Y-%m-%d', date))
    )
  `);

  createDaysTableStmt.run();

  const createOccurrencesTableStmt = database.prepare(`
    CREATE TABLE IF NOT EXISTS occurrences (
      id INTEGER PRIMARY KEY,
      visible INTEGER NOT NULL CHECK (visible IN (0, 1)) DEFAULT 1,
      complete INTEGER NOT NULL CHECK (complete IN (0, 1)) DEFAULT 0,
      habit_id INTEGER,
      day_id INTEGER NOT NULL,
      UNIQUE (habit_id, day_id),
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE SET NULL,
      FOREIGN KEY (day_id) REFERENCES days (id) ON DELETE CASCADE
    )
  `);

  createOccurrencesTableStmt.run();
}
