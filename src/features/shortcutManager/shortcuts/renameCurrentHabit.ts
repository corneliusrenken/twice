import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  selectedIndex: number | null;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function renameCurrentHabit(states: States) {
  const {
    habits,
    selectedIndex,
    setInInput,
  } = states;

  if (!habits || selectedIndex === habits.length) return;
  setInInput(true);
}