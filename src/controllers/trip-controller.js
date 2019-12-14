import {uniqueDates} from '../mock/card.js';
import {renderElement, RenderPosition} from '../utils/render.js';
import {eventSortFilters} from '../mock/event-sort.js';
import EventSortComponent from '../components/event-sort.js';
import TripDaysContainerComponent from '../components/trip-days-container.js';
import NoEventsComponent from '../components/no-events.js';
import TripDayItemComponent from '../components/trip-day-item.js';
import PointController from './point-controller.js';

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._eventPoints = [];

    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
    this._eventSortComponent = new EventSortComponent(eventSortFilters);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._eventSortComponent.setOnSortChangeClick(this._onSortTypeChange);
    this._isSortedByDefault = true;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  renderEvents(events, sortedEvents = [], isSortedByDefault = true) {
    this._events = events;
    this._eventPoints = [];

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
            this._renderEvent(eventsList, event, this._onDataChange, this._onViewChange);
          });

        renderElement(this._tripDaysContainerComponent.getElement(), day);
      });
    } else {
      const eventsContainer = new TripDayItemComponent();
      const eventsList = eventsContainer.getElement().querySelector(`.trip-events__list`);

      eventsContainer.getElement().querySelector(`.day__info`).innerHTML = ``;
      sortedEvents.forEach((event) => {
        this._renderEvent(eventsList, event, this._onDataChange, this._onViewChange);
      });
      renderElement(this._tripDaysContainerComponent.getElement(), eventsContainer);
    }
  }

  _renderEvent(listElement, event, onDataChange, onViewChange) {
    const pointController = new PointController(listElement, onDataChange, onViewChange);
    pointController.renderEventItem(event);
    this._eventPoints.push(pointController);
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
    this.renderEvents(this._events, sortedEvents, this._isSortedByDefault);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.renderEventItem(this._events[index]);
  }

  _onViewChange() {
    this._eventPoints.forEach((it) => it.setDefaultView());
  }
}
