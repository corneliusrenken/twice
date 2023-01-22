import { Habit, SelectedOccurrence, View } from '../../globalTypes';

export default function getBodyHeight(
  view: View,
  habits: Habit[],
  selectedOccurrences: SelectedOccurrence[],
) {
  switch (view.name) {
    case 'today': return habits.length * 50;
    case 'yesterday': return habits.length * 50;
    case 'selection': return habits.length * 50 + 50;
    case 'history': return (selectedOccurrences.length / 7 - 1) * 50;
    case 'focus': return (selectedOccurrences.length / 7 - 1) * 50;
    default: return 0;
  }
}
