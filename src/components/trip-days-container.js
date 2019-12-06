import AbstractComponent from './abstract-component.js';

const tripDaysContainerTemplate = () => {
  return (
    `<ul class="trip-days">

    </ul>`
  );
};

export default class TripDaysContainer extends AbstractComponent {
  getTemplate() {
    return tripDaysContainerTemplate();
  }
}
