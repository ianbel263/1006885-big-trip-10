import {FilterType} from '../const.js';

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  // решение временное, потом подключить библиотеку moment.js
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return points.filter((point) => point.startDate > nowDate);
    case FilterType.PAST:
      return points.filter((point) => point.endDate < nowDate);
  }
  return points;
};
