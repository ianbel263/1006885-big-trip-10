export const createSiteFilterTemplate = (filters) => {

  return (
    `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
    ${filters.map(({name, isChecked}) => {
      return (
        `<input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>`
      );
    }).join(`\n`)}
    </div>
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`);
};
