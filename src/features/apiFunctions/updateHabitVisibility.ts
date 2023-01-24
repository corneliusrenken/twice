import { OccurrenceData, Streaks } from '../../globalTypes';
import recalculateStreak from './recalculateStreak';

type States = {
  streaks: Streaks | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default function updateHabitVisibility(
  habitId: number,
  visible: boolean,
  todayDateString: string,
  states: States,
) {
  const {
    streaks, setStreaks, occurrenceData, setOccurrenceData,
  } = states;

  if (!streaks || !occurrenceData) throw new Error('states should not be undefined');

  const todaysOccurrences = { ...occurrenceData.dates[todayDateString] };
  let habitsOldestOccurrence = occurrenceData.oldest[habitId];

  if (visible) {
    if (todaysOccurrences[habitId] === undefined) {
      window.electron['add-occurrence'](habitId, todayDateString);
      todaysOccurrences[habitId] = { visible: true, complete: false };
    } else {
      window.electron['update-occurrence'](habitId, todayDateString, { visible: true });
      todaysOccurrences[habitId] = { ...todaysOccurrences[habitId], visible: true };
    }

    if (habitsOldestOccurrence === null) habitsOldestOccurrence = todayDateString;
  } else {
    if (todaysOccurrences[habitId].complete) {
      window.electron['update-occurrence'](habitId, todayDateString, { visible: false });
      todaysOccurrences[habitId].visible = false;
    } else {
      window.electron['delete-occurrence'](habitId, todayDateString);
      delete todaysOccurrences[habitId];
    }

    if (habitsOldestOccurrence === todayDateString) habitsOldestOccurrence = null;
  }

  const newOccurrenceData: OccurrenceData = {
    oldest: {
      ...occurrenceData.oldest,
      [habitId]: habitsOldestOccurrence,
    },
    dates: {
      ...occurrenceData.dates,
      [todayDateString]: todaysOccurrences,
    },
  };

  const newStreak = recalculateStreak(habitId, todayDateString, newOccurrenceData);

  const newStreaks: Streaks = {
    ...streaks,
    [habitId]: newStreak,
  };

  setStreaks(newStreaks);
  setOccurrenceData(newOccurrenceData);
}
