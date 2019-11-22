import {createEventEditFormTemplate} from './components/event-edit.js';
import {createEventFilterTemplate} from './components/event-filter.js';
import {createEventItemTemplate} from './components/event-item.js';
import {createSiteFilterTemplate} from './components/site-filter.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createTripDaysItemTemplate} from './components/trip-days-item.js';
import {createTripInfoTemplate} from './components/trip-info.js';

const EVENT_NUMBER = 3;

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
render(tripInfoSection, createTripInfoTemplate(), `afterbegin`);

const tripControl = document.querySelector(`.trip-controls`);
render(tripControl, createSiteMenuTemplate(), `afterbegin`);
const siteMenu = tripControl.querySelector(`nav`);
tripControl.querySelector(`h2`).after(siteMenu);

render(tripControl, createSiteFilterTemplate(), `beforeend`);

const tripEventsSection = document.querySelector(`.trip-events`);
render(tripEventsSection, createEventFilterTemplate(), `afterbegin`);
const eventFilter = tripEventsSection.querySelector(`.trip-sort`);
tripEventsSection.querySelector(`h2`).after(eventFilter);

render(tripEventsSection, createEventEditFormTemplate(), `beforeend`);

createNewElement(`ul`, `trip-days`, tripEventsSection);
const tripDaysList = tripEventsSection.querySelector(`.trip-days`);
render(tripDaysList, createTripDaysItemTemplate(), `beforeend`);

const tripDaysItem = tripDaysList.querySelector(`.trip-days__item`);
createNewElement(`ul`, `trip-events__list`, tripDaysItem);

const tripEventsList = tripEventsSection.querySelector(`.trip-events__list`);

for (let i = 1; i <= EVENT_NUMBER; i++) {
  render(tripEventsList, createEventItemTemplate(), `beforeend`);
}
