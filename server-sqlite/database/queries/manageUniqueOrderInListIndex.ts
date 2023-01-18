import { Database } from 'better-sqlite3';

export function setUniqueOrderInListIndex(database: Database) {
  const createUniqueOrderInListIndexStmt = database.prepare(`
    CREATE UNIQUE INDEX IF NOT EXISTS ux_habits_order_in_list ON habits(order_in_list)
  `);
  createUniqueOrderInListIndexStmt.run();
}

export function dropUniqueOrderInListIndex(database: Database) {
  const dropUniqueOrderInListIndexStmt = database.prepare('DROP INDEX ux_habits_order_in_list');
  dropUniqueOrderInListIndexStmt.run();
}
