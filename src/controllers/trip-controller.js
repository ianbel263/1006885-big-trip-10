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

    this._NoEventsComponent = new NoEventsComponent();
    this._TripDaysContainerComponent = new TripDaysContainerComponent();
    this._EventSortComponent = new EventSortComponent(eventSortFilters);
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
      renderElement(container, this._NoEventsComponent);
      return;
    }

    renderElement(container, this._EventSortComponent, RenderPosition.AFTERBEGIN);

    renderElement(container, this._TripDaysContainerComponent);

    const renderEventsByDefault = () => {
      [...uniqueDates]
        .forEach((date, i) => {
          const day = new TripDayItemComponent(date, i);

          events
            .filter(({startDate}) => new Date(startDate).toDateString() === date)
            .forEach((it) => {
              renderEventItem(it, day);
            });

          renderElement(this._TripDaysContainerComponent.getElement(), day);
        });
    };

    const renderSortedEvents = (sortedEvents) => {
      const eventsContainer = new TripDayItemComponent();

      eventsContainer.getElement().querySelector(`.day__info`).innerHTML = ``;
      sortedEvents.forEach((event) => renderEventItem(event, eventsContainer));
      renderElement(this._TripDaysContainerComponent.getElement(), eventsContainer);
    };

    renderEventsByDefault();

    let currentSortType = `event`;
    this._EventSortComponent.setSortChangeHandler((sortType) => {
      if (currentSortType === sortType) {
        return;
      }

      let sortedEvents = [];
      switch (sortType) {
        case `event`:
          this._TripDaysContainerComponent.getElement().innerHTML = ``;
          renderEventsByDefault();
          break;
        case `time`:
          this._TripDaysContainerComponent.getElement().innerHTML = ``;
          sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
          renderSortedEvents(sortedEvents);
          break;
        case `price`:
          this._TripDaysContainerComponent.getElement().innerHTML = ``;
          sortedEvents = events.slice().sort((a, b) => b.price - a.price);
          renderSortedEvents(sortedEvents);
          break;
      }
      currentSortType = sortType;
    });
  }
}
