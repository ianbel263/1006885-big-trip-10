import {ESC_KEYCODE} from '../const.js';
import EventItemComponent from '../components/event-item.js';
import EventEditFormComponent from '../components/event-edit.js';
import {renderElement, replaceComponents} from '../utils/render.js';

const ViewMode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._mode = ViewMode.DEFAULT;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._eventItemComponent = null;
    this._eventEditFormComponent = null;

    this._onEscPress = this._onEscPress.bind(this);
  }

  renderEventItem(event) {

    const oldEventItemComponent = this._eventItemComponent;
    const oldEventEditFormComponent = this._eventEditFormComponent;

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

    if (oldEventItemComponent && oldEventEditFormComponent) {
      replaceComponents(this._eventItemComponent, oldEventItemComponent);
      replaceComponents(this._eventEditFormComponent, oldEventEditFormComponent);
    } else {
      renderElement(this._container, this._eventItemComponent);
    }
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replaceComponents(this._eventEditFormComponent, this._eventItemComponent);
    this._mode = ViewMode.EDIT;
  }

  _replaceEditToEvent() {
    replaceComponents(this._eventItemComponent, this._eventEditFormComponent);
    this._mode = ViewMode.DEFAULT;
  }

  _onEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }

  setDefaultView() {
    if (this._mode !== ViewMode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}

