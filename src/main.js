import {cards} from './mock/card.js';
import {siteMenu} from './mock/menu.js';
import {siteFilters} from './mock/site-filter.js';
import {renderElement, RenderPosition} from './utils/render.js';
import SiteMenuComponent from './components/site-menu.js';
import SiteFilterComponent from './components/site-filter.js';
import TripDaysContainerComponent from './components/trip-days-container.js';
import TripController from './controllers/trip-controller.js';
import TripInfoComponent from './components/trip-info.js';

const tripControlDiv = document.querySelector(`.trip-controls`);
renderElement(tripControlDiv, new SiteMenuComponent(siteMenu));

renderElement(tripControlDiv, new SiteFilterComponent(siteFilters));

const tripEventsSection = document.querySelector(`.trip-events`);
renderElement(tripEventsSection, new TripDaysContainerComponent());

const daysList = tripEventsSection.querySelector(`.trip-days`);
const tripController = new TripController(daysList);
tripController.render(cards);

const tripInfoSection = document.querySelector(`.trip-info`);
renderElement(tripInfoSection, new TripInfoComponent(cards), RenderPosition.AFTERBEGIN);

const tripTotalPrice = document.querySelector(`.trip-info__cost-value`);
tripTotalPrice.textContent = cards.reduce((totalPrice, it) => {
  return totalPrice + it.price + it.offers.reduce((totalOfferPrice, offer) => {
    return totalOfferPrice + offer.price;
  }, 0);
}, 0);
