import AppFilterComponent from '../components/app-filter.js';
import {renderElement, replaceComponents} from '../utils/render.js';
import {FilterType} from '../const.js';

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._appFilterComponent = null;
    this._activeFilterType = FilterType.EVERYTHING;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setOnDataChange(this._onDataChange);
  }

  render() {
    const appFilters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType
      };
    });

    const oldComponent = this._appFilterComponent;

    this._appFilterComponent = new AppFilterComponent(appFilters);
    this._appFilterComponent.setOnFilterChange(this._onFilterChange);

    if (oldComponent) {
      replaceComponents(this._appFilterComponent, oldComponent);
    } else {
      renderElement(this._container, this._appFilterComponent);
    }
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
