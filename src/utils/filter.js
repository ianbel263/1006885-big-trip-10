import {FilterType} from '../const.js';
import moment from 'moment';

export const getPointsByFilter = (points, filterType) => {
  const nowDate = moment().format(`YYYY-MM-DD`);
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points.sort((a, b) => a.startDate - b.startDate);
    case FilterType.FUTURE:
      return points.filter(({startDate}) => moment(moment(startDate).format(`YYYY-MM-DD`)).isAfter(nowDate));
    case FilterType.PAST:
      return points.filter(({endDate}) => moment(moment(endDate).format(`YYYY-MM-DD`)).isBefore(nowDate));
  }
  return points;
};
