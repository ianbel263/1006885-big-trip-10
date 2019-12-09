import {ESC_KEYCODE} from '../const.js';
import {uniqueDates} from '../mock/card.js';
import {renderElement, replaceComponents, RenderPosition} from '../utils/render.js';
import {eventSortFilters} from '../mock/event-sort.js';
import EventSortComponent from '../components/event-sort.js';
import TripDaysContainerComponent from '../components/trip-days-container.js';
import EventItemComponent from '../components/event-item.js';
import EventEditFormComponent from '../components/event-edit.js';
import NoEventsComponent from '../components/no-events.js';
import TripDayItemComponent from '../components/trip-day-item.js';

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysContainerComponent = new TripDaysContainerComponent();
    this._eventSortComponent = new EventSortComponent(eventSortFilters);
  }

  renderEvents(events) {
    const renderEventItem = (event, currentDay) => {

      const onEscPress = (evt) => {
        if (evt.keyCode === ESC_KEYCODE) {
          replaceEditToEvent();
          document.removeEventListener(`keydown`, onEscPress);
        }
      };

      const replaceEventToEdit = () => {
        replaceComponents(eventEditFromComponent, eventItem);
      };

      const replaceEditToEvent = () => {
        replaceComponents(eventItem, eventEditFromComponent);
      };

      const eventItem = new EventItemComponent(event);
      const eventEditFromComponent = new EventEditFormComponent(event);
      const eventsList = currentDay.getElement().querySelector(`.trip-events__list`);

      eventItem.setEditButtonHandler(() => {
        replaceEventToEdit();
        document.addEventListener(`keydown`, onEscPress);
      });

      eventEditFromComponent.setSubmitHandler((evt) => {
        evt.preventDefault();
        replaceEditToEvent();
      });

      eventEditFromComponent.setCancelButtonHandler(() => {
        replaceEditToEvent();
      });

      renderElement(eventsList, eventItem);
    };

    const container = this._container;

    if (events.length === 0) {
      renderElement(container, this._noEventsComponent);
      return;
    }

    renderElement(container, this._eventSortComponent, RenderPosition.AFTERBEGIN);

    renderElement(container, this._tripDaysContainerComponent);

    const renderEvents = (data, isSortedByDefault = true) => {
      if (isSortedByDefault) {
        [...uniqueDates]
        .forEach((date, i) => {
          const day = new TripDayItemComponent(date, i);

          data
            .filter(({startDate}) => new Date(startDate).toDateString() === date)
            .forEach((it) => {
              renderEventItem(it, day);
            });

          renderElement(this._tripDaysContainerComponent.getElement(), day);
        });
      } else {
        const eventsContainer = new TripDayItemComponent();

        eventsContainer.getElement().querySelector(`.day__info`).innerHTML = ``;
        data.forEach((it) => renderEventItem(it, eventsContainer));
        renderElement(this._tripDaysContainerComponent.getElement(), eventsContainer);
      }
    };

    renderEvents(events);

    this._eventSortComponent.setSortChangeHandler((sortType) => {
      let isSortedByDefault = true;
      let sortedEvents = [];

      switch (sortType) {
        case `event`:
          isSortedByDefault = true;
          sortedEvents = events.slice();
          break;
        case `time`:
          isSortedByDefault = false;
          sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
          break;
        case `price`:
          isSortedByDefault = false;
          sortedEvents = events.slice().sort((a, b) => b.price - a.price);
          break;
      }

      this._tripDaysContainerComponent.getElement().innerHTML = ``;
      renderEvents(sortedEvents, isSortedByDefault);
    });
  }
}
