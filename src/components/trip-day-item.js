import {MONTHS} from '../const.js';
import {dateFormat} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

export default class TripDayItem extends AbstractComponent {
  constructor(day, dayCount) {
    super();
    this._day = day;
    this._dayCount = dayCount;
  }

  getTemplate() {
    const count = this._dayCount ? this._dayCount : ``;
    const month = this._day ? MONTHS[new Date(this._day).getMonth()] : ``;
    const day = this._day ? new Date(this._day).getDate() : ``;

    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${count}</span>
          <time class="day__date" datetime="${dateFormat(this._day)}">${month}&nbsp;${day}</time>
        </div>
        <ul class="trip-events__list">

        </ul>
      </li>`
    );
  }
}
