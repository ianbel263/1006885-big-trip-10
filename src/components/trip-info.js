const valueToMonth = {
  0: `JAN`,
  1: `FEB`,
  2: `MAR`,
  3: `APR`,
  4: `MAY`,
  5: `JUN`,
  6: `JUL`,
  7: `AUG`,
  8: `SEP`,
  9: `OCT`,
  10: `NOV`,
  11: `DEC`
};

export const createTripInfoTemplate = (cards) => {
  const sortedCards = cards
    .slice()
    .sort((a, b) => {
      return a.endDate - b.endDate;
    });

  const startRouteDate = sortedCards[0].startDate;
  const endRouteDate = sortedCards[sortedCards.length - 1].startDate;

  const routeTemplate = sortedCards.length <= 3 ? sortedCards
    .map((card) => {
      const {destination} = card;
      return destination;
    })
    .join(` &mdash; `) : `${sortedCards[0].destination} &mdash; ... &mdash; ${sortedCards[sortedCards.length - 1].destination}`;


  return `<div class="trip-info__main">
      <h1 class="trip-info__title">${routeTemplate}</h1>
      <p class="trip-info__dates">${startRouteDate.getDate()}&nbsp;${valueToMonth[startRouteDate.getMonth()]}&nbsp;&mdash;&nbsp;${endRouteDate.getDate()}&nbsp;${valueToMonth[endRouteDate.getMonth()]}</p>
    </div>`;
};
