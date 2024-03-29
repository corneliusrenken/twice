/* eslint-disable @typescript-eslint/naming-convention */
import { join } from 'path';
import { unlink, readFile } from 'fs/promises';
import { getConfig } from '../../config/functions';
import openDatabase from '../../database/functions/common/openDatabase';
import createTables from '../../database/functions/common/createTables';
import { setDatabaseIpcHandlers } from '../../database';
import seedDatabase from '../../../seedDatabase';
import { getDateStringFromDate } from '../../../features/common/dateStringFunctions';

export default async function initializeDatabase(seed = false) {
  const {
    databaseDirectoryPath,
    _databaseFileName,
  } = await getConfig();

  const databaseFilePath = join(databaseDirectoryPath, _databaseFileName);

  if (seed) {
    try {
      await readFile(databaseFilePath);
      await unlink(databaseFilePath);
    } catch { /* nothing */ }
  }

  const database = openDatabase(databaseFilePath);
  createTables(database);

  if (seed) {
    const habits = ['Read', 'Write', 'Code', 'Exercise', 'Meditate'];
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    seedDatabase(database, getDateStringFromDate(threeMonthsAgo), habits, {
      loginProbabilityDecimal: 0.8,
      habitVisibleProbabilityDecimal: 0.8,
      habitCompleteProbabilityDecimal: 0.7,
    });
  }

  setDatabaseIpcHandlers(database);
}
