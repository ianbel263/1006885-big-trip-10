import AppFilterComponent from '../components/app-filter.js';
import {renderElement, replaceComponents} from '../utils/render.js';
import {FilterType} from '../const.js';

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._siteFilterComponent = null;
    this._activeFilterType = FilterType.EVERYTHING;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setOnDataChange(this._onDataChange);
  }

  render() {
    const siteFilters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType
      };
    });

    const oldComponent = this._siteFilterComponent;

    this._siteFilterComponent = new AppFilterComponent(siteFilters);
    this._siteFilterComponent.setOnFilterChange(this._onFilterChange);

    if (oldComponent) {
      replaceComponents(this._siteFilterComponent, oldComponent);
    } else {
      renderElement(this._container, this._siteFilterComponent);
    }
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
