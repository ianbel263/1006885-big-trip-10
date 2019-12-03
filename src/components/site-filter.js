const createFilterMarkup = (filter, isChecked) => {
  const {name} = filter;

  return (
    `<input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>`
  );
};

export const createSiteFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      ${filtersMarkup}
    </div>
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`);
};
