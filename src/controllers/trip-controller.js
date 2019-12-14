import {renderElement} from '../utils/render.js';
import NoEventsComponent from '../components/no-events.js';
import TripDayItemComponent from '../components/trip-day-item.js';
import PointController from './point-controller.js';

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._eventPoints = [];

    this._noEventsComponent = new NoEventsComponent();

    // this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(events, isSortedByDefault = true) {
    this._events = events;
    this._eventPoints = [];

    const container = this._container;

    if (this._events.length === 0) {
      renderElement(container, this._noEventsComponent);
      return;
    }

    const dates = isSortedByDefault
      ? [...new Set(this._events.map((_event) => new Date(_event.startDate).toDateString()))]
      : [true];

    dates.forEach((date, dateIndex) => {
      const day = isSortedByDefault ? new TripDayItemComponent(date, dateIndex + 1) : new TripDayItemComponent();

      this._events
        .filter((_event) => {
          return isSortedByDefault ? new Date(_event.startDate).toDateString() === date : _event;
        })
        .forEach((_event) => {
          const pointController = new PointController(
              day.getElement().querySelector(`.trip-events__list`),
              this._onDataChange,
              this._onViewChange
          );

          pointController.render(_event);
          this._eventPoints.push(pointController);
        });

      renderElement(container, day);
    });
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    let isSortedByDefault = true;

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

    this._container.innerHTML = ``;
    this.render(this._events, sortedEvents, isSortedByDefault);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index]);
  }

  _onViewChange() {
    this._eventPoints.forEach((it) => it.setDefaultView());
  }
}
