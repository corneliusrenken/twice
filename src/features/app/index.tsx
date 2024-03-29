import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import {
  Habit,
  ModalGenerator,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import Modal from '../modal';
import useShortcutManager from '../shortcutManager/useShortcutManager';
import Layout from '../layout';
import useTaskDispatchers from '../tasks/useTaskDispatchers';
import TaskQueue from '../taskQueue';
import getDateObject from '../common/getDateObject';
import useDailyInitializer from './useDailyInitializer';
import Occurrences from '../occurrences';
import Days from '../days';
import Dates from '../dates';
import List from '../list';
import useSelectedData from '../selectedData/useSelectedData';
import { Config } from '../../api/config/defaultConfig';
import ConfigContext from '../configLoader/ConfigContext';
import Icon from '../icon';
import createSettingsModalGenerator from '../settingsModal';
import getLaunchAnimationTime from '../common/getLaunchAnimationTime';

type Props = {
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function App({ setConfig }: Props) {
  const [launchAnimationActive, setLaunchAnimationActive] = useState(true);
  const { showBoundary } = useErrorBoundary();
  const queue = useRef(new TaskQueue(showBoundary)); // initializer ran every render, look into this
  const { startWeekOn } = useContext(ConfigContext);
  const [dateObject, setDateObject] = useState(() => getDateObject(startWeekOn));
  const [view, setView] = useState<View>(() => ({ name: 'today' }));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [inInput, setInInput] = useState(false);
  const [reorderingList, setReorderingList] = useState(false);
  const [inTransition, setInTransition] = useState(false);
  const [modal, setModal] = useState<ModalGenerator | undefined>(undefined);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>({ dates: {}, oldest: {} });
  const [streaks, setStreaks] = useState<Streaks>({});
  const [ignoreMouse, setIgnoreMouse] = useState(true);

  useEffect(() => {
    const launchAnimationTime = getLaunchAnimationTime();
    const postAnimationWait = 300;
    setTimeout(() => setLaunchAnimationActive(false), launchAnimationTime + postAnimationWait);
  }, []);

  // for development
  // for development
  // for development
  // for development
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (document.activeElement !== document.querySelector('body')) {
  //       console.log('focused element', document.activeElement);
  //     }
  //   }, 500);

  //   return () => clearInterval(intervalId);
  // }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (ignoreMouse) {
      const onMouseMove = (e: MouseEvent) => {
        setIgnoreMouse(false);
        window.removeEventListener('mousemove', onMouseMove);
        setTimeout(() => {
          const elementAtMousePosition = document.elementFromPoint(e.clientX, e.clientY);
          if (elementAtMousePosition) {
            elementAtMousePosition.dispatchEvent(new MouseEvent('mouseover', {
              view: window,
              bubbles: true,
              cancelable: true,
            }));
          }
        }, 0);
      };

      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    }
  }, [ignoreMouse]);

  useDailyInitializer({
    queue: queue.current,
    dateObject,
    inInput,
    reorderingList,
    setDateObject,
    setSelectedIndex,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setView,
  });

  const {
    addHabit,
    deleteHabit,
    updateHabitListPosition,
    updateHabitName,
    updateOccurrenceCompleted,
    updateOccurrenceVisibility,
    updateConfig,
  } = useTaskDispatchers({
    queue: queue.current,
    dateObject,
    view,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    setSelectedIndex,
    setInInput,
    setConfig,
  });

  const {
    selectedHabits,
    selectedOccurrences,
    selectedStreaks,
  } = useSelectedData({
    view,
    dateObject,
    occurrenceData,
    habits,
    streaks,
  });

  useShortcutManager(launchAnimationActive, {
    setIgnoreMouse,
    dateObject,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setSelectedIndex,
    reorderingList,
    modal,
    setModal,
    deleteHabit,
    updateOccurrenceCompleted,
    updateOccurrenceVisibility,
    updateHabitListPosition,
    updateConfig,
  });

  if (occurrenceData.dates[dateObject.today.dateString] === undefined) return null;

  return (
    <>
      {launchAnimationActive && <div className="launch-mouse-blocker" style={{ position: 'fixed', inset: 0, zIndex: 5 }} />}
      <Modal
        modal={modal}
        setModal={setModal}
      />
      <Layout
        launchAnimationActive={launchAnimationActive}
        setInTransition={setInTransition}
        freezeScroll={launchAnimationActive || modal !== undefined}
        view={view}
        listHeight={(view.name === 'selection' ? selectedHabits.length + 1 : selectedHabits.length) * 50}
        occurrenceHeight={((selectedOccurrences.length - 7) / 7) * 50}
        occurrences={(
          <Occurrences
            view={view}
            selectedOccurrences={selectedOccurrences}
          />
        )}
        days={(
          <Days
            view={view}
            dateObject={dateObject}
            selectedOccurrences={selectedOccurrences}
          />
        )}
        dates={(
          <Dates
            view={view}
            dateObject={dateObject}
            selectedOccurrences={selectedOccurrences}
          />
        )}
        list={(
          <List
            ignoreMouse={ignoreMouse}
            dateObject={dateObject}
            view={view}
            selectedHabits={selectedHabits}
            selectedStreaks={selectedStreaks}
            occurrenceData={occurrenceData}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            inInput={inInput}
            setInInput={setInInput}
            reorderingList={reorderingList}
            setReorderingList={setReorderingList}
            setModal={setModal}
            addHabit={addHabit}
            deleteHabit={deleteHabit}
            updateHabitListPosition={updateHabitListPosition}
            updateHabitName={updateHabitName}
            updateOccurrenceCompleted={updateOccurrenceCompleted}
            updateOccurrenceVisibility={updateOccurrenceVisibility}
          />
        )}
        settingsButton={(
          <button
            type="button"
            className="settings-button"
            tabIndex={-1}
            onClick={() => {
              const modalGenerator = createSettingsModalGenerator({ updateConfig });
              setModal(() => modalGenerator);
            }}
          >
            <Icon
              icon="gear"
            />
          </button>
        )}
      />
    </>
  );
}
