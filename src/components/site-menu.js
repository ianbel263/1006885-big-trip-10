import AbstractComponent from './abstract-component.js';

export default class SiteMenu extends AbstractComponent {
  constructor(menuList) {
    super();
    this._menuList = menuList;
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs trip-tabs">
      ${this._menuList.map(({name, isActive}) => {
        return `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`;
      }).join(`\n`)}
      </nav>`
    );
  }
}
