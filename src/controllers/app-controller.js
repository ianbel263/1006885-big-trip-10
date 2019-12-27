import {siteMenu} from '../mock/menu.js';

import SiteMenuComponent from '../components/site-menu.js';
import FilterController from '../controllers/filter-controller.js';

import {renderElement, RenderPosition} from '../utils/render.js';
import TripInfoComponent from '../components/trip-info.js';
import TripDaysContainerComponent from '../components/trip-days-container.js';
import TripController from '../controllers/trip-controller.js';

export default class APP {
  constructor(container, pointsModel, api, store) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;
    this._store = store;

    this._tripInfoComponent = new TripInfoComponent();

    this._tripController = null;

    this._updatePoints = this._updatePoints.bind(this);
    this._updateTotalInfo = this._updateTotalInfo.bind(this);

    this._pointsModel.setOnDataChange(this._updatePoints);
    this._pointsModel.setOnFilterChange(this._updatePoints);
    this._pointsModel.setOnDataChange(this._updateTotalInfo);
  }

  init() {
    const tripControlElement = document.querySelector(`.trip-controls`);
    renderElement(tripControlElement, new SiteMenuComponent(siteMenu));
    const filterController = new FilterController(tripControlElement, this._pointsModel);
    const tripPointsElement = document.querySelector(`.trip-events`);
    renderElement(tripPointsElement, new TripDaysContainerComponent());
    const daysListElement = tripPointsElement.querySelector(`.trip-days`);
    this._tripController = new TripController(daysListElement, this._pointsModel, this._api, this._store);

    filterController.render();
  }

  _updatePoints() {
    this._tripController.updatePoints();
  }

  _updateTotalInfo() {
    this._tripInfoComponent.setPoints(this._pointsModel.getPointsAll());

    const tripTotalPrice = document.querySelector(`.trip-info__cost-value`);
    tripTotalPrice.textContent = this._pointsModel.getPointsAll().reduce((totalPrice, it) => {
      return totalPrice + it.price + it.offers.reduce((totalOfferPrice, offer) => {
        return totalOfferPrice + offer.price;
      }, 0);
    }, 0);

    renderElement(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
}
