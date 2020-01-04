import {AUTHORIZATION, END_POINT} from './const.js';
import {renderElement, removeComponent} from './utils/render.js';
import 'flatpickr/dist/flatpickr.css';
import API from './api/api.js';
import BackupStore from './api/backup-store.js';
import Provider from './api/provider.js';
import AppStore from './app-store.js';
import APP from './controllers/app-controller';
import PointsModel from './models/points-model.js';
import LoadingPointsComponent from './components/loading-points.js';
import LoadErrorComponent from './components/load-error.js';

const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then(() => {
        // Действие, в случае успешной синхронизации
      })
      .catch(() => {
        // Действие, в случае ошибки синхронизации
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

const tripInfoElement = document.querySelector(`.trip-info`);

const api = new API(END_POINT, AUTHORIZATION);
const backupStore = new BackupStore(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, backupStore);

const pointsModel = new PointsModel();
const appStore = new AppStore();
const appController = new APP(tripInfoElement, pointsModel, apiWithProvider, appStore);

const loadingPointComponent = new LoadingPointsComponent();
const newPointButton = document.querySelector(`.trip-main__event-add-btn`);
newPointButton.disabled = true;
renderElement(document.querySelector(`.trip-events`), loadingPointComponent);

appController.init();

api.getData({url: `offers`})
  .then((offers) => appStore.setOffers(offers))
  .then(() => api.getData({url: `destinations`}))
  .then((destinations) => appStore.setDestinations(destinations))
  .then(() => apiWithProvider.getPoints())
  .then((points) => {
    pointsModel.setPoints(points);
    removeComponent(loadingPointComponent);
    newPointButton.disabled = false;
  })
  // .catch((error) => {
  //   // console.log('error', error)
  //   removeComponent(loadingPointComponent);
  //   renderElement(document.querySelector(`.trip-events`), new LoadErrorComponent());
  // });
