export default class Store {
  constructor() {
    this._destinations = [];
    this._offers = [];
  }

  getDestinations() {
    return this._destinations;
  }

  getOffers() {
    return this._offers;
  }

  setDestinations(data) {
    this._destinations = data;
  }

  setOffers(data) {
    this._offers = data;
  }
}
