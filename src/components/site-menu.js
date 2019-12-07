import AbstractComponent from './abstract-component.js';

const createSiteMenuTemplate = (menuList) => {

  return (
    `<nav class="trip-controls__trip-tabs trip-tabs">
    ${menuList.map(({name, isActive}) => {
      return `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`;
    }).join(`\n`)}
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor(menuList) {
    super();
    this._menuList = menuList;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuList);
  }
}
