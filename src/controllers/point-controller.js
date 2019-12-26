import {ESC_KEYCODE} from '../const.js';
import PointModel from '../models/point-model';
import EventItemComponent from '../components/event-item.js';
import EventEditFormComponent from '../components/event-edit.js';
import {renderElement, replaceComponents, removeComponent} from '../utils/render.js';
import {ViewMode, EmptyCard} from '../utils/common.js';

export default class PointController {
  constructor(container, onDataChange, onViewChange, store) {
    this._container = container;

    this._mode = ViewMode.DEFAULT;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._store = store;

    this._eventItemComponent = null;
    this._eventEditFormComponent = null;

    this._onEscPress = this._onEscPress.bind(this);
  }

  render(event, mode) {
    this._mode = mode;

    const oldEventItemComponent = this._eventItemComponent;
    const oldEventEditFormComponent = this._eventEditFormComponent;

    this._eventItemComponent = new EventItemComponent(event, this._mode);
    this._eventItemComponent.setOnEditButtonClick(() => {

      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscPress);
    });

    switch (this._mode) {
      case ViewMode.DEFAULT:
        this._eventEditFormComponent = new EventEditFormComponent(event, this._mode, this._store);

        this._eventEditFormComponent.setOnFormSubmit((evt) => {
          evt.preventDefault();

          const newData = this._eventEditFormComponent.getData();
          this._onDataChange(this, event, newData);
        });

        this._eventEditFormComponent.setOnDeleteButtonClick(() => {
          this._onDataChange(this, event, null);
        });

        this._eventEditFormComponent.setOnCancelButtonClick(() => {
          this._replaceEditToEvent();
        });

        this._eventEditFormComponent.setOnFavoriteButtonClick(() => {
          // this._onDataChange(this, event, Object.assign({}, event, {
          //   isFavorite: !event.isFavorite,
          // }));
          const newPoint = PointModel.clone(event);
          newPoint.isFavorite = !newPoint.isFavorite;

          this._onDataChange(this, event, newPoint);

        });

        if (oldEventItemComponent && oldEventEditFormComponent) {
          replaceComponents(this._eventItemComponent, oldEventItemComponent);
          replaceComponents(this._eventEditFormComponent, oldEventEditFormComponent);
          this._replaceEditToEvent();
        } else {
          renderElement(this._container, this._eventItemComponent);
        }
        break;
      case ViewMode.ADD:
        this._eventEditFormComponent = new EventEditFormComponent(event, this._mode, this._store);

        this._eventEditFormComponent.setOnFormSubmit((evt) => {
          evt.preventDefault();

          const newData = this._eventEditFormComponent.getData();
          this._onDataChange(this, EmptyCard, newData);
        });

        this._eventEditFormComponent.setOnDeleteButtonClick(() => {
          this._onDataChange(this, EmptyCard, null);
        });

        if (oldEventItemComponent && oldEventEditFormComponent) {
          removeComponent(oldEventItemComponent);
          removeComponent(oldEventEditFormComponent);
          // this._replaceEditToEvent();
        } else {
          document.querySelector(`.trip-sort`).after(this._eventEditFormComponent.getElement());
        }
        break;
    }
  }

  setDefaultView() {
    // console.log(`setDefaultView`, this._mode)
    if (this._mode !== ViewMode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    removeComponent(this._eventItemComponent);
    removeComponent(this._eventEditFormComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replaceComponents(this._eventEditFormComponent, this._eventItemComponent);
    this._mode = ViewMode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscPress);

    this._eventEditFormComponent.reset();

    if (document.contains(this._eventEditFormComponent.getElement())) {
      replaceComponents(this._eventItemComponent, this._eventEditFormComponent);
    }

    this._mode = ViewMode.DEFAULT;
  }

  _onEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      // console.log('ESC_KEYCODE', ESC_KEYCODE);

      // if (this._mode === ViewMode.ADD) {
      //   this._onDataChange(this, EmptyCard, null);
      // }
      this._replaceEditToEvent();
    }
  }
}
