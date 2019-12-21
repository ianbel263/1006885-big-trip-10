import {ESC_KEYCODE} from '../const.js';
import EventItemComponent from '../components/event-item.js';
import EventEditFormComponent from '../components/event-edit.js';
import {renderElement, replaceComponents, removeComponent} from '../utils/render.js';
import CreateNewEventComponent from '../components/create-new-event.js';

export const ViewMode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADD: `add`
};

export const EmptyCard = {
  type: ``,
  destination: ``,
  description: ``,
  photosUrls: [],
  offers: [],
  startDate: Date.now(),
  endDate: Date.now(),
  price: 0,
  isFavorite: false
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

  render(event, viewMode) {
    this._mode = viewMode;

    const oldEventItemComponent = this._eventItemComponent;
    const oldEventEditFormComponent = this._eventEditFormComponent;

    this._eventItemComponent = new EventItemComponent(event);
    this._eventEditFormComponent = new EventEditFormComponent(event);
    this._createNewEventComponent = new CreateNewEventComponent(EmptyCard);

    this._eventItemComponent.setOnEditButtonClick(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscPress);
    });

    this._eventEditFormComponent.setOnFormSubmit((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    this._eventEditFormComponent.setOnDeleteButtonClick(() => {
      this._onDataChange(this, event, null);
    });

    this._eventEditFormComponent.setOnCancelButtonClick(() => {
      this._replaceEditToEvent();
    });

    this._eventEditFormComponent.setOnFavoriteButtonClick(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    switch (viewMode) {
      case ViewMode.DEFAULT: 
        if (oldEventItemComponent && oldEventEditFormComponent) {
          replaceComponents(this._eventItemComponent, oldEventItemComponent);
          replaceComponents(this._eventEditFormComponent, oldEventEditFormComponent);
        } else {
          renderElement(this._container, this._eventItemComponent);
        }
        break;
      case ViewMode.ADD: 
        if (oldEventItemComponent && oldEventEditFormComponent) {
          removeComponent(oldEventItemComponent);
          removeComponent(oldEventEditFormComponent);
        }

        const sortFilter = document.querySelector(`.trip-sort`);
        // const createNewEventComponent = new CreateNewEventComponent();
        sortFilter.after(this._createNewEventComponent.getElement());
        
        this._createNewEventComponent.setOnFormSubmit((evt) => {
          evt.preventDefault();

          const data = this._createNewEventComponent.getData();
          console.log('data', data);
          this._onDataChange(this, event, data);
        });
        // document.addEventListener(`keydown`, this._onEscPress);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== ViewMode.DEFAULT) {
      this._replaceEditToEvent();
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
      console.log('ESC_KEYCODE', ESC_KEYCODE);

      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }
}

