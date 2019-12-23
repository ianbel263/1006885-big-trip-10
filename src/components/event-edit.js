import {destinations} from '../mock/card.js';
import {ViewMode} from '../utils/common.js';
import flatpickr from 'flatpickr';
import {TripType} from '../const.js';
import {doFirstLetterUppercase, formatTripType, parseDate} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';

export default class EventEditForm extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;

    this._mode = ViewMode.DEFAULT;
    this._destination = event.destination;

    this._submitHandler = null;
    this._deleteHandler = null;
    this._cancelHandler = null;

    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    const {type, startDate, endDate, price, description, photosUrls, isFavorite} = this._event;

    return (`<form class="${this._mode === ViewMode.ADD ? `trip-events__item` : ``}  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">

      ${Object.keys(TripType).map((group) => {
        return (
          `<fieldset class="event__type-group">
            <legend class="visually-hidden">${TripType[group]}</legend>

          ${TripType[group].map((el) => {
            return (
              `<div class="event__type-item">
                <input id="event-type-${el}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${el}" ${type === el && `checked`}>
                <label class="event__type-label  event__type-label--${el}" for="event-type-${el}-1">${doFirstLetterUppercase(el)}</label>
              </div>`
            );
          }).join(`\n`)}

          </fieldset>`
        );
      }).join(`\n`)}

            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${formatTripType(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination}" list="destination-list-1">
            <datalist id="destination-list-1">
              
      ${[...destinations].map((it) => {
        return `<option value="${it}"></option>`;
      }).join(`\n`)}

            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${this._mode === ViewMode.ADD ? `Cancel` : `Delete`}</button>
          

      ${this._mode === ViewMode.ADD
        ? ``
        : `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
  
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`
      }
        </header>

      ${!this._destination && this._mode === ViewMode.ADD
        ? ``
        : `<section class="event__details">

          <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
          <div class="event__available-offers">
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
              <label class="event__offer-label" for="event-offer-luggage-1">
                <span class="event__offer-title">Add luggage</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">30</span>
              </label>
            </div>
  
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
              <label class="event__offer-label" for="event-offer-comfort-1">
                <span class="event__offer-title">Switch to comfort class</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">100</span>
              </label>
            </div>
  
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
              <label class="event__offer-label" for="event-offer-meal-1">
                <span class="event__offer-title">Add meal</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">15</span>
              </label>
            </div>
  
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
              <label class="event__offer-label" for="event-offer-seats-1">
                <span class="event__offer-title">Choose seats</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">5</span>
              </label>
            </div>
  
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
              <label class="event__offer-label" for="event-offer-train-1">
                <span class="event__offer-title">Travel by train</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">40</span>
              </label>
            </div>
          </div>
        </section>
  
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>
  
              <div class="event__photos-container">
                <div class="event__photos-tape">
      ${photosUrls.map((photoUrl) => {
        return `<img class="event__photo" src="${photoUrl}" alt="Event photo">`;
      }).join(`\n`)}
                </div>
              </div>
            </section>
          </section>`
      }
      </form>`
    );
  }

  getData() {
    const element = this.getElement();

    const formData = new FormData(element);
    const offersChecked = [...element.querySelectorAll(`.event__offer-checkbox`)]
      // .filter((input) => input.checked)
      .map((input) => {
        return {
          type: input.name.slice(12),
          title: input.parentElement.querySelector(`.event__offer-title`).textContent,
          price: input.parentElement.querySelector(`.event__offer-price`).textContent,
          isChecked: input.checked
        };
      });

    return {
      type: formData.get(`event-type`),
      destination: formData.get(`event-destination`),
      description: element.querySelector(`.event__destination-description`)
        ? element.querySelector(`.event__destination-description`).textContent : ``,
      photosUrls: [...element.querySelectorAll(`.event__photo`)].map((el) => el.src),
      offers: offersChecked,
      startDate: parseDate(formData.get(`event-start-time`)),
      endDate: parseDate(formData.get(`event-end-time`)),
      price: formData.get(`event-price`),
      isFavorite: false
    };
  }

  setMode(mode) {
    this._mode = mode;

    this.rerender();
  }

  removeElement() {
    this._deleteFlatpickrs();
    super.removeElement();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  setOnFormSubmit(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setOnDeleteButtonClick(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteHandler = handler;
  }

  setOnCancelButtonClick(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._cancelHandler = handler;
  }

  setOnFavoriteButtonClick(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);
  }

  recoveryListeners() {
    this.setOnFormSubmit(this._submitHandler);
    this.setOnDeleteButtonClick(this._deleteHandler);
    this._subscribeOnEvents();

    if (this._mode === ViewMode.DEFAULT) {
      this.setOnCancelButtonClick(this._cancelHandler);
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          this._event.type = evt.target.value;
          this.rerender();
        }
      });

    element.querySelector(`.event__input--destination`)
    .addEventListener(`change`, (evt) => {
      // this._event.destination = evt.target.value;
      this._destination = evt.target.value;

      this.rerender();
    });

    element.querySelector(`#event-start-time-1`)
      .addEventListener(`change`, (evt) => {
        this._event.startDate = parseDate(evt.target.value);
        this._event.endDate = this._event.startDate > this._event.endDate
          ? this._event.startDate
          : this._event.endDate;


        this.rerender();
      });
  }

  _deleteFlatpickrs() {
    if (this._flatpickrStartDate && this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }
  }

  _applyFlatpickr() {
    this._deleteFlatpickrs();

    this._flatpickrStartDate = this._setFlatpickr(this.getElement().querySelector(`#event-start-time-1`), this._event.startDate);
    this._flatpickrEndDate = this._setFlatpickr(this.getElement().querySelector(`#event-end-time-1`), this._event.endDate, this._event.startDate);
  }

  _setFlatpickr(input, defaultTime, dateMin = `today`) {
    return flatpickr(input, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      minDate: dateMin,
      defaultDate: defaultTime,
      allowInput: true,
    });
  }
}
