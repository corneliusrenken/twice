import {
  Habit,
  OccurrenceData,
  Streaks,
} from '../../globalTypes';

type States = {
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
};

/**
 * @param date YYYY-MM-DD
 */
export default async function initialize(date: string, states: States) {
  const {
    setSelectedIndex, setHabits, setOccurrenceData, setStreaks,
  } = states;

  try {
    const {
      habits,
      occurrencesGroupedByDate,
      oldestVisibleOccurrenceDates,
      streaks,
    } = await window.electron['initialize-app']({ date });

    const todaysOccurrences = occurrencesGroupedByDate[date];
    const visibleHabitCount = Object.keys(todaysOccurrences).length;

    setSelectedIndex(visibleHabitCount === 0 ? null : 0);
    setHabits(habits);
    setOccurrenceData({
      dates: occurrencesGroupedByDate,
      oldest: oldestVisibleOccurrenceDates,
    });
    setStreaks(streaks);
  } catch (error) {
    throw new Error('Failed to initialize application');
  }
}
