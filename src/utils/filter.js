import {FilterType} from '../const.js';
import moment from 'moment';

export const getPointsByFilter = (points, filterType) => {
  const nowDate = moment().valueOf();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points.sort((a, b) => a.startDate - b.startDate);
    case FilterType.FUTURE:
      return points.filter(({startDate}) => moment(startDate).isAfter(nowDate, `day`));
    case FilterType.PAST:
      return points.filter(({endDate}) => moment(endDate).isBefore(nowDate, `day`));
  }
  return points;
};
