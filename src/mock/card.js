const CARDS_COUNT = 20;

const MAX_PHOTOS = 10;
const MIN_OFFERS = 0;
const MAX_OFFERS = 2;
const MAX_PRICE = 500;

const eventPointTypes = [
  {type: `bus`, isChecked: false, group: `Transfer`},
  {type: `check-in`, isChecked: false, group: `Activity`},
  {type: `drive`, isChecked: false, group: `Transfer`},
  {type: `flight`, isChecked: false, group: `Transfer`},
  {type: `restaurant`, isChecked: false, group: `Activity`},
  {type: `ship`, isChecked: false, group: `Transfer`},
  {type: `sightseeing`, isChecked: true, group: `Activity`},
  {type: `taxi`, isChecked: false, group: `Transfer`},
  {type: `train`, isChecked: false, group: `Transfer`},
  {type: `transport`, isChecked: false, group: `Transfer`},
  {type: `trip`, isChecked: false, group: `Transfer`}
];

const eventPointCities = [`Amsterdam`, `Berlin`, `Vienna`, `Paris`, `London`, `Barcelona`, `Madrid`, `Prague`];

const eventPointDescriptions = [`Dolore ut ut culpa ex dolor commodo elit quis dolor cillum exercitation magna ut.`, `Lorem ipsum duis sed laborum consectetur qui dolore adipisicing nisi quis.`, `Esse in ad ea consequat commodo dolore sunt magna esse labore commodo fugiat anim voluptate est sit ad velit.`, `Aliqua aute ullamco tempor nulla id excepteur adipisicing est consectetur ullamco commodo sit dolor proident occaecat.`, `Do ut esse occaecat laborum sed est velit laborum ut aute sed eu voluptate adipisicing dolore.`];

const eventPointOffers = [
  {type: `luggage`, title: `Add luggage`, price: 10, isChecked: Math.random() > 0.5},
  {type: `comfort`, title: `Switch to comfort class`, price: 150, isChecked: Math.random() > 0.5},
  {type: `meal`, title: `Add meal`, price: 2, isChecked: Math.random() > 0.5},
  {type: `seats`, title: `Choose seats`, price: 9, isChecked: Math.random() > 0.5},
  {type: `train`, title: `Travel by train`, price: 40, isChecked: Math.random() > 0.5}
];

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomDate = () => {
  return Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * getRandomNumber(0, 60) * 60 * 1000;
};

const getEventPhotosUrls = () => {
  return new Array(getRandomNumber(0, MAX_PHOTOS))
  .fill(``)
  .map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const generateOffers = (offers) => {
  offers.forEach((offer) => {
    offer.isChecked = Math.random() > 0.5;
  });

  return offers
    .filter(({isChecked}) => isChecked)
    .slice(MIN_OFFERS, MAX_OFFERS);
};

const generateCard = () => {
  const startDate = getRandomDate();
  const endDate = getRandomDate();
  return {
    type: getRandomArrayItem(eventPointTypes),
    destination: getRandomArrayItem(eventPointCities),
    description: getRandomArrayItem(eventPointDescriptions),
    photosUrls: getEventPhotosUrls(),
    offers: generateOffers(eventPointOffers),
    startDate: Math.min(startDate, endDate),
    endDate: Math.max(startDate, endDate),
    price: getRandomNumber(0, MAX_PRICE)
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

const cards = generateCards(CARDS_COUNT);

const sortCardsByStartDate = (events) => {
  return events.slice().sort((a, b) => a.startDate - b.startDate);
};

const sortedCardsByDate = sortCardsByStartDate(cards);

export {cards, eventPointTypes, eventPointCities, sortedCardsByDate};
