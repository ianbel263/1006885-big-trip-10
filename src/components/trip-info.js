import {MONTHS} from '../const.js';
import AbstractComponent from './abstract-component.js';

export default class TripInfo extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    const startRouteDate = new Date(this._cards[0].startDate);
    const endRouteDate = new Date(this._cards[this._cards.length - 1].startDate);

    const routeTemplate = this._cards.length <= 3 ? this._cards
      .map((card) => {
        const {destination} = card;
        return destination;
      })
      .join(` &mdash; `) : `${this._cards[0].destination} &mdash; ... &mdash; ${this._cards[this._cards.length - 1].destination}`;

    return `<div class="trip-info__main">
        <h1 class="trip-info__title">${routeTemplate}</h1>
        <p class="trip-info__dates">${startRouteDate.getDate()}&nbsp;${MONTHS[startRouteDate.getMonth()]}&nbsp;&mdash;&nbsp;${endRouteDate.getDate()}&nbsp;${MONTHS[endRouteDate.getMonth()]}</p>
      </div>`;
  }
}
