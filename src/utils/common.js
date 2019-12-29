import {TripType} from '../const.js';
import moment from 'moment';

export const formatTime = (date) => moment(date).format(`HH:mm`);

export const formatDateForDatetimeAttr = (date) => moment(date).format();

export const formatDateWithoutTime = (date) => moment(date).format(`YYYY MMM DD`);

export const formatDateForInfo = (date) => moment(date).format(`DD MMM`);

export const calculateTimeInterval = (time1, time2) => {
  const daysInt = moment(time2).diff(moment(time1), `days`);
  const hoursInt = moment(time2).diff(moment(time1), `hours`) - daysInt * 24;
  const minutesInt = moment(time2).diff(moment(time1), `minutes`) - daysInt * 60 * 24 - hoursInt * 60;

  const formattedInt = `${daysInt > 0 ? castInterval(daysInt, `D`) : ``} ${hoursInt > 0 ? castInterval(hoursInt, `H`) : ``} ${castInterval(minutesInt, `M`)}`;
  return formattedInt;
};

const castInterval = (timeValue, unitOfTime) => timeValue < 10 ? `0${timeValue}${unitOfTime}` : `${timeValue}${unitOfTime}`;

export const doFirstLetterUppercase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const parseDateWithoutTime = (dateString) => moment(dateString, `YYYY MMM DD`).valueOf();

export const convertPoint = (point, offersAll) => {
  return Object.assign({}, point, {offers: offersAll.get(point.type).map((offer) => {
    return {
      title: offer.title,
      price: offer.price,
      isChecked: point.offers.some((el) => offer.title === el.title)
    };
  })});
};

export const formatTripType = (tripType) => {
  let formattedTripType = ``;
  Object.keys(TripType).forEach((el) => {
    TripType[el].forEach((it) => {
      if (tripType === it && el === `TRANSFER`) {
        formattedTripType = `${doFirstLetterUppercase(tripType)} to`;
      } else if (tripType === `restaurant`) {
        formattedTripType = `${doFirstLetterUppercase(tripType)} in`;
      } else if (tripType === `check-in`) {
        formattedTripType = `${doFirstLetterUppercase(tripType).slice(0, 5)} into`;
      } else if (tripType === `sightseeing`) {
        formattedTripType = `${doFirstLetterUppercase(tripType)} at`;
      }
    });
  });
  return formattedTripType;
};

export const ViewMode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADD: `add`
};

export const EmptyCard = {
  type: ``,
  destination: {
    name: ``,
    description: ``,
    pictures: [{
      src: ``,
      description: ``
    }]
  },
  offers: [],
  startDate: Date.now(),
  endDate: Date.now(),
  price: 0,
  isFavorite: false
};
