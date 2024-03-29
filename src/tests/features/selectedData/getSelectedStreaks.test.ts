import { getDateFromDateString } from '../../../features/common/dateStringFunctions';
import getDateObject from '../../../features/common/getDateObject';
import getSelectedStreaks from '../../../features/selectedData/getSelectedStreaks';
import {
  OccurrenceData,
  Streaks,
  DateObject,
} from '../../../globalTypes';
import PseudoUseState from '../helperFunctions/pseudoUseState';

let streaksState: PseudoUseState<Streaks>;
let occurrenceDataState: PseudoUseState<OccurrenceData>;
let dateObject: DateObject;

beforeEach(() => {
  streaksState = new PseudoUseState<Streaks>({
    1: { current: 3, maximum: 3 },
    2: { current: 2, maximum: 2 },
    3: { current: 0, maximum: 2 },
    4: { current: 0, maximum: 2 },
  });

  occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: {
      1: '2023-02-09',
      2: '2023-02-09',
      3: '2023-02-09',
      4: '2023-02-09',
    },
    dates: {
      '2023-02-09': {
        1: { complete: true, visible: true },
        2: { complete: true, visible: true },
        3: { complete: true, visible: true },
        4: { complete: true, visible: true },
      },
      '2023-02-10': {
        2: { complete: true, visible: true },
        4: { complete: true, visible: true },

      },
      '2023-02-11': {
        1: { complete: true, visible: true },
        3: { complete: true, visible: true },

      },
      '2023-02-12': {
        1: { complete: true, visible: true },
        2: { complete: true, visible: true },
        3: { complete: true, visible: true },
        4: { complete: true, visible: true },

      },
      '2023-02-13': {
        1: { complete: true, visible: true },
        2: { complete: true, visible: true },
      },
    },
  });

  //        occurrences | habit id | current | maximum
  //     based on today | 1        | 3       | 3
  //                    | 2        | 2       | 2
  //                    | 3        | 0       | 2
  //                    | 4        | 0       | 2
  // based on yesterday | 1        | 3       | 3
  //                    | 2        | 2       | 2
  //                    | 3        | 2       | 2
  //                    | 4        | 1       | 2

  dateObject = getDateObject('Mon', getDateFromDateString('2023-02-14'));
});

test('returns the streaks state if the view is anything but \'yesterday\'', () => {
  expect(getSelectedStreaks({
    streaks: streaksState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'today' },
  })).toEqual(streaksState.value);

  expect(getSelectedStreaks({
    streaks: streaksState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'selection' },
  })).toEqual(streaksState.value);
});

// recalculate streak, the function used, already tested separately
test('recalculates streak based on yesterday if view is \'yesterday\'', () => {
  expect(getSelectedStreaks({
    streaks: streaksState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'yesterday' },
  })).toEqual({
    1: { current: 3, maximum: 3 },
    2: { current: 2, maximum: 2 },
    3: { current: 2, maximum: 2 },
    4: { current: 1, maximum: 2 },
  });
});
