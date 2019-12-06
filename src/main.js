//  import constants
import {ESC_KEYCODE} from './const.js';

//  import utils
import {renderElement, RenderPosition} from './utils/render.js';
//  import data
import {cards, uniqueDates} from './mock/card.js';
import {siteMenu} from './mock/menu.js';
import {siteFilters} from './mock/site-filter.js';
import {eventSortFilters} from './mock/event-sort.js';

//  import components
import SiteMenuComponent from './components/site-menu.js';
import SiteFilterComponent from './components/site-filter.js';
import EventSortComponent from './components/event-sort.js';
import NoEventsComponent from './components/no-events.js';
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

if (cards.length === 0) {
  renderElement(tripEventsSection, new NoEventsComponent().getElement());
} else {
  renderElement(tripEventsSection, new EventSortComponent(eventSortFilters).getElement(), RenderPosition.AFTERBEGIN);

  //  render days container (ul)
  renderElement(tripEventsSection, new TripDaysContainerComponent().getElement());
  const tripDaysList = tripEventsSection.querySelector(`.trip-days`);

  //  render eventItems & editForms
  const renderEventItem = (event, currentDay) => {
    const onEscPress = (evt) => {
      if (evt.keyCode === ESC_KEYCODE) {
        replaceEditToEvent();
        document.removeEventListener(`keydown`, onEscPress);
      }
    };

    const replaceEventToEdit = () => {
      eventsList.replaceChild(eventEditFromComponent.getElement(), eventItem.getElement());
    };

    const replaceEditToEvent = () => {
      eventsList.replaceChild(eventItem.getElement(), eventEditFromComponent.getElement());
    };

    const eventItem = new EventItemComponent(event);
    const eventEditFromComponent = new EventEditFormComponent(event);
    const eventsList = currentDay.querySelector(`.trip-events__list`);

    const eventEditButton = eventItem.getElement().querySelector(`.event__rollup-btn`);
    eventEditButton.addEventListener(`click`, () => {
      replaceEventToEdit();
      document.addEventListener(`keydown`, onEscPress);
    });

    const eventEditForm = eventEditFromComponent.getElement();
    eventEditForm.addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceEditToEvent();
    });

    const eventEditFormCancelButton = eventEditFromComponent.getElement().querySelector(`.event__rollup-btn`);
    eventEditFormCancelButton.addEventListener(`click`, () => replaceEditToEvent());

    renderElement(eventsList, eventItem.getElement());
  };

  //  render days and events
  [...uniqueDates]
    .forEach((date, i) => {
      const day = new TripDayItemComponent(date, i).getElement();

      cards
        .filter(({startDate}) => new Date(startDate).toDateString() === date)
        .forEach((it) => {
          renderEventItem(it, day);
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
}


