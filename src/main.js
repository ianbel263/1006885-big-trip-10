import {cards} from './mock/card.js';
import {siteMenu} from './mock/menu.js';
import {siteFilters} from './mock/site-filter.js';
import {renderElement} from './utils/render.js';
import SiteMenuComponent from './components/site-menu.js';
import SiteFilterComponent from './components/site-filter.js';
import TripController from './controllers/trip-controller.js';

const tripControlDiv = document.querySelector(`.trip-controls`);
renderElement(tripControlDiv, new SiteMenuComponent(siteMenu));

renderElement(tripControlDiv, new SiteFilterComponent(siteFilters));

const tripEventsSection = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEventsSection);
tripController.renderEvents(cards);
