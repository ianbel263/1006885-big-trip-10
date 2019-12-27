import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDateForInfo} from '../utils/common';

export default class TripInfo extends AbstractSmartComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    if (this._points.length === 0) {
      return `<div></div>`;
    }

    const startRouteDate = formatDateForInfo(this._points[0].startDate);
    const endRouteDate = formatDateForInfo(this._points[this._points.length - 1].endDate);

    const routeTemplate = this._points.length <= 3
      ? this._points
        .map(({destination}) => {
          return destination.name;
        })
        .join(` &mdash; `)
      : `${this._points[0].destination.name} &mdash; ... &mdash; ${this._points[this._points.length - 1].destination.name}`;

    return `<div class="trip-info__main">
        <h1 class="trip-info__title">${routeTemplate}</h1>
        <p class="trip-info__dates">${startRouteDate}&nbsp;&mdash;&nbsp;${endRouteDate}</p>
      </div>`;
  }

  recoveryListeners() {}

  setPoints(points) {
    this._points = points.slice().sort((a, b) => a.startDate - b.startDate);

    super.rerender();
  }
}
