const CARDS_COUNT = 10;

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

export const eventPointCities = [`Amsterdam`, `Berlin`, `Vienna`, `Paris`, `London`, `Barcelona`, `Madrid`, `Prague`];

const eventPointDescriptions = [`Dolore ut ut culpa ex dolor commodo elit quis dolor cillum exercitation magna ut.`, `Lorem ipsum duis sed laborum consectetur qui dolore adipisicing nisi quis.`, `Esse in ad ea consequat commodo dolore sunt magna esse labore commodo fugiat anim voluptate est sit ad velit.`, `Aliqua aute ullamco tempor nulla id excepteur adipisicing est consectetur ullamco commodo sit dolor proident occaecat.`, `Do ut esse occaecat laborum sed est velit laborum ut aute sed eu voluptate adipisicing dolore.`];

const eventPointOffers = [
  {type: `luggage`, title: `Add luggage`, price: 10, isChecked: true},
  {type: `comfort`, title: `Switch to comfort class`, price: 150, isChecked: true},
  {type: `meal`, title: `Add meal`, price: 2, isChecked: false},
  {type: `seats`, title: `Choose seats`, price: 9, isChecked: false},
  {type: `train`, title: `Travel by train`, price: 40, isChecked: false}
];

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomEventTime = () => {
  const date = new Date();
  date.setFullYear(getRandomNumber(2019, 2021), getRandomNumber(0, 11), getRandomNumber(1, 31));
  date.setHours(getRandomNumber(0, 23), getRandomNumber(0, 59));

  return date;
};

const getEventPhotosUrls = () => {
  return new Array(getRandomNumber(0, MAX_PHOTOS))
  .fill(``)
  .map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const generateOffers = (offers) => {
  return offers
    .filter(() => Math.random() > 0.5)
    .slice(MIN_OFFERS, MAX_OFFERS);
};

const generateCard = () => {
  return {
    type: getRandomArrayItem(eventPointTypes),
    destination: getRandomArrayItem(eventPointCities),
    description: getRandomArrayItem(eventPointDescriptions),
    photosUrls: getEventPhotosUrls(),
    offers: generateOffers(eventPointOffers),
    startDate: getRandomEventTime(),
    endDate: getRandomEventTime(),
    price: getRandomNumber(0, MAX_PRICE)
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

const cards = generateCards(CARDS_COUNT);

export {cards};
