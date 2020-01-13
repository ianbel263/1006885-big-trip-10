export const AUTHORIZATION = `Basic kdnwdfhgfhdskgffCKjkj-j`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

export const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const Store = {
  STORE_PREFIX: `big-trip-localstorage`,
  STORE_VER: `v1`,

  getStoreName(key) {
    return `${this.STORE_PREFIX}-${this.STORE_VER}-${key}`;
  }
};

export const StoreKey = {
  POINTS: `points`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`
};

export const HIDDEN_CLASS = `visually-hidden`;

export const SERVER_TIMEOUT = 15000;
export const SHAKE_ANIMATION_TIMEOUT = 600;
export const DEBOUNCE_TIMEOUT = 500;

export const DefaultButtonsText = {
  SAVE: `Save`,
  DELETE: `Delete`
};

export const ConnectingButtonsText = {
  SAVE: `Saving...`,
  DELETE: `Deleting...`
};

export const ESC_KEYCODE = 27;

export const TripType = {
  TRANSFER: [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  ACTIVITY: [`check-in`, `restaurant`, `sightseeing`]
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};
