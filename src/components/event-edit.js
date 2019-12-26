import moment from 'moment';
import {ViewMode} from '../utils/common.js';
import flatpickr from 'flatpickr';
import PointModel from '../models/point-model.js';
import {TripType, DefaultButtonsText} from '../const.js';
import {doFirstLetterUppercase, formatTripType} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';

export default class EventEditForm extends AbstractSmartComponent {
  constructor(event, mode, store) {
    super();
    this._event = event;

    this._mode = mode;

    this._destinations = store.getDestinations();
    this._offers = store.getOffers();
    this._destinationList = store.getDestinationNames();

    this._currentStartDate = event.startDate;
    this._currentEndDate = event.endDate;
    this._currentDestination = event.destination;
    this._currentOffers = this._mode !== ViewMode.ADD ? event.offers : this._offers.get(`flight`);
    this._currentEventType = this._mode !== ViewMode.ADD ? event.type : `flight`;

    this._buttonSaveText = DefaultButtonsText.SAVE;
    this._buttonDeleteText = DefaultButtonsText.DELETE;

    this._submitHandler = null;
    this._deleteHandler = null;
    this._cancelHandler = null;

    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    const {price, isFavorite} = this._event;
    const {name, description, pictures} = this._currentDestination;

    return (`<form class="${this._mode === ViewMode.ADD ? `trip-events__item` : ``}  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._currentEventType}.png" alt="Event type icon">
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
                <input id="event-type-${el}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${el}" ${this._currentEventType === el && `checked`}>
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
            ${formatTripType(this._currentEventType)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            <datalist id="destination-list-1">
              
      ${this._destinationList.map((it) => {
        return `<option value="${it}"></option>`;
      }).join(`\n`)}

            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._currentStartDate).format(`DD/MM/YY HH:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this.__currentEndDate).format(`DD/MM/YY HH:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${this._buttonSaveText}</button>
          <button class="event__reset-btn" type="reset">${this._mode === ViewMode.ADD ? `Cancel` : `${this._buttonDeleteText}`}</button>
          

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

      ${this._currentDestination.name === `` && this._mode === ViewMode.ADD
        ? ``
        : `<section class="event__details">

      ${this._currentOffers.length === 0
        ? ``
        : `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
            
      ${this._currentOffers.map(({price: offerPrice, title}) => {
        return (
          `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${title && `checked`}>
            <label class="event__offer-label" for="event-offer-${title}-1">
              <span class="event__offer-title">${title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
            </label>
          </div>`
        );
      }).join(`\n`)}    

          </div>
        </section>`
      }
          
  
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>
  
              <div class="event__photos-container">
                <div class="event__photos-tape">

      ${pictures.map(({src, description: alt}) => {
        return `<img class="event__photo" src="${src}" alt="${alt}">`;
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
    const form = this.getElement();
    const formData = new FormData(form);
    const offersChecked = [...form.querySelectorAll(`.event__offer-checkbox`)]
      .filter((input) => input.checked)
      .map((input) => {
        return {
          title: input.parentElement.querySelector(`.event__offer-title`).textContent,
          price: parseInt(input.parentElement.querySelector(`.event__offer-price`).textContent, 10),
        };
      });
    const destination = {
      name: formData.get(`event-destination`),
      description: form.querySelector(`.event__destination-description`).textContent,
      pictures: [...form.querySelectorAll(`.event__photo`)].map((el) => {
        return {src: el.src, description: el.alt};
      })
    };

    return new PointModel({
      'type': formData.get(`event-type`),
      'destination': destination,
      'offers': offersChecked,
      'date_from': moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf(),
      'date_to': moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf(),
      'base_price': parseInt(formData.get(`event-price`), 10),
      'is_favorite': form.querySelector(`.event__favorite-checkbox`) ? form.querySelector(`.event__favorite-checkbox`).checked : false
    });
  }

  setButtonsText(action, text) {
    if (action === `save`) {
      this._buttonSaveText = text;
    }
    if (action === `delete`) {
      this._buttonDeleteText = text;
    }

    this.rerender();
  }

  setDefaultButtonsText() {
    this._buttonSaveText = DefaultButtonsText.SAVE;
    this._buttonDeleteText = DefaultButtonsText.DELETE;

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

  reset() {
    const event = this._event;

    this._currentStartDate = event.startDate;
    this._currentEndDate = event.endDate;
    this._currentDestination = event.destination;
    this._currentEventType = event.type;
    this._currentOffers = event.offers;

    this.rerender();
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

    const destinationInput = element.querySelector(`.event__input--destination`);
    if (destinationInput.value === ``) {
      destinationInput.setCustomValidity(`Please select a valid value from list.`);
    }

    element.querySelector(`.event__type-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          this._currentEventType = evt.target.value;
          this._currentOffers = this._offers.get(evt.target.value);

          this.rerender();
        }
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        this._currentDestination = this._destinations.find((el) => el.name === evt.target.value);

        let optionsFound = false;
        [...evt.target.list.options].forEach((option) => {
          if (option.value === evt.target.value) {
            optionsFound = true;
          }
        });

        if (!optionsFound) {
          evt.target.setCustomValidity(`Please select a valid value from list.`);
        } else {
          evt.target.setCustomValidity(``);
        }

        this.rerender();
      });

    element.querySelector(`#event-start-time-1`)
      .addEventListener(`change`, (evt) => {
        this._currentStartDate = moment(evt.target.value, `DD/MM/YY HH:mm`).valueOf();
        this._currentEndDate = this._currentStartDate > this._currentEndDate
          ? this._currentStartDate
          : this._currentEndDate;

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

    this._flatpickrStartDate = this._setFlatpickr(this.getElement().querySelector(`#event-start-time-1`), this._currentStartDate);
    this._flatpickrEndDate = this._setFlatpickr(this.getElement().querySelector(`#event-end-time-1`), this._currentEndDate, this._currentStartDate);
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
