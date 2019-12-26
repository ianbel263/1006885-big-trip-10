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
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
    this._tripController = null;

    this._updateTotalInfo = this._updateTotalInfo.bind(this);

    this._pointsModel.setOnDataChange(this._updateTotalInfo);
  }

  render() {
    const tripControlDiv = document.querySelector(`.trip-controls`);
    renderElement(tripControlDiv, new SiteMenuComponent(siteMenu));
    const filterController = new FilterController(tripControlDiv, this._pointsModel);

    const tripEventsSection = document.querySelector(`.trip-events`);
    renderElement(tripEventsSection, this._tripDaysContainerComponent);
    const daysList = tripEventsSection.querySelector(`.trip-days`);
    this._tripController = new TripController(daysList, this._pointsModel, this._api, this._store);

    // this._tripInfoComponent = new TripInfoComponent(this._pointsModel.getPointsAll());
    
    filterController.render();
    this._tripController.render();
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

  //  подписаться на изменения модели, делать перерендер
}
