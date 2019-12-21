import {FilterType} from '../const.js';
import {getPointsByFilter} from '../utils/filter.js';

export default class Points {
  constructor() {
    this._points = [];

    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  getPointsAll() {
    return this._points;
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [
      ...this._points.slice(0, index),
      point,
      ...this._points.slice(index + 1)
    ];

    return true;
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  setOnDataChange(handler) {
    this._dataChangeHandlers.push(handler);
  }
  setOnFilterChange(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
