import {SortType} from '../const.js';
import {renderElement, RenderPosition, removeComponent} from '../utils/render.js';
import NoEventsComponent from '../components/no-events.js';
import EventSortComponent from '../components/event-sort.js';
import TripDayItemComponent from '../components/trip-day-item.js';
import PointController from './point-controller.js';
import {ViewMode as PointControllerMode, EmptyCard, formatDateWithoutTime, parseDateWithoutTime} from '../utils/common.js';

const renderpoints = (points, container, onDataChange, onViewChange, store, isSortedByDefault = true) => {
  const pointControllers = [];

  const dates = isSortedByDefault
    ? [...new Set(points.map((card) => formatDateWithoutTime(card.startDate)))]
    : [true];

  dates.forEach((date, dateIndex) => {
    const day = isSortedByDefault ? new TripDayItemComponent(parseDateWithoutTime(date), dateIndex + 1) : new TripDayItemComponent();

    points
      .filter((point) => {
        return isSortedByDefault ? formatDateWithoutTime(point.startDate) === date : point;
      })
      .forEach((point) => {
        const pointController = new PointController(
            day.getElement().querySelector(`.trip-events__list`),
            onDataChange,
            onViewChange,
            store
        );

        pointController.render(point, PointControllerMode.DEFAULT);
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
    this._newEventButton = document.querySelector(`.trip-main__event-add-btn`);

    this._activeSortType = SortType.EVENT;
    this._isSortedByDefault = true;

    this._noEventsComponent = new NoEventsComponent();
    this._eventSortComponent = null;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render() {
    const pointsAll = this._pointsModel.getPointsAll();

    this._newEventButton.addEventListener(`click`, () => this._createNewPoint());

    if (pointsAll.length === 0) {
      if (this._eventSortComponent) {
        removeComponent(this._eventSortComponent);
        this._eventSortComponent = null;
      }
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

    this._onSortTypeChange(this._activeSortType);
  }

  _createNewPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._newEventButton.disabled = true;
    this._onViewChange();
    this._creatingPoint = new PointController(this._container.parentElement, this._onDataChange, this._onViewChange, this._store);
    if (this._noEventsComponent) {
      removeComponent(this._noEventsComponent);
    }
    this._creatingPoint.render(EmptyCard, PointControllerMode.ADD);
    this._pointControllers.push(this._creatingPoint);
  }

  _onSortTypeChange(sortType) {
    this._activeSortType = sortType;

    let sortedPoints = [];
    const points = this._pointsModel.getPoints();

    switch (sortType) {
      case SortType.EVENT:
        this._isSortedByDefault = true;
        sortedPoints = points.slice();
        break;
      case SortType.TIME:
        this._isSortedByDefault = false;
        sortedPoints = points.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        break;
      case SortType.PRICE:
        this._isSortedByDefault = false;
        sortedPoints = points.slice().sort((a, b) => b.price - a.price);
        break;
    }

    this._container.innerHTML = ``;
    this._pointControllers = renderpoints(sortedPoints, this._container, this._onDataChange, this._onViewChange, this._store, this._isSortedByDefault);
  }

  _removePoints() {
    this._container.innerHTML = ``;
    this._pointControllers.forEach((_pointcontroller) => _pointcontroller.destroy());
    this._pointcontrollers = [];
  }

  updatePoints() {
    this._removePoints();
    this.render();
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyCard) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._pointControllers.pop();
        this._newEventButton.disabled = false;
      } else {
        this._api.createPoint(newData)
        .then((pointModel) => {
          this._pointsModel.addPoint(pointModel);
          this._newEventButton.disabled = false;
        })
        .catch(() => {
          pointController.shake();
        });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updatePoint(oldData.id, newData)
      .then((pointModel) => {
        const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

        if (isSuccess) {
          pointController.render(pointModel, PointControllerMode.DEFAULT);
        }
      })
      .catch(() => {
        pointController.shake();
      });
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}
