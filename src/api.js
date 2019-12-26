import {RequestMethod} from './const.js';
import PointModel from './models/point-model.js';


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

  getData({url}) {
    return this._load({url})
      .then((response) => response.json());
  }

  getPoints() {
    return this._load({url: `points`})
    .then((response) => response.json())
    .then(PointModel.parsePoints);
  }

  createPoint(point) {
    return this._load({
      url: `points`,
      method: RequestMethod.POST,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parsePoint);

  }

  updatePoint(id, data) {
    return this._load({
      url: `points/${id}`,
      method: RequestMethod.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parsePoint);
  }

  deletePoint(id) {
    return this._load({url: `points/${id}`, method: RequestMethod.DELETE});
  }

  _load({url, method = RequestMethod.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

}
