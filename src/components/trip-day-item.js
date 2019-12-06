import {MONTHS} from '../const.js';
import {castDateFormat} from '../utils.js';
import AbstractComponent from './abstract-component.js';

const createDayItemTemplate = (day, dayCount) => {
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

export default class TripDayItem extends AbstractComponent {
  constructor(day, dayCount) {
    super();
    this._day = day;
    this._dayCount = dayCount;
  }

  getTemplate() {
    return createDayItemTemplate(this._day, this._dayCount);
  }
}
