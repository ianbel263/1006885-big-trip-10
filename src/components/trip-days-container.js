import {createElement} from '../utils.js';

const tripDaysContainerTemplate = () => {
  return (
    `<ul class="trip-days">

    </ul>`
  );
};

export default class TripDaysContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return tripDaysContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
