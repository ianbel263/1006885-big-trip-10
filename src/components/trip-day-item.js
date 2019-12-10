import {MONTHS} from '../const.js';
import {castDateFormat} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

export default class TripDayItem extends AbstractComponent {
  constructor(day, dayCount) {
    super();
    this._day = day;
    this._dayCount = dayCount;
  }

  getTemplate() {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._dayCount + 1}</span>
          <time class="day__date" datetime="${castDateFormat(this._day)}">${MONTHS[new Date(this._day).getMonth()]}&nbsp;${new Date(this._day).getDate()}</time>
        </div>
        <ul class="trip-events__list">

        </ul>
      </li>`
    );
  }
}
