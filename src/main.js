import {AUTHORIZATION, END_POINT} from './const.js';
import {renderElement, removeComponent} from './utils/render.js';
import API from './api.js';
import Store from './store.js';
import APP from './controllers/app-controller';
import PointsModel from './models/points-model.js';
import LoadingPointsComponent from './components/loading-points.js';
import LoadErrorComponent from './components/load-error.js';

const tripInfoElement = document.querySelector(`.trip-info`);

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const store = new Store();
const appController = new APP(tripInfoElement, pointsModel, api, store);

const loadingPointComponent = new LoadingPointsComponent();
const newPointButton = document.querySelector(`.trip-main__event-add-btn`);
newPointButton.disabled = true;
renderElement(document.querySelector(`.trip-events`), loadingPointComponent);

appController.init();

api.getData({url: `offers`})
  .then((offers) => store.setOffers(offers))
  .then(() => api.getData({url: `destinations`}))
  .then((destinations) => store.setDestinations(destinations))
  .then(() => api.getPoints())
  .then((points) => {
    pointsModel.setPoints(points);
    removeComponent(loadingPointComponent);
    newPointButton.disabled = false;
  })
  .catch(() => {
    removeComponent(loadingPointComponent);
    renderElement(document.querySelector(`.trip-events`), new LoadErrorComponent());
  });
