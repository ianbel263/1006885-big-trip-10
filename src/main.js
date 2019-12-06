//  import data
import {renderElement, RenderPosition} from './utils.js';
import {cards, uniqueDates} from './mock/card.js';
import {siteMenu} from './mock/menu.js';
import {siteFilters} from './mock/site-filter.js';
import {eventSortFilters} from './mock/event-sort.js';

//  import components
import SiteMenuComponent from './components/site-menu.js';
import SiteFilterComponent from './components/site-filter.js';
import EventSortComponent from './components/event-sort.js';
import TripDaysContainerComponent from './components/trip-days-container.js';
import TripDayItemComponent from './components/trip-day-item.js';
import EventItemComponent from './components/trip-event-item.js';
import EventEditFormComponent from './components/event-edit.js';
import TripInfoComponent from './components/trip-info.js';

// const SHOWING_EVENTS_COUNT_ON_START = 4;


//  render site menu
const tripControlDiv = document.querySelector(`.trip-controls`);
renderElement(tripControlDiv, new SiteMenuComponent(siteMenu).getElement());

//  render site filters
renderElement(tripControlDiv, new SiteFilterComponent(siteFilters).getElement());

//  render sort filters
const tripEventsSection = document.querySelector(`.trip-events`);
renderElement(tripEventsSection, new EventSortComponent(eventSortFilters).getElement(), RenderPosition.AFTERBEGIN);

//  render days container (ul)
renderElement(tripEventsSection, new TripDaysContainerComponent().getElement());
const tripDaysList = tripEventsSection.querySelector(`.trip-days`);

//  render days and events
[...uniqueDates]
  .forEach((date, i) => {
    const day = new TripDayItemComponent(date, i).getElement();

    cards
      .filter(({startDate}) => new Date(startDate).toDateString() === date)
      .forEach((it) => {
        renderElement(day.querySelector(`.trip-events__list`), new EventItemComponent(it).getElement());
        renderElement(day.querySelector(`.trip-events__list`), new EventEditFormComponent(it).getElement());
      });

    renderElement(tripDaysList, day);
  });

//  render trip info
const tripInfoSection = document.querySelector(`.trip-info`);
renderElement(tripInfoSection, new TripInfoComponent(cards).getElement(), RenderPosition.AFTERBEGIN);

//  calculate total price
const tripTotalPrice = document.querySelector(`.trip-info__cost-value`);
tripTotalPrice.textContent = cards.reduce((totalPrice, it) => {
  return totalPrice + it.price + it.offers.reduce((totalOfferPrice, offer) => {
    return totalOfferPrice + offer.price;
  }, 0);
}, 0);
