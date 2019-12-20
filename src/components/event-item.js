import {timeFormat, dateFormat, calculateTimeInterval, formatTripType} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

export default class EventItem extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    const {type, destination, startDate, endDate, price, offers} = this._event;

    return (
      `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${formatTripType(type)} ${destination}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFormat(startDate)}">${timeFormat(startDate)}</time>
              &mdash;
              <time class="event__end-time" datetime="${dateFormat(endDate)}">${timeFormat(endDate)}</time>
            </p>
            <p class="event__duration">${calculateTimeInterval(startDate, endDate)}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
      ${offers.map(({title, price: offerPrice}) => {
        return (
          `<li class="event__offer">
            <span class="event__offer-title">${title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
          </li>`
        );
      }).join(`\n`)}
          </ul>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
    );
  }

  setOnEditButtonClick(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
