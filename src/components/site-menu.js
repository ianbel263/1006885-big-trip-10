import {createElement} from '../utils.js';

const createSiteMenuTemplate = (menuList) => {

  return (
    `<nav class="trip-controls__trip-tabs trip-tabs">
    ${menuList.map(({name, isActive}) => {
      return `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`;
    }).join(`\n`)}
    </nav>`
  );
};

export default class SiteMenu {
  constructor(menuList) {
    this._menuList = menuList;
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuList);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
