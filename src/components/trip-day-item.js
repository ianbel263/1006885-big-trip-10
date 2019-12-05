import {MONTHS} from '../const.js';
import {castDateFormat} from '../utils.js';

export const createDayItemTemplate = (day, dayCount) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayCount + 1}</span>
        <time class="day__date" datetime="${castDateFormat(day)}">${MONTHS[new Date(day).getMonth()]}&nbsp;${new Date(day).getDate()}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
    </li>`
  );
};
