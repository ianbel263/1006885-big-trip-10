import {createElement, renderElement} from './utils.js';
import {createEventEditFormTemplate} from './components/event-edit.js';
import {createEventSortTemplate} from './components/event-sort.js';
import {createSiteFilterTemplate} from './components/site-filter.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createTripInfoTemplate} from './components/trip-info.js';
import {tripDaysContainerTemplate} from './components/trip-days-container.js';
import {createDayItemTemplate} from './components/trip-day-item.js';
import {createEventItemTemplate} from './components/trip-event-item.js';
import {cards, eventPointCities, eventPointTypes, uniqueDates} from './mock/card.js';
import {menu} from './mock/menu.js';
import {siteFilters} from './mock/site-filter.js';
import {eventSort} from './mock/event-sort.js';

// const SHOWING_EVENTS_COUNT_ON_START = 4;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

//  render site menu
const tripControlDiv = document.querySelector(`.trip-controls`);
render(tripControlDiv, createSiteMenuTemplate(menu), `afterbegin`);
const siteMenu = tripControlDiv.querySelector(`.trip-tabs`);

//  render site filters
render(tripControlDiv, createSiteFilterTemplate(siteFilters));

//  render sort filters
const tripEventsSection = document.querySelector(`.trip-events`);
render(tripEventsSection, createEventSortTemplate(eventSort), `afterbegin`);
const eventSortFilter = tripEventsSection.querySelector(`.trip-sort`);

//  render days container (ul)
render(tripEventsSection, tripDaysContainerTemplate());
const tripDaysList = tripEventsSection.querySelector(`.trip-days`);

//  render days and events
[...uniqueDates]
  .forEach((date, i) => {
    const day = createElement(createDayItemTemplate(date, i));
    cards
      .filter(({startDate}) => new Date(startDate).toDateString() === date)
      .forEach((it) => {
        renderElement(day.querySelector(`.trip-events__list`), createElement(createEventItemTemplate(it)));
        renderElement(day.querySelector(`.trip-events__list`), createElement(createEventEditFormTemplate(it, eventPointTypes, eventPointCities)));
      });

    renderElement(tripDaysList, day);
  });

//  render trip info
const tripInfoSection = document.querySelector(`.trip-info`);
render(tripInfoSection, createTripInfoTemplate(cards), `afterbegin`);

//  calculate total price
const tripTotalPrice = document.querySelector(`.trip-info__cost-value`);
tripTotalPrice.textContent = cards.reduce((totalPrice, it) => {
  return totalPrice + it.price + it.offers.reduce((totalOfferPrice, offer) => {
    return totalOfferPrice + offer.price;
  }, 0);
}, 0);
