//  import constants
import {ESC_KEYCODE} from './const.js';

//  import utils
import {renderElement, replaceComponents, RenderPosition} from './utils/render.js';
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

//  render eventItems & editForms
const renderEventItem = (event, currentDay) => {
  const onEscPress = (evt) => {
    if (evt.keyCode === ESC_KEYCODE) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscPress);
    }
  };

  const replaceEventToEdit = () => {
    replaceComponents(eventEditFromComponent, eventItem);
  };

  const replaceEditToEvent = () => {
    replaceComponents(eventItem, eventEditFromComponent);
  };

  const eventItem = new EventItemComponent(event);
  const eventEditFromComponent = new EventEditFormComponent(event);
  const eventsList = currentDay.getElement().querySelector(`.trip-events__list`);

  eventItem.setEditButtonHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscPress);
  });

  eventEditFromComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
  });

  eventEditFromComponent.setCancelButtonHandler(() => {
    replaceEditToEvent()
  });

  renderElement(eventsList, eventItem);
};

//  render site menu
const tripControlDiv = document.querySelector(`.trip-controls`);
renderElement(tripControlDiv, new SiteMenuComponent(siteMenu));

//  render site filters
renderElement(tripControlDiv, new SiteFilterComponent(siteFilters));

//  render sort filters
const tripEventsSection = document.querySelector(`.trip-events`);

const renderEvents = (events) => {
  if (events.length === 0) {
    renderElement(tripEventsSection, new NoEventsComponent());
    return
  }

  renderElement(tripEventsSection, new EventSortComponent(eventSortFilters), RenderPosition.AFTERBEGIN);

  //  render days container (ul)
  renderElement(tripEventsSection, new TripDaysContainerComponent());
  const tripDaysList = tripEventsSection.querySelector(`.trip-days`);

  //  render days and events
  [...uniqueDates]
    .forEach((date, i) => {
      const day = new TripDayItemComponent(date, i);

      events
        .filter(({startDate}) => new Date(startDate).toDateString() === date)
        .forEach((it) => {
          renderEventItem(it, day);
        });

      renderElement(tripDaysList, day);
    });

  //  render trip info
    const tripInfoSection = document.querySelector(`.trip-info`);
    renderElement(tripInfoSection, new TripInfoComponent(events), RenderPosition.AFTERBEGIN);

  //  calculate total price
  const tripTotalPrice = document.querySelector(`.trip-info__cost-value`);
  tripTotalPrice.textContent = events.reduce((totalPrice, it) => {
    return totalPrice + it.price + it.offers.reduce((totalOfferPrice, offer) => {
      return totalOfferPrice + offer.price;
    }, 0);
  }, 0);
};

renderEvents(cards);
