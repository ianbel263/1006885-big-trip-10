export default class Store {
  constructor() {
    this._destinations = [];
    this._offers = [];
  }

  getDestinations() {
    return this._destinations;
  }

  getDestinationNames() {
    return [...new Set(this._destinations.map(({name}) => name))];
  }

  getOffers() {
    const mapOffers = new Map(this._offers.map((el) => [el.type, el.offers]));
    mapOffers.set(`trip`, []);
    return mapOffers;
  }

  setDestinations(data) {
    this._destinations = data;
  }

  setOffers(data) {
    this._offers = data;
  }
}
