import {SortTypes} from '../const.js';
import {renderElement, RenderPosition} from '../utils/render.js';
import {eventSortFilters} from '../mock/event-sort.js';
import NoEventsComponent from '../components/no-events.js';
import EventSortComponent from '../components/event-sort.js';
import TripDayItemComponent from '../components/trip-day-item.js';
import PointController from './point-controller.js';

const renderCards = (cards, container, onDataChange, onViewChange, isSortedByDefault = true) => {
  const pointControllers = [];

  const dates = isSortedByDefault
    ? [...new Set(cards.map((card) => new Date(card.startDate).toDateString()))]
    : [true];

  dates.forEach((date, dateIndex) => {
    const day = isSortedByDefault ? new TripDayItemComponent(date, dateIndex + 1) : new TripDayItemComponent();

    cards
      .filter((_event) => {
        return isSortedByDefault ? new Date(_event.startDate).toDateString() === date : _event;
      })
      .forEach((_event) => {
        const pointController = new PointController(
            day.getElement().querySelector(`.trip-events__list`),
            onDataChange,
            onViewChange
        );

        pointController.render(_event);
        pointControllers.push(pointController);
      });

    renderElement(container, day);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._pointControllers = [];

    this._noEventsComponent = new NoEventsComponent();
    this._eventSortComponent = new EventSortComponent(eventSortFilters)

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(events) {
    this._events = events;
    
    if (this._events.length === 0) {
      renderElement(this._container, this._noEventsComponent);
      return;
    }
        
    renderElement(this._container.parentElement, this._eventSortComponent, RenderPosition.AFTERBEGIN);
    this._eventSortComponent.setOnSortChangeClick(this._onSortTypeChange);

    this._pointControllers = renderCards(this._events, this._container, this._onDataChange, this._onViewChange);
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    let isSortedByDefault = true;

    switch (sortType) {
      case SortTypes.EVENT:
        isSortedByDefault = true;
        sortedEvents = this._events.slice();
        break;
      case SortTypes.TIME:
        isSortedByDefault = false;
        sortedEvents = this._events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        break;
      case SortTypes.PRICE:
        isSortedByDefault = false;
        sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
        break;
    }

    this._container.innerHTML = ``;
    this._pointControllers = renderCards(sortedEvents, this._container, this._onDataChange, this._onViewChange, isSortedByDefault);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [
      ...this._events.slice(0, index),
      newData,
      ...this._events.slice(index + 1)
    ];

    pointController.render(this._events[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}
