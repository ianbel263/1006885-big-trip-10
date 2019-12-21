import {siteFilters} from '../mock/site-filter.js';
import SiteFilterComponent from '../components/site-filter.js';
import {renderElement} from '../utils/render.js';
import {FilterType} from '../const.js';

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._siteFilterComponent = null;
    this._activeFilterType = FilterType.EVERYTHING;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    this._siteFilterComponent = new SiteFilterComponent(siteFilters);
    this._siteFilterComponent.setOnFilterChange(this._onFilterChange);

    renderElement(this._container, this._siteFilterComponent);
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
