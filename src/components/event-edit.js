import {formatDate} from '../utils.js';

export const createEventEditFormTemplate = (event, eventPointTypes, eventPointCities) => {

  const {destination, startDate, endDate, price, offers, description, photosUrls} = event;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">

    ${Array.from(new Set(eventPointTypes.map((pointTypes) => pointTypes.group)))
      .map((el) => {
        return (
          `<fieldset class="event__type-group">
            <legend class="visually-hidden">${el}</legend>

            ${eventPointTypes.filter((eventType) => eventType.group === el)
              .map(({type}) => {
                // console.log("it", it);
                return (
                  `<div class="event__type-item">
                    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
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
      ${event.type.type} at
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
      ${eventPointCities.map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    }).join(`\n`)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(startDate)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
    ${offers.map(({type, price: offerPrice, title, isChecked}) => {
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${type}-1">
            <span class="event__offer-title">${title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
          </label>
        </div>`
      );
    }).join(`\n`)}
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
      </section>
    </form>`
  );
};
