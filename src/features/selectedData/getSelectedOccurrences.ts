import {
  SelectedOccurrence, OccurrenceData, DateObject, View,
} from '../../globalTypes';
import { getDateFromDateString, getDateStringFromDate, getMinimumDateString } from '../common/dateStringFunctions';

type States = {
  occurrenceData: OccurrenceData,
  dateObject: DateObject,
  view: View,
};

export default function getSelectedOccurrences({
  occurrenceData,
  dateObject,
  view,
}: States) {
  const occurences: SelectedOccurrence[] = [];

  const oldestDateString = view.name !== 'focus'
    ? getMinimumDateString(Object.values(occurrenceData.oldest))
    : occurrenceData.oldest[view.focusId];

  const lastDateOfWeek = view.name !== 'yesterday'
    ? getDateFromDateString(dateObject.today.weekDateStrings[6])
    : getDateFromDateString(dateObject.yesterday.weekDateStrings[6]);

  const oldestDate = oldestDateString === null
    ? null
    : getDateFromDateString(oldestDateString);

  const currentDate = new Date(lastDateOfWeek);

  while (
    occurences.length < 7
    || occurences.length % 7 !== 0
    || (oldestDate !== null && currentDate >= oldestDate)
  ) {
    const dateString = getDateStringFromDate(currentDate);

    let complete = false;

    const day = occurrenceData.dates[dateString];
    if (day !== undefined) {
      if (view.name === 'focus') {
        const occurrence = day[view.focusId];
        if (occurrence !== undefined) {
          complete = occurrence.complete && occurrence.visible;
        }
      } else {
        const visibleOccurrences = Object
          .values(day)
          .filter(({ visible }) => visible);

        if (visibleOccurrences.length !== 0) {
          complete = visibleOccurrences.every((occurence) => occurence.complete);
        }
      }
    }

    occurences.push({
      date: Number(dateString.slice(-2)),
      fullDate: dateString,
      complete,
    });

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return occurences.reverse();
}
