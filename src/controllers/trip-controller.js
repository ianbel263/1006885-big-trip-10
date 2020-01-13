import {SortType, HIDDEN_CLASS} from '../const.js';
import {renderElement, RenderPosition, removeComponent} from '../utils/render.js';
import NoPointsComponent from '../components/no-points.js';
import PointSortComponent from '../components/point-sort.js';
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

    this._activeSortType = SortType.EVENT;
    this._isSortedByDefault = true;

    this._noPointsComponent = new NoPointsComponent();
    this._pointSortComponent = null;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this.onViewChange = this.onViewChange.bind(this);
  }

  render() {
    const pointsAll = this._pointsModel.getPointsAll();

    if (pointsAll.length === 0) {
      if (this._pointSortComponent) {
        removeComponent(this._pointSortComponent);
        this._pointSortComponent = null;
      }
      renderElement(this._container, this._noPointsComponent);
      return;
    } else {
      removeComponent(this._noPointsComponent);
    }

    if (!this._pointSortComponent) {
      const pointSortFilters = Object.values(SortType)
        .map((sortType) => {
          return {
            name: sortType,
            isChecked: sortType === this._activeSortType
          };
        });
      this._pointSortComponent = new PointSortComponent(pointSortFilters);
      renderElement(this._container.parentElement, this._pointSortComponent, RenderPosition.AFTERBEGIN);
      this._pointSortComponent.setOnSortChange(this._onSortTypeChange);
    }

    this._onSortTypeChange(this._activeSortType);
  }

  createNewPoint() {
    if (this._creatingPoint) {
      this.onViewChange();
      return;
    }

    this.onViewChange();
    this._creatingPoint = new PointController(this._container.parentElement, this._onDataChange, this.onViewChange, this._store);
    if (this._noPointsComponent) {
      removeComponent(this._noPointsComponent);
    }
    this._creatingPoint.render(EmptyCard, PointControllerMode.ADD);
    this._pointControllers.push(this._creatingPoint);
  }

  hide() {
    this._container.parentElement.classList.add(HIDDEN_CLASS);
  }

  onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  show() {
    this._container.parentElement.classList.remove(HIDDEN_CLASS);
  }

  updatePoints() {
    this._removePoints();
    this.render();
  }

  _removePoints() {
    this._container.innerHTML = ``;
    this._pointControllers.forEach((_pointcontroller) => _pointcontroller.destroy());
    this._pointcontrollers = [];
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyCard) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._pointControllers.pop();
      } else {
        pointController.blockOnSave();
        this._api.createPoint(newData)
        .then((pointModel) => {
          this._pointsModel.addPoint(pointModel);
        })
        .catch(() => {
          pointController.shake();
        });
      }
    } else if (newData === null) {
      pointController.blockOnSave();
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      pointController.blockOnSave();
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
    this._pointControllers = renderpoints(sortedPoints, this._container, this._onDataChange, this.onViewChange, this._store, this._isSortedByDefault);
  }
}
