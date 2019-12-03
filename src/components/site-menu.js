const createSiteMenuItem = (menuItem) => {
  const {name, isActive} = menuItem;
  return `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`;
};

export const createSiteMenuTemplate = (menuList) => {
  const menuItem = menuList.map((it) => createSiteMenuItem(it)).join(`\n`);

  return `<nav class="trip-controls__trip-tabs trip-tabs">
    ${menuItem}
  </nav>`;
};
