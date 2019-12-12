import {EVENT_POINT_TYPES} from '../const.js';

const CARDS_COUNT = 10;

const MAX_PHOTOS = 10;
const MIN_OFFERS = 0;
const MAX_OFFERS = 2;
const MAX_PRICE = 500;

const eventPointCities = [`Amsterdam`, `Berlin`, `Vienna`, `Paris`, `London`, `Barcelona`, `Madrid`, `Prague`];

const eventPointDescriptions = [`Dolore ut ut culpa ex dolor commodo elit quis dolor cillum exercitation magna ut.`, `Lorem ipsum duis sed laborum consectetur qui dolore adipisicing nisi quis.`, `Esse in ad ea consequat commodo dolore sunt magna esse labore commodo fugiat anim voluptate est sit ad velit.`, `Aliqua aute ullamco tempor nulla id excepteur adipisicing est consectetur ullamco commodo sit dolor proident occaecat.`, `Do ut esse occaecat laborum sed est velit laborum ut aute sed eu voluptate adipisicing dolore.`];

const eventPointOffers = [
  {type: `luggage`, title: `Add luggage`, price: 10, isChecked: false},
  {type: `comfort`, title: `Switch to comfort class`, price: 150, isChecked: false},
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

const getRandomDate = () => {
  return Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * getRandomNumber(0, 60) * 60 * 1000;
};

const getEventPhotosUrls = () => {
  return new Array(getRandomNumber(0, MAX_PHOTOS))
  .fill(``)
  .map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const generateOffers = (offers) => {
  const newOffers = JSON.parse(JSON.stringify(offers));
  newOffers
    .forEach((el) => {
      el.isChecked = Math.random() > 0.5;
    });

  return newOffers
    .filter((offer) => offer.isChecked)
    .slice(MIN_OFFERS, MAX_OFFERS);
};

const generateCard = () => {
  const startDate = getRandomDate();
  const endDate = getRandomDate();
  return {
    type: getRandomArrayItem(EVENT_POINT_TYPES),
    destination: getRandomArrayItem(eventPointCities),
    description: getRandomArrayItem(eventPointDescriptions),
    photosUrls: getEventPhotosUrls(),
    offers: generateOffers(eventPointOffers),
    startDate: Math.min(startDate, endDate),
    endDate: Math.max(startDate, endDate),
    price: getRandomNumber(0, MAX_PRICE),
    isFavorite: Math.random() > 0.5
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard)
    .sort((a, b) => a.startDate - b.startDate);
};

const cards = generateCards(CARDS_COUNT);

const uniqueDates = new Set(cards.map((card) => new Date(card.startDate).toDateString()));

const destinations = new Set(cards.map(({destination}) => destination));

export {cards, eventPointCities, uniqueDates, destinations};
