import {valueToMonth} from '../utils.js';
import {castDateFormat} from '../utils.js';
import {createEventItemTemplate} from '../components/event-item.js';

const createDayItemTemplate = (date, events) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = valueToMonth[dateObj.getMonth()];

  const eventsMarkup = events.map((event) => createEventItemTemplate(event)).join(`\n`);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">${month}&nbsp;${day}</time>
      </div>
      <ul class="trip-events__list">
        ${eventsMarkup}
      </ul>
     </li>`
  );
};

const generateDaysMarkup = (days, events) => {
  return Array.from(days).map((day) => {
    const dayEvents = events.filter((event) => castDateFormat(event.startDate) === day);
    return createDayItemTemplate(day, dayEvents);
  }).join(`\n`);
};

export const createDaysListTemplate = (events) => {
  events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const days = new Set(events.map((event) => castDateFormat(event.startDate)));
  const daysMarkup = generateDaysMarkup(days, events);

  return (
    `<ul class="trip-days">
      ${daysMarkup}
    </ul>`
  );
};
