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
renderElement(document.querySelector(`.trip-events`), loadingPointComponent);

appController.init();

api.getPoints()
  .then((points) => pointsModel.setPoints(points))
  .then(() => removeComponent(loadingPointComponent))
  .then(() => api.getData({url: `destinations`}))
  .then((destinations) => store.setDestinations(destinations))
  .then(() => api.getData({url: `offers`}))
  .then((offers) => store.setOffers(offers))
  .catch(() => {
    removeComponent(loadingPointComponent);
    renderElement(document.querySelector(`.trip-events`), new LoadErrorComponent());
  });

// Исправить поведение кнопки Favorite, выбор типов в карточке редактирования, расставить обработчики по ESC
