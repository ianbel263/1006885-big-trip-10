import {ESC_KEYCODE, ConnectingButtonsText, SHAKE_ANIMATION_TIMEOUT} from '../const.js';
import PointModel from '../models/point-model';
import PointItemComponent from '../components/point-item.js';
import PointEditComponent from '../components/point-edit.js';
import {renderElement, replaceComponents, removeComponent} from '../utils/render.js';
import {ViewMode, EmptyCard} from '../utils/common.js';

export default class PointController {
  constructor(container, onDataChange, onViewChange, store) {
    this._container = container;

    this._point = {};
    this._mode = ViewMode.DEFAULT;

    this._store = store;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._pointItemComponent = null;
    this._pointEditComponent = null;

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
  }

  render(point, mode) {
    this._point = point;
    this._mode = mode;

    const oldPointItemComponent = this._pointItemComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointItemComponent = new PointItemComponent(point, this._mode);
    this._pointEditComponent = new PointEditComponent(point, this._mode, this._store);

    this._pointItemComponent.setOnEditButtonClick(() => {
      this._replaceItemToEdit();
      document.addEventListener(`keydown`, this._onEscPress);
    });

    this._pointEditComponent.setOnFormSubmit((evt) => {
      this._onFormSubmit(evt, this._mode);
    });

    this._pointEditComponent.setOnDeleteButtonClick(() => {
      this._onDeleteButtonClick(this._mode);
    });

    switch (this._mode) {
      case ViewMode.DEFAULT:
        this._pointEditComponent.setOnCancelButtonClick(() => this._replaceEditToItem());

        this._pointEditComponent.setOnFavoriteButtonClick(() => {
          const newPoint = PointModel.clone(point);
          newPoint.isFavorite = !newPoint.isFavorite;
          this._onDataChange(this, point, newPoint);
        });

        if (oldPointItemComponent && oldPointEditComponent) {
          replaceComponents(this._pointItemComponent, oldPointItemComponent);
          replaceComponents(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToItem();
        } else {
          renderElement(this._container, this._pointItemComponent);
        }
        break;

      case ViewMode.ADD:
        document.addEventListener(`keydown`, this._onEscPress);
        const tripSortElement = document.querySelector(`.trip-sort`);
        if (tripSortElement) {
          document.querySelector(`.trip-sort`).after(this._pointEditComponent.getElement());
        } else {
          renderElement(this._container, this._pointEditComponent);
        }
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== ViewMode.DEFAULT) {
      this._replaceEditToItem();
    }
  }

  destroy() {
    removeComponent(this._pointItemComponent);
    removeComponent(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onFormSubmit(evt, mode) {
    evt.preventDefault();
    this._pointEditComponent.setButtonsText(`save`, ConnectingButtonsText.SAVE);
    const newData = this._pointEditComponent.getData();
    if (mode === ViewMode.ADD) {
      this._onDataChange(this, EmptyCard, newData);
    } else {
      this._onDataChange(this, this._point, newData);
    }
  }

  _onDeleteButtonClick(mode) {
    if (mode === ViewMode.ADD) {
      this._onDataChange(this, EmptyCard, null);
    } else {
      this._pointEditComponent.setButtonsText(`delete`, ConnectingButtonsText.DELETE);
      this._onDataChange(this, this._point, null);
    }
  }

  _replaceItemToEdit() {
    this._onViewChange();

    replaceComponents(this._pointEditComponent, this._pointItemComponent);
    this._mode = ViewMode.EDIT;
  }

  _replaceEditToItem() {
    document.removeEventListener(`keydown`, this._onEscPress);
    this._pointEditComponent.reset();
    if (this._mode === ViewMode.ADD) {
      this._onDataChange(this, EmptyCard, null);
    } else if (document.contains(this._pointEditComponent.getElement())) {
      replaceComponents(this._pointItemComponent, this._pointEditComponent);
    }
    this._mode = ViewMode.DEFAULT;
  }

  _onEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      this._replaceEditToItem();
    }
  }

  shake() {
    this._pointEditComponent.blockElement();

    setTimeout(() => {
      this._pointEditComponent.setDefaultButtonsText();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
