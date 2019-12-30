import {MenuItem} from '../const.js';
import {getStatistics} from '../utils/common';

import AppMenuComponent from '../components/app-menu.js';
import FilterController from '../controllers/filter-controller.js';

import {renderElement, RenderPosition} from '../utils/render.js';
import StatistiscComponent from '../components/statistics.js';
import TripInfoComponent from '../components/trip-info.js';
import TripDaysContainerComponent from '../components/trip-days-container.js';
import TripController from '../controllers/trip-controller.js';

export default class APP {
  constructor(container, pointsModel, api, store) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;
    this._store = store;

    this._activeMenuItem = MenuItem.TABLE;

    this._tripInfoComponent = new TripInfoComponent();
    this._statisticsComponent = new StatistiscComponent();

    this._tripController = null;

    this._updatePoints = this._updatePoints.bind(this);
    this._updateTotalInfo = this._updateTotalInfo.bind(this);
    this._onAppMenuChange = this._onAppMenuChange.bind(this);

    this._pointsModel.setOnDataChange(this._updatePoints);
    this._pointsModel.setOnFilterChange(this._updatePoints);
    this._pointsModel.setOnDataChange(this._updateTotalInfo);
  }

  init() {
    const tripControlElement = document.querySelector(`.trip-controls`);

    const menuItems = Object.values(MenuItem).map((item) => {
      return {
        name: item,
        isActive: item === this._activeMenuItem
      };
    });

    const appMenu = new AppMenuComponent(menuItems);
    appMenu.setOnMenuChange(this._onAppMenuChange);
    renderElement(tripControlElement, appMenu);

    const filterController = new FilterController(tripControlElement, this._pointsModel);

    const pageBodyMainElement = document.querySelector(`.page-main .page-body__container`);
    renderElement(pageBodyMainElement, this._statisticsComponent, RenderPosition.BEFOREEND);

    const tripPointsElement = document.querySelector(`.trip-events`);
    renderElement(tripPointsElement, new TripDaysContainerComponent());
    const daysListElement = tripPointsElement.querySelector(`.trip-days`);
    this._tripController = new TripController(daysListElement, this._pointsModel, this._api, this._store);

    const createNewPointButton = document.querySelector(`.trip-main__event-add-btn`);
    createNewPointButton.addEventListener(`click`, () => {
      this._activeMenuItem = MenuItem.TABLE;
      appMenu.setDefault();
      this._statisticsComponent.hide();
      this._tripController.show();
      this._tripController.createNewPoint();
    });

    this._statisticsComponent.hide();
    filterController.render();
  }

  _onAppMenuChange(activeMenuItem) {
    if (this._activeMenuItem === activeMenuItem) {
      return;
    }
    this._activeMenuItem = activeMenuItem;
    switch (this._activeMenuItem) {
      case MenuItem.TABLE:
        this._statisticsComponent.hide();
        this._tripController.show();
        break;
      case MenuItem.STATS:
        this._statisticsComponent.show();
        this._tripController.hide();
        this._tripController.onViewChange();
        break;
    }
  }

  _updatePoints() {
    this._tripController.updatePoints();
    this._statisticsComponent.rerender(getStatistics(this._pointsModel.getPointsAll(), this._store.getOffers()));
    this._statisticsComponent.hide();
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
