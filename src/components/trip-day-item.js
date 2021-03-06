import {formatDateForDatetimeAttr, formatDateForInfo} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

export default class TripDayItem extends AbstractComponent {
  constructor(day, dayCount) {

    super();
    this._day = day;
    this._dayCount = dayCount;
  }

  getTemplate() {
    const count = this._dayCount ? this._dayCount : ``;
    const date = this._day ? formatDateForInfo(this._day) : ``;

    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${count}</span>
          <time class="day__date" datetime="${formatDateForDatetimeAttr(this._day)}">${date}</time>
        </div>
        <ul class="trip-events__list">

        </ul>
      </li>`
    );
  }
}
