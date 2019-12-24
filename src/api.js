import {RequestMethod} from './const.js';
import Point from './models/point-model.js';


const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
    .then((response) => response.json())
    .then(Point.parsePoints);
  }

  // createPoint(point) {
  // }

  // updatePoint(id, data) {
  // }

  // deletePoint(id) {
  // }

  _load({url, method = RequestMethod.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

}
