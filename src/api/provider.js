import nanoid from 'nanoid';
import Point from '../models/point-model.js';

const getSyncedPoints = (items) => items.filter(({success}) => success).map(({payload}) => payload.point);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getData({url}) {
    if (this._isOnLine()) {
      return this._api.getData({url})
        .then((data) => {
          this._store.setAppStoreData(data);
          return data;
        });

    }
    const appStoreData = Object.values(this._store.getAll());
    this._isSynchronized = false;

    return Promise.resolve(appStoreData);
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints()
        .then((points) => {
          points.forEach((point) => this._store.setPoint(point.id, point.toRAW()));
          return points;
        });
    }

    const storePoints = Object.values(this._store.getAll());
    this._isSynchronized = false;

    return Promise.resolve(Point.parsePoints(storePoints));
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setPoint(newPoint.id, newPoint.toRAW());
          return newPoint;
        });
    }

    // Нюанс в том, что при создании мы не указываем id задачи, нам его в ответе присылает сервер.
    // Но на случай временного хранения мы должны позаботиться и о временном id
    const fakeNewPointId = nanoid();
    const fakeNewPoint = Point.parsePoint(Object.assign({}, point.toRAW(), {id: fakeNewPointId}));
    this._store.setPoint(fakeNewPoint.id, Object.assign({}, fakeNewPoint.toRAW(), {offline: true}));
    this._isSynchronized = false;

    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, point) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._store.setPoint(newPoint.id, newPoint.toRAW());
          return newPoint;
        });
    }

    const fakeUpdatedPoint = Point.parsePoint(Object.assign({}, point.toRAW(), {id}));
    this._store.setPoint(id, Object.assign({}, fakeUpdatedPoint.toRAW(), {offline: true}));
    this._isSynchronized = false;

    return Promise.resolve(fakeUpdatedPoint);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id)
        .then(() => {
          this._store.removeItem(id);
        });
    }

    this._store.removeItem(id);
    this._isSynchronized = false;

    return Promise.resolve();
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  sync() {
    if (this._isOnLine()) {
      const storePoints = Object.values(this._store.getAll());

      return this._api.sync(storePoints)
        .then((response) => {
          // Удаляем из хранилища задачи, что были созданы
          // или изменены в оффлайне. Они нам больше не нужны
          storePoints.filter((point) => point.offline).forEach((point) => {
            this._store.removeItem(point.id);
          });

          // Забираем из ответа синхронизированные задачи
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент,
          // вдруг сеть пропадёт
          [...createdPoints, ...updatedPoints].forEach((point) => {
            this._store.setPoint(point.id, point);
          });

          // Помечаем, что всё синхронизировано
          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
