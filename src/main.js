import {AUTHORIZATION, END_POINT} from './const.js';
import {renderElement, removeComponent} from './utils/render.js';
import API from './api.js';
import Store from './store.js';
import APP from './controllers/app-controller';
import PointsModel from './models/points-model.js';
import LoadingEventsComponent from './components/loading-events.js';
import LoadErrorComponent from './components/load-error.js';

const tripInfoElement = document.querySelector(`.trip-info`);

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const store = new Store();
const appController = new APP(tripInfoElement, pointsModel, api, store);

const loadingEventComponent = new LoadingEventsComponent();
renderElement(document.querySelector(`.trip-events`), loadingEventComponent);

appController.init();

api.getPoints()
  .then((points) => pointsModel.setPoints(points))
  .then(() => removeComponent(loadingEventComponent))
  .then(() => api.getData({url: `destinations`}))
  .then((destinations) => store.setDestinations(destinations))
  .then(() => api.getData({url: `offers`}))
  .then((offers) => store.setOffers(offers))
  .catch(() => {
    removeComponent(loadingEventComponent);
    renderElement(document.querySelector(`.trip-events`), new LoadErrorComponent());
  });
