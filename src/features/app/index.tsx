import React, {
  useEffect, useMemo, useState,
} from 'react';
import getDateObject from '../common/getDateObject';
import getTextWidthInPx from './getTextWidthInPx';
import {
  Habit,
  ListView,
  ModalContentGenerator,
  OccurrenceData,
  OccurrenceView,
  Streaks,
  View,
} from '../../globalTypes';
import TransitionManager from '../transitionManager';
import getBodyHeight from './getBodyHeight';
import initialize from './initialize';
import useApiFunctions from '../apiFunctions/useApiFunctions';
import useMemoizedComponents from './useMemoizedComponents';
import useSelectedData from './useSelectedData';
import Modal from '../modal';
import useShortcutManager from '../shortcutManager/useShortcutManager';
import Layout from '../layout';
import LayoutTestingMenu from '../layout/layoutTestingMenu';

export default function App() {
  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // using a function in useState makes it's initializer only run once instead of on every cycle
  const [dateObject] = useState(() => getDateObject(6));
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [view, _setView] = useState<View>({ name: 'today' });
  const [latchedListView, setLatchedListView] = useState<ListView>({ name: 'today' });
  const [latchedOccurrenceView, setLatchedOccurrenceView] = useState<OccurrenceView>({ name: 'history' });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [inInput, setInInput] = useState(false);
  const [reorderingList, setReorderingList] = useState(false);
  const [inTransition, setInTransition] = useState(false);
  // eslint-disable-next-line max-len
  const [modalContentGenerator, setModalContentGenerator] = useState<ModalContentGenerator | undefined>(undefined);
  const [habits, setHabits] = useState<Habit[]>();
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>();
  const [streaks, setStreaks] = useState<Streaks>();

  const setView = (newView: View) => {
    if (newView.name === 'today' || newView.name === 'yesterday' || newView.name === 'selection') {
      setLatchedListView(newView);
    } else {
      setLatchedOccurrenceView(newView);
    }
    _setView(newView);
  };

  useEffect(() => {
    initialize(dateObject.today.dateString, {
      setView,
      setHabits,
      setOccurrenceData,
      setStreaks,
    });
  }, [dateObject]);

  const dayObject = useMemo(() => (
    latchedListView.name === 'yesterday' ? dateObject.yesterday : dateObject.today
  ), [dateObject, latchedListView]);

  useEffect(() => {
    const firstDate = Number(dayObject.weekDateStrings[0].slice(-2));
    const lastDate = Number(dayObject.weekDateStrings[6].slice(-2));
    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(firstDate, 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(lastDate, 15)) / 2}px`);
  }, [dayObject]);

  const selectedData = useSelectedData({
    dateObject,
    habits,
    occurrenceData,
    streaks,
    latchedListView,
    latchedOccurrenceView,
  });

  const {
    addHabit,
    deleteHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
  } = useApiFunctions({
    dateObject,
    dayObject,
    latchedListView,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    selectedIndex,
    setSelectedIndex,
    setModalContentGenerator,
  });

  const components = useMemoizedComponents({
    selectedStreaks: selectedData.streaks,
    dayObject,
    latchedListView,
    occurrenceData,
    selectedHabits: selectedData.habits,
    selectedIndex,
    selectedOccurrences: selectedData.occurrences,
    inInput,
    setInInput,
    setSelectedIndex,
    reorderingList,
    setReorderingList,
    view,
    modalContentGenerator,
    addHabit,
    deleteHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
  });

  useShortcutManager({
    dateObject,
    dayObject,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits: selectedData.habits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setSelectedIndex,
    reorderingList,
    deleteHabit,
    updateHabitCompleted,
    updateHabitVisibility,
  });

  const [minMarginHeight, setMinMarginHeight] = useState(100);
  const [maxListHeight, setMaxListHeight] = useState(2000);
  const [listRows, setListRows] = useState(10);
  const [occurrenceRows, setOccurrenceRows] = useState(27);

  if (!habits || !occurrenceData || !streaks) return null;

  return (
    <>
      <LayoutTestingMenu
        minMarginHeight={minMarginHeight}
        maxListHeight={maxListHeight}
        listRows={listRows}
        occurrenceRows={occurrenceRows}
        setMinMarginHeight={setMinMarginHeight}
        setMaxListHeight={setMaxListHeight}
        setListRows={setListRows}
        setOccurrenceRows={setOccurrenceRows}
      />
      <Layout
        layoutOptions={{
          minMarginHeight,
          maxListHeight,
        }}
        view={view}
        listRows={listRows}
        occurrenceRows={occurrenceRows}
        setInTransition={setInTransition}
      />
    </>
  );

  return (
    <>
      <Modal
        modalContentGenerator={modalContentGenerator}
        setModalContentGenerator={setModalContentGenerator}
      />
      <TransitionManager
        setInTransition={setInTransition}
        view={view}
        bodyHeight={getBodyHeight(view, habits, selectedData.occurrences)}
        occurrences={components.occurrences}
        days={components.days}
        dates={components.dates}
        list={components.list}
      />
    </>
  );
}
