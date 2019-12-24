// import {cards} from './mock/card.js';
import {AUTHORIZATION, END_POINT} from './const.js';
import API from './api.js';
import {siteMenu} from './mock/menu.js';
import {renderElement, RenderPosition} from './utils/render.js';
import SiteMenuComponent from './components/site-menu.js';
import TripDaysContainerComponent from './components/trip-days-container.js';
import TripController from './controllers/trip-controller.js';
import TripInfoComponent from './components/trip-info.js';
import PointsModel from './models/points-model.js';
import FilterController from './controllers/filter-controller.js';

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
// pointsModel.setPoints(cards);

const tripControlDiv = document.querySelector(`.trip-controls`);
const tripEventsSection = document.querySelector(`.trip-events`);
const filterController = new FilterController(tripControlDiv, pointsModel);
const daysList = tripEventsSection.querySelector(`.trip-days`);
const tripController = new TripController(daysList, pointsModel);

renderElement(tripControlDiv, new SiteMenuComponent(siteMenu));
renderElement(tripEventsSection, new TripDaysContainerComponent());
// tripController.render();
filterController.render();

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    // console.log(`NEW`);
    tripController.createPoint(); // поставить потом обработчик по esc, а также _onViewChange
  });

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(points);
    tripController.render();
  });


// const tripInfoSection = document.querySelector(`.trip-info`);
// renderElement(tripInfoSection, new TripInfoComponent(cards), RenderPosition.AFTERBEGIN);

// const tripTotalPrice = document.querySelector(`.trip-info__cost-value`);
// tripTotalPrice.textContent = cards.reduce((totalPrice, it) => {
//   return totalPrice + it.price + it.offers.reduce((totalOfferPrice, offer) => {
//     return totalOfferPrice + offer.price;
//   }, 0);
// }, 0);
