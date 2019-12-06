import {createElement} from '../utils.js';
import {MONTHS} from '../const.js';

const createTripInfoTemplate = (cards) => {

  const startRouteDate = new Date(cards[0].startDate);
  const endRouteDate = new Date(cards[cards.length - 1].startDate);

  const routeTemplate = cards.length <= 3 ? cards
    .map((card) => {
      const {destination} = card;
      return destination;
    })
    .join(` &mdash; `) : `${cards[0].destination} &mdash; ... &mdash; ${cards[cards.length - 1].destination}`;

  return `<div class="trip-info__main">
      <h1 class="trip-info__title">${routeTemplate}</h1>
      <p class="trip-info__dates">${startRouteDate.getDate()}&nbsp;${MONTHS[startRouteDate.getMonth()]}&nbsp;&mdash;&nbsp;${endRouteDate.getDate()}&nbsp;${MONTHS[endRouteDate.getMonth()]}</p>
    </div>`;
};

export default class TripInfo {
  constructor(cards) {
    this._cards = cards;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._cards);
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
