import { useContext, useEffect, useRef } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { Config } from '../../api/config/defaultConfig';
import {
  DateObject,
  Habit,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import getDateObject from '../common/getDateObject';
import ConfigContext from '../configLoader/ConfigContext';
import onDateChange from '../onDateChange/onDateChange';
import TaskQueue from '../taskQueue';
import initialize from './initialize';

type States = {
  queue: TaskQueue;
  dateObject: DateObject;
  inInput: boolean;
  reorderingList: boolean;
  setDateObject: React.Dispatch<React.SetStateAction<DateObject>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
};

function initializeAfterQueueFinishedRunning({
  queue,
  startWeekOn,
  showBoundary,
  setDateObject,
  setSelectedIndex,
  setHabits,
  setOccurrenceData,
  setStreaks,
  setView,
}: {
  queue: TaskQueue;
  startWeekOn: Config['startWeekOn'];
  showBoundary: (error: any) => void;
  setDateObject: React.Dispatch<React.SetStateAction<DateObject>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
}) {
  if (!queue.running) {
    const newDateObject = getDateObject(startWeekOn);
    setDateObject(newDateObject);
    initialize(newDateObject.today.dateString, {
      showBoundary,
      setSelectedIndex,
      setHabits,
      setOccurrenceData,
      setStreaks,
      setView,
    });
  } else {
    const onQueueFinishedRunning = () => {
      queue.onFinishedRunning.splice(
        queue.onFinishedRunning.indexOf(onQueueFinishedRunning),
        1,
      );

      const newDateObject = getDateObject(startWeekOn);
      setDateObject(newDateObject);
      initialize(newDateObject.today.dateString, {
        showBoundary,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    };

    queue.onFinishedRunning.push(onQueueFinishedRunning);
  }
}

export default function useDailyInitializer({
  queue,
  dateObject,
  inInput,
  reorderingList,
  setDateObject,
  setSelectedIndex,
  setHabits,
  setOccurrenceData,
  setStreaks,
  setView,
}: States) {
  const { showBoundary } = useErrorBoundary();
  const { startWeekOn } = useContext(ConfigContext);

  const lastUsedStartWeekOn = useRef(startWeekOn);
  const firstRender = useRef(true);
  const waitingOnReorderingListOrInInput = useRef(false);

  // initialize after user is no longer in input or reordering list
  useEffect(() => {
    if (waitingOnReorderingListOrInInput.current && !inInput && !reorderingList) {
      waitingOnReorderingListOrInInput.current = false;

      initializeAfterQueueFinishedRunning({
        queue,
        startWeekOn,
        showBoundary,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    }
  }, [
    showBoundary,
    inInput,
    queue,
    startWeekOn,
    reorderingList,
    setDateObject,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);

  // initialize after start week on property in config changes
  useEffect(() => {
    if (startWeekOn !== lastUsedStartWeekOn.current) {
      lastUsedStartWeekOn.current = startWeekOn;

      if (inInput || reorderingList) {
        waitingOnReorderingListOrInInput.current = true;
        return;
      }

      initializeAfterQueueFinishedRunning({
        queue,
        startWeekOn,
        showBoundary,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    }
  }, [
    showBoundary,
    inInput,
    queue,
    startWeekOn,
    reorderingList,
    setDateObject,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);

  // initialize on first render
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      initialize(dateObject.today.dateString, {
        showBoundary,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    }
  }, [
    showBoundary,
    dateObject.today.dateString,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);

  // initialize on date change
  useEffect(() => {
    const cancelInterval = onDateChange(dateObject.today.dateString, () => {
      if (inInput || reorderingList) {
        waitingOnReorderingListOrInInput.current = true;
        return;
      }

      initializeAfterQueueFinishedRunning({
        queue,
        startWeekOn,
        showBoundary,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    });

    return cancelInterval;
  }, [
    showBoundary,
    dateObject.today.dateString,
    inInput,
    queue,
    startWeekOn,
    reorderingList,
    setDateObject,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);
}
