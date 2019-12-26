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

    this._tripInfoComponent = null;
    this._tripDaysContainerComponent = new TripDaysContainerComponent();

    this._tripController = null;
  }

  render() {
    const tripEventsSection = document.querySelector(`.trip-events`);
    renderElement(tripEventsSection, this._tripDaysContainerComponent);
    const daysList = tripEventsSection.querySelector(`.trip-days`);
    this._tripController = new TripController(daysList, this._pointsModel, this._api, this._store);

    const cards = this._pointsModel.getPoints();

    this._tripInfoComponent = new TripInfoComponent();
    renderElement(this._container, new TripInfoComponent(cards), RenderPosition.AFTERBEGIN);

    const tripTotalPrice = document.querySelector(`.trip-info__cost-value`);
    tripTotalPrice.textContent = cards.reduce((totalPrice, it) => {
      return totalPrice + it.price + it.offers.reduce((totalOfferPrice, offer) => {
        return totalOfferPrice + offer.price;
      }, 0);
    }, 0);

    document.querySelector(`.trip-main__event-add-btn`)
      .addEventListener(`click`, () => {
        // console.log(`NEW`);

        this._tripController.createPoint(); // поставить потом обработчик по esc, а также _onViewChange
      });

    this._tripController.render();

  }

  //  подписаться на изменения модели, делать перерендер
}
