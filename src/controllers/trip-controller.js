import {SortType} from '../const.js';
import {renderElement, RenderPosition, removeComponent} from '../utils/render.js';
import NoEventsComponent from '../components/no-events.js';
import EventSortComponent from '../components/event-sort.js';
import TripDayItemComponent from '../components/trip-day-item.js';
import PointController from './point-controller.js';
import {ViewMode as PointControllerMode, EmptyCard, formatDateWithoutTime, parseDateWithoutTime} from '../utils/common.js';

const renderCards = (cards, container, onDataChange, onViewChange, store, isSortedByDefault = true) => {
  const pointControllers = [];

  const dates = isSortedByDefault
    ? [...new Set(cards.map((card) => formatDateWithoutTime(card.startDate)))]
    : [true];

  dates.forEach((date, dateIndex) => {
    const day = isSortedByDefault ? new TripDayItemComponent(parseDateWithoutTime(date), dateIndex + 1) : new TripDayItemComponent();

    cards
      .filter((_event) => {
        return isSortedByDefault ? formatDateWithoutTime(_event.startDate) === date : _event;
      })
      .forEach((_event) => {
        const pointController = new PointController(
            day.getElement().querySelector(`.trip-events__list`),
            onDataChange,
            onViewChange,
            store
        );

        pointController.render(_event, PointControllerMode.DEFAULT);
        pointControllers.push(pointController);
      });

    renderElement(container, day);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container, pointsModel, api, store) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;
    this._store = store;

    this._pointControllers = [];
    this._creatingPoint = null;

    this._activeSortType = SortType.EVENT;
    this._isSortedByDefault = true;

    this._noEventsComponent = new NoEventsComponent();
    this._eventSortComponent = null;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    // this._updatePoints = this._updatePoints.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    // this._pointsModel.setOnDataChange(this._updatePoints);
    this._pointsModel.setOnFilterChange(this._onFilterChange);
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
      const eventSortFilters = Object.values(SortType)
        .map((sortType) => {
          return {
            name: sortType,
            isChecked: sortType === this._activeSortType
          };
        });
      this._eventSortComponent = new EventSortComponent(eventSortFilters);
      renderElement(this._container.parentElement, this._eventSortComponent, RenderPosition.AFTERBEGIN);
      this._eventSortComponent.setOnSortChange(this._onSortTypeChange);
    }

    this._pointControllers = renderCards(cards, this._container, this._onDataChange, this._onViewChange, this._store, this._isSortedByDefault);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    this._creatingPoint = new PointController(null, this._onDataChange, this._onViewChange, this._store);
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
    this._pointControllers = renderCards(sortedEvents, this._container, this._onDataChange, this._onViewChange, this._store, this._isSortedByDefault);
  }

  _removePoints() {
    this._container.innerHTML = ``;
    this._pointControllers.forEach((_pointcontroller) => _pointcontroller.destroy());
    this._pointcontrollers = [];
  }

  _updatePoints() {
    // console.log('_updatePoints');
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
        this._updatePoints();
      } else {
        // console.log(`ADD NEW DATA`);
        this._api.createPoint(newData)
        .then((pointModel) => {
          this._pointsModel.addPoint(pointModel);
          pointController.render(pointModel, PointControllerMode.DEFAULT);
        });

        this._pointsModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.ADD);
      }
    }
    if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        });
    } else {
      // const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
      this._api.updatePoint(oldData.id, newData)
      .then((pointModel) => {
        const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

        if (isSuccess) {
          pointController.render(pointModel, PointControllerMode.DEFAULT);
          this._updatePoints(this._showingPointsCount);
        }
      });

    }
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}
