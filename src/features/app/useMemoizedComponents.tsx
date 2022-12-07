import React, { useMemo } from 'react';
import {
  DayObject,
  SelectedOccurrence,
  View,
  Streaks,
  Habit,
  ListView,
  OccurrenceData,
} from '../../globalTypes';
import Dates from '../dates';
import Days from '../days';
import List from '../list';
import Occurrences from '../occurrences';

type States = {
  view: View;
  listView: ListView;
  dayObject: DayObject;
  selectedHabits: Habit[];
  selectedOccurrences: SelectedOccurrence[];
  selectedStreaks: Streaks;
  occurrenceData: OccurrenceData | undefined;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  addHabit: (name: string) => void;
  removeHabit: (habitId: number) => void;
  renameHabit: (habitId: number, name: string) => void;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
  updateHabitOrder: (habitId: number, newOrder: number) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedComponents(states: States) {
  const {
    view,
    listView,
    dayObject,
    selectedHabits,
    selectedOccurrences,
    selectedStreaks,
    occurrenceData,
    selectedIndex,
    setSelectedIndex,
    inInput,
    setInInput,
    addHabit,
    removeHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
  } = states;

  const occurrences = useMemo(() => (
    <Occurrences
      displayed={view === 'history'}
      selectedOccurrences={selectedOccurrences}
    />
  ), [selectedOccurrences, view]);

  const days = useMemo(() => (
    <Days
      weekDays={dayObject.weekDays}
      selectedOccurrences={selectedOccurrences}
    />
  ), [dayObject.weekDays, selectedOccurrences]);

  const dates = useMemo(() => (
    <Dates
      todaysIndex={dayObject.weekDayIndex}
      selectedOccurrences={selectedOccurrences}
    />
  ), [dayObject.weekDayIndex, selectedOccurrences]);

  const list = useMemo(() => (
    occurrenceData !== undefined
      ? (
        <List
          selectedHabits={selectedHabits}
          streaks={selectedStreaks}
          todaysOccurrences={occurrenceData.dates[dayObject.dateString]}
          listView={listView}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          inInput={inInput}
          setInInput={setInInput}
          addHabit={addHabit}
          removeHabit={removeHabit}
          renameHabit={renameHabit}
          updateHabitCompleted={updateHabitCompleted}
          updateHabitOrder={updateHabitOrder}
          updateHabitVisibility={updateHabitVisibility}
        />
      )
      : <div />
  ), [
    selectedStreaks,
    dayObject.dateString,
    listView,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    inInput,
    setInInput,
    setSelectedIndex,
    addHabit,
    removeHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
  ]);

  return {
    occurrences,
    days,
    dates,
    list,
  };
}
