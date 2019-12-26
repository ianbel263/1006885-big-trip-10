import {AUTHORIZATION, END_POINT} from './const.js';
import API from './api.js';
import Store from './store.js';
import APP from './controllers/app-controller';
import PointsModel from './models/points-model.js';

const tripInfoSection = document.querySelector(`.trip-info`);

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const store = new Store();

const appController = new APP(tripInfoSection, pointsModel, api, store);

api.getPoints()
  .then((points) => pointsModel.setPoints(points))
  .then(() => api.getData({url: `destinations`}))
  .then((destinations) => store.setDestinations(destinations))
  .then(() => api.getData({url: `offers`}))
  .then((offers) => store.setOffers(offers))
  .then(() => appController.render())
  // .then(() => tripController.render())
  // .catch(onError); // описать функцию ошибки - onError
