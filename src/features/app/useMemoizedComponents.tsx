import React, { useMemo } from 'react';
import {
  DayObject,
  SelectedOccurrence,
  View,
  Streaks,
  Habit,
  ListView,
  OccurrenceData,
  ModalContentGenerator,
} from '../../globalTypes';
import Dates from '../dates';
import Days from '../days';
import List from '../list';
import Occurrences from '../occurrences';

type States = {
  view: View;
  latchedListView: ListView;
  dayObject: DayObject;
  selectedHabits: Habit[];
  selectedOccurrences: SelectedOccurrence[];
  selectedStreaks: Streaks;
  occurrenceData: OccurrenceData | undefined;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  modalContentGenerator: ModalContentGenerator | undefined;
  addHabit: (name: string) => Promise<void>;
  deleteHabit: (habitId: number) => void;
  renameHabit: (habitId: number, name: string) => void;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
  updateHabitOrder: (habitId: number, newOrder: number) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedComponents(states: States) {
  const {
    view,
    latchedListView,
    dayObject,
    selectedHabits,
    selectedOccurrences,
    selectedStreaks,
    occurrenceData,
    selectedIndex,
    setSelectedIndex,
    inInput,
    setInInput,
    reorderingList,
    setReorderingList,
    modalContentGenerator,
    addHabit,
    deleteHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
  } = states;

  const occurrences = useMemo(() => (
    <Occurrences
      displayed={view.name === 'history' || view.name === 'focus'}
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
      latchedListView={latchedListView}
      todaysIndex={dayObject.weekDayIndex}
      selectedOccurrences={selectedOccurrences}
    />
  ), [latchedListView, dayObject.weekDayIndex, selectedOccurrences]);

  const list = useMemo(() => (
    occurrenceData !== undefined
      ? (
        <List
          allowTabTraversal={modalContentGenerator === undefined}
          selectedHabits={selectedHabits}
          streaks={selectedStreaks}
          todaysOccurrences={occurrenceData.dates[dayObject.dateString]}
          latchedListView={latchedListView}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          inInput={inInput}
          setInInput={setInInput}
          reorderingList={reorderingList}
          setReorderingList={setReorderingList}
          addHabit={addHabit}
          deleteHabit={deleteHabit}
          renameHabit={renameHabit}
          updateHabitCompleted={updateHabitCompleted}
          updateHabitOrder={updateHabitOrder}
          updateHabitVisibility={updateHabitVisibility}
        />
      )
      : <div />
  ), [
    modalContentGenerator,
    selectedStreaks,
    dayObject.dateString,
    latchedListView,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    inInput,
    setInInput,
    reorderingList,
    setReorderingList,
    setSelectedIndex,
    addHabit,
    deleteHabit,
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
