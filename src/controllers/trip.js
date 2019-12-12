import {uniqueDates} from '../mock/card.js';
import {renderElement, RenderPosition} from '../utils/render.js';
import {eventSortFilters} from '../mock/event-sort.js';
import EventSortComponent from '../components/event-sort.js';
import TripDaysContainerComponent from '../components/trip-days-container.js';
import NoEventsComponent from '../components/no-events.js';
import TripDayItemComponent from '../components/trip-day-item.js';
import PointController from './point.js';

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];

    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
    this._eventSortComponent = new EventSortComponent(eventSortFilters);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._eventSortComponent.setOnSortChangeClick(this._onSortTypeChange);
    this._isSortedByDefault = true;
  }

  renderEvents(events, isSortedByDefault = true) {
    this._events = events;

    const container = this._container;

    if (this._events.length === 0) {
      renderElement(container, this._noEventsComponent);
      return;
    }

    renderElement(container, this._eventSortComponent, RenderPosition.AFTERBEGIN);
    renderElement(container, this._tripDaysContainerComponent);

    if (isSortedByDefault) {
      [...uniqueDates]
      .forEach((date, i) => {
        const day = new TripDayItemComponent(date, i);
        const eventsList = day.getElement().querySelector(`.trip-events__list`);

        this._events
          .filter(({startDate}) => new Date(startDate).toDateString() === date)
          .forEach((event) => {
            const pointController = new PointController(eventsList);
            pointController.renderEventItem(event);
          });

        renderElement(this._tripDaysContainerComponent.getElement(), day);
      });
    } else {
      const eventsContainer = new TripDayItemComponent();
      const eventsList = eventsContainer.getElement().querySelector(`.trip-events__list`);

      eventsContainer.getElement().querySelector(`.day__info`).innerHTML = ``;
      this._events.forEach((event) => {
        const pointController = new PointController(eventsList);
        pointController.renderEventItem(event);
      });
      renderElement(this._tripDaysContainerComponent.getElement(), eventsContainer);
    }
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];

    switch (sortType) {
      case `event`:
        this._isSortedByDefault = true;
        sortedEvents = this._events.slice();
        break;
      case `time`:
        this._isSortedByDefault = false;
        sortedEvents = this._events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        break;
      case `price`:
        this._isSortedByDefault = false;
        sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
        break;
    }

    this._tripDaysContainerComponent.getElement().innerHTML = ``;
    this.renderEvents(sortedEvents, this._isSortedByDefault);
  }
}
