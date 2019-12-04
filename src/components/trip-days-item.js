import {Months} from '../utils.js';
import {castDateFormat} from '../utils.js';
import {castTimeFormat} from '../utils.js';
import {calculateTimeInterval} from '../utils.js';

export const createDayItemTemplate = (cards) => {
  let daysCount = 0;
  return Array.from(new Set(cards.map((card) => new Date(card.startDate).toDateString()))).map((day) => {
    daysCount++;
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${daysCount}</span>
          <time class="day__date" datetime="${castDateFormat(day)}">${Months[new Date(day).getMonth()]}&nbsp;${new Date(day).getDate()}</time>
        </div>
        <ul class="trip-events__list">

    ${cards.filter(({startDate}) => {
        return new Date(startDate).toDateString() === day;
      }).
      map(({type: {type}, destination, startDate, endDate, price, offers}) => {
        return (
          `<li class="trip-events__item">
            <div class="event">
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type} to ${destination}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${castDateFormat(startDate)}T${castTimeFormat(startDate)}">${castTimeFormat(startDate)}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${castDateFormat(endDate)}T${castTimeFormat(endDate)}">${castTimeFormat(endDate)}</time>
                </p>
                <p class="event__duration">${calculateTimeInterval(startDate, endDate)}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
          ${offers.map(({title, price: offerPrice}) => {
            return (
              `<li class="event__offer">
                <span class="event__offer-title">${title}</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
              </li>`
            );
          }).join(`\n`)}
              </ul>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`
        );
      }).join(`\n`)}
      </ul>
    </li>`
    );
  }).join(`\n`);
};
