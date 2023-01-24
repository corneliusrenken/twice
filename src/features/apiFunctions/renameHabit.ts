import axios from 'axios';
import { Habit } from '../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
};

export default function renameHabit(
  habitId: number,
  name: string,
  states: States,
) {
  const { habits, setHabits } = states;

  if (!habits) throw new Error('states should not be undefined');

  axios({
    method: 'patch',
    url: `/api/habits/${habitId}`,
    data: {
      name,
    },
  });

  const newHabits: Habit[] = habits.map((habit) => {
    if (habit.id !== habitId) return habit;
    return {
      ...habit,
      name,
    };
  });

  setHabits(newHabits);
}