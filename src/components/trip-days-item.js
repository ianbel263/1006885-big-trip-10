import {valueToMonth} from '../utils.js';

export const createTripDaysItemTemplate = (card) => {
  const {startDate} = card;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">${valueToMonth[startDate.getMonth()]}&nbsp;${startDate.getDate()}</time>
      </div>
    </li>`
  );
};
