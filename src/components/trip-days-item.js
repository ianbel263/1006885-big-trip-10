import {valueToMonth} from '../utils.js';

const createDaysList = (date) => {
  return (
    `<span class="day__counter">1</span>
    <time class="day__date" datetime="2019-03-18">${valueToMonth[date.getMonth()]}&nbsp;${date.getDate()}</time>`
  );
};

export const createTripDaysItemTemplate = (date) => {
  return (
    `<ul class = "trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          ${createDaysList(date)}
        </div>
      </li>
    </ul>`
  );
};
