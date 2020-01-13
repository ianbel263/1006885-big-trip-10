import AbstractComponent from './abstract-component.js';
import {doFirstLetterUppercase} from '../utils/common.js';

export default class AppMenu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs trip-tabs">
      ${this._menuItems.map(({name, isActive}) => {
        return `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" data-menu-item="${name}" href="#">${doFirstLetterUppercase(name)}</a>`;
      }).join(`\n`)}
      </nav>`
    );
  }

  setDefault() {
    const menuItems = this.getElement().querySelectorAll(`a`);
    menuItems[0].classList.add(`trip-tabs__btn--active`);
    menuItems[1].classList.remove(`trip-tabs__btn--active`);
  }

  setOnMenuChange(handler) {
    const appMenu = this.getElement();
    appMenu.addEventListener(`click`, ((evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const menuItems = appMenu.querySelectorAll(`a`);
      menuItems.forEach((item) => item.classList.remove(`trip-tabs__btn--active`));
      const currentMenuItem = [...menuItems].find((item) => item.dataset.menuItem === evt.target.dataset.menuItem);
      currentMenuItem.classList.add(`trip-tabs__btn--active`);

      handler(evt.target.dataset.menuItem);
    }));
  }
}
