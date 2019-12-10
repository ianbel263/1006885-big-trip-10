import AbstractComponent from './abstract-component.js';

export default class TripDaysContainer extends AbstractComponent {
  getTemplate() {
    return (
      `<ul class="trip-days">
      </ul>`
    );
  }
}
