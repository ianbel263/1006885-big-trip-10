import {MONTHS} from '../const.js';
import AbstractSmartComponent from './abstract-smart-component.js';

export default class TripInfo extends AbstractSmartComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    if (this._points.length === 0) {
      return `<div></div>`;
    }

    const startRouteDate = new Date(this._points[0].startDate);
    const endRouteDate = new Date(this._points[this._points.length - 1].startDate);

    const routeTemplate = this._points.length <= 3
      ? this._points
        .map(({destination}) => {
          return destination.name;
        })
        .join(` &mdash; `)
      : `${this._points[0].destination.name} &mdash; ... &mdash; ${this._points[this._points.length - 1].destination.name}`;

    return `<div class="trip-info__main">
        <h1 class="trip-info__title">${routeTemplate}</h1>
        <p class="trip-info__dates">${startRouteDate.getDate()}&nbsp;${MONTHS[startRouteDate.getMonth()]}&nbsp;&mdash;&nbsp;${endRouteDate.getDate()}&nbsp;${MONTHS[endRouteDate.getMonth()]}</p>
      </div>`;
  }

  recoveryListeners() {}

  setPoints(points) {
    this._points = points.slice().sort((a, b) => a.startDate - b.startDate);

    super.rerender();
  }
}

  // добавить moment
