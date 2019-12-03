import {createEventEditFormTemplate} from './components/event-edit.js';
import {createEventFilterTemplate} from './components/event-filter.js';
import {createEventItemTemplate} from './components/event-item.js';
import {createSiteFilterTemplate} from './components/site-filter.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createTripDaysItemTemplate} from './components/trip-days-item.js';
import {createTripInfoTemplate} from './components/trip-info.js';
import {cards} from './mock/card.js';
import {menu} from './mock/menu.js';
import {siteFilters} from './mock/site-filter.js';
import {eventFilters} from './mock/event-filter.js';
import {eventPointCities} from './mock/card.js';

const SHOWING_EVENTS_COUNT_ON_START = 4;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const createNewElement = (node, nodeClassName, parentNode) => {
  const element = document.createElement(node);
  element.className = nodeClassName;
  parentNode.append(element);
  return element;
};

const tripInfoSection = document.querySelector(`.trip-info`);
render(tripInfoSection, createTripInfoTemplate(cards), `afterbegin`);

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

createNewElement(`ul`, `trip-days`, tripEventsSection);
const tripDaysList = tripEventsSection.querySelector(`.trip-days`);
render(tripDaysList, createTripDaysItemTemplate(), `beforeend`);

const tripDaysItem = tripDaysList.querySelector(`.trip-days__item`);
createNewElement(`ul`, `trip-events__list`, tripDaysItem);

const tripEventsList = tripEventsSection.querySelector(`.trip-events__list`);

let showingTasksCount = SHOWING_EVENTS_COUNT_ON_START;
cards.slice(1, showingTasksCount).forEach((card) => render(tripEventsList, createEventItemTemplate(card), `beforeend`));
