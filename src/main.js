import {createEventEditFormTemplate} from './components/event-edit.js';
import {createEventFilterTemplate} from './components/event-filter.js';
// import {createEventItemTemplate} from './components/event-item.js';
import {createSiteFilterTemplate} from './components/site-filter.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createDaysListTemplate} from './components/trip-days-item.js';
import {createTripInfoTemplate} from './components/trip-info.js';
import {cards} from './mock/card.js';
import {menu} from './mock/menu.js';
import {siteFilters} from './mock/site-filter.js';
import {eventFilters} from './mock/event-filter.js';
import {eventPointCities} from './mock/card.js';

// const SHOWING_EVENTS_COUNT_ON_START = 4;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripControl = document.querySelector(`.trip-controls`);
render(tripControl, createSiteMenuTemplate(menu), `afterbegin`);
const siteMenu = tripControl.querySelector(`nav`);
tripControl.querySelector(`h2`).after(siteMenu);

render(tripControl, createSiteFilterTemplate(siteFilters), `beforeend`);

const tripEventsSection = document.querySelector(`.trip-events`);
render(tripEventsSection, createEventFilterTemplate(eventFilters), `afterbegin`);
const eventFilter = tripEventsSection.querySelector(`.trip-sort`);
tripEventsSection.querySelector(`h2`).after(eventFilter);

render(tripEventsSection, createEventEditFormTemplate(cards[0], eventPointCities), `beforeend`);
render(tripEventsSection, createDaysListTemplate(cards), `beforeend`);
//

const tripInfoSection = document.querySelector(`.trip-info`);
render(tripInfoSection, createTripInfoTemplate(cards), `afterbegin`);

const tripTotalPrice = document.querySelector(`.trip-info__cost-value`);

tripTotalPrice.textContent = cards.reduce((totalPrice, it) => {
  return totalPrice + it.price + it.offers.reduce((totalOfferPrice, offer) => {
    return totalOfferPrice + offer.price;
  }, 0);
}, 0);
