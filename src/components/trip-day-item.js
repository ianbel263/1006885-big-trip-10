import {MONTHS} from '../const.js';
import {castDateFormat, createElement} from '../utils.js';

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

export default class TripDayItem {
  constructor(day, dayCount) {
    this._day = day;
    this._dayCount = dayCount;
    this._element = null;
  }

  getTemplate() {
    return createDayItemTemplate(this._day, this._dayCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
