import AbstractComponent from './abstract-component.js';

export default class LoadError extends AbstractComponent {
  constructor(errorMessage) {
    super();

    this._errorMessage = errorMessage;
  }

  getTemplate() {
    return (
      `<p class="trip-events__msg">Loading error! Please try again later</p>
      <p class="trip-events__msg">Error code: ${this._errorMessage}</p>`
    );
  }
}
