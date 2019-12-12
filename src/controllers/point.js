import {ESC_KEYCODE} from '../const.js';
import EventItemComponent from '../components/event-item.js';
import EventEditFormComponent from '../components/event-edit.js';
import {renderElement, replaceComponents} from '../utils/render.js';

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;

    this._onDataChange = onDataChange;

    this._eventItemComponent = null;
    this._eventEditFormComponent = null;

    this._onEscPress = this._onEscPress.bind(this);
  }

  renderEventItem(event) {

    this._eventItemComponent = new EventItemComponent(event);
    this._eventEditFormComponent = new EventEditFormComponent(event);

    this._eventItemComponent.setOnEditButtonClick(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscPress);
    });

    this._eventEditFormComponent.setOnFormSubmit((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    this._eventEditFormComponent.setOnCancelButtonClick(() => {
      this._replaceEditToEvent();
    });

    this._eventEditFormComponent.setOnFavoriteButtonClick(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    renderElement(this._container, this._eventItemComponent);
  }

  _replaceEventToEdit() {
    replaceComponents(this._eventEditFormComponent, this._eventItemComponent);
  }

  _replaceEditToEvent() {
    replaceComponents(this._eventItemComponent, this._eventEditFormComponent);
  }

  _onEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }
}

