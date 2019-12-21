import {SortType} from '../const.js';
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
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    // this._events = [];
    this._pointControllers = [];

    this._isSortedByDefault = true;

    this._noEventsComponent = new NoEventsComponent();
    this._eventSortComponent = new EventSortComponent(eventSortFilters);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setOnFilterChange(this._onFilterChange);
  }

  render() {
    const cards = this._pointsModel.getPoints();

    if (cards.length === 0) {
      renderElement(this._container, this._noEventsComponent);
      return;
    }

    renderElement(this._container.parentElement, this._eventSortComponent, RenderPosition.AFTERBEGIN);
    this._eventSortComponent.setOnSortChange(this._onSortTypeChange);

    this._pointControllers = renderCards(cards, this._container, this._onDataChange, this._onViewChange);
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    const points = this._pointsModel.getPoints();

    switch (sortType) {
      case SortType.EVENT:
        this._isSortedByDefault = true;
        sortedEvents = points.slice();
        break;
      case SortType.TIME:
        this._isSortedByDefault = false;
        sortedEvents = points.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        break;
      case SortType.PRICE:
        this._isSortedByDefault = false;
        sortedEvents = points.slice().sort((a, b) => b.price - a.price);
        break;
    }

    this._container.innerHTML = ``;
    this._pointControllers = renderCards(sortedEvents, this._container, this._onDataChange, this._onViewChange, this._isSortedByDefault);
  }

  _onDataChange(pointController, oldData, newData) {
    if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._container.innerHTML = ``;
      this._pointControllers = renderCards(this._pointsModel.getPoints(), this._container, this._onDataChange, this._onViewChange, this._isSortedByDefault);
    }

    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    const cards = this._pointsModel.getPoints();

    this._container.innerHTML = ``;
    this._pointControllers = renderCards(cards, this._container, this._onDataChange, this._onViewChange, this._isSortedByDefault);
  }
}
