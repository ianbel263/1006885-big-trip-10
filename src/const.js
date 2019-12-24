export const AUTHORIZATION = `Basic dXedNlckBwYejiejiXNzd29yZAo=`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

export const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const ESC_KEYCODE = 27;

export const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`]; // убрать потом

export const TripType = {
  TRANSFER: [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`, `trip`],
  ACTIVITY: [`check-in`, `restaurant`, `sightseeing`]
};

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};
