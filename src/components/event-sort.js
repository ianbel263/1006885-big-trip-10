import AbstractComponent from './abstract-component.js';

export default class EventSort extends AbstractComponent {
  constructor(eventSortFilters) {
    super();
    this._eventSortFilters = eventSortFilters;
    // this._CurrentSortType = eventSortFilters[0].name.toLowerCase();
    // console.log("this._CurrentSortType", this._CurrentSortType);
  }

  getTemplate() {
    return (
      `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${this._eventSortFilters.map(({name, isChecked}) => {
        return (
          `<div class="trip-sort__item  trip-sort__item--${name.toLowerCase()}">
          <input id="sort-${name.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name.toLowerCase()}" ${isChecked ? `checked` : ``}>
          <label class="trip-sort__btn" for="sort-${name.toLowerCase()}">
            ${name}
            <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
              <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
            </svg>
          </label>
        </div>`
        );
      }).join(`\n`)}
        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
      </form>`
    );
  }

  setSortChangeHandler(handler) {
    this.getElement().querySelectorAll(`.trip-sort__btn`)
      .forEach((el) => el.addEventListener(`click`, function () {
        const sortType = el.getAttribute(`for`).slice(5);
        handler(sortType);
      }));
  }
}
