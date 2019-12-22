import {SortType} from '../const.js';
import {renderElement, RenderPosition, removeComponent} from '../utils/render.js';
import {eventSortFilters} from '../mock/event-sort.js';
import NoEventsComponent from '../components/no-events.js';
import EventSortComponent from '../components/event-sort.js';
import TripDayItemComponent from '../components/trip-day-item.js';
import PointController, {ViewMode as PointControllerMode, EmptyCard} from './point-controller.js';

let days = [];

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

        pointController.render(_event, PointControllerMode.DEFAULT);
        pointControllers.push(pointController);
      });

    renderElement(container, day);
    days.push(day);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._pointControllers = [];
    this._creatingPoint = null;
    this._isSortedByDefault = true;

    this._noEventsComponent = new NoEventsComponent();
    this._eventSortComponent = null;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._updatePoints = this._updatePoints.bind(this);

    this._pointsModel.setOnDataChange(this._updatePoints);
    this._pointsModel.setOnFilterChange(this._updatePoints);
  }

  render() {
    const cards = this._pointsModel.getPoints();
    const cardsAll = this._pointsModel.getPointsAll();

    if (cardsAll.length === 0) {
      renderElement(this._container, this._noEventsComponent);
      return;
    } else {
      removeComponent(this._noEventsComponent);
    }

    if (!this._eventSortComponent) {
      this._eventSortComponent = new EventSortComponent(eventSortFilters);
      renderElement(this._container.parentElement, this._eventSortComponent, RenderPosition.AFTERBEGIN);
      this._eventSortComponent.setOnSortChange(this._onSortTypeChange);
    }

    this._pointControllers = renderCards(cards, this._container, this._onDataChange, this._onViewChange, this._isSortedByDefault);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._creatingPoint = new PointController(null, this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyCard, PointControllerMode.ADD);
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

  _removePoints() {
    this._pointControllers.forEach((_pointcontroller) => _pointcontroller.destroy());
    this._pointcontrollers = [];

    days.forEach((_day) => removeComponent(_day));
    days = [];
  }

  _updatePoints() {
    this._removePoints();
    this.render();
  }

  _onDataChange(pointController, oldData, newData) {
    // console.log('oldData', oldData)
    // console.log('newData', newData)
    if (oldData === EmptyCard) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
      } else {
        // console.log(`ADD NEW DATA`);
        this._pointsModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.ADD);
      }
    }
    if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}
