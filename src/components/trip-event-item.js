import {createElement, castTimeFormat} from '../utils.js';
import {calculateTimeInterval} from '../utils.js';
import {castDateFormat} from '../utils.js';

const createEventItemTemplate = (event) => {
  const {type: {type}, destination, startDate, endDate, price, offers} = event;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} to ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${castDateFormat(startDate)}T${castTimeFormat(startDate)}">${castTimeFormat(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${castDateFormat(endDate)}T${castTimeFormat(endDate)}">${castTimeFormat(endDate)}</time>
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
};

export default class EventItem {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createEventItemTemplate(this._event);
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
