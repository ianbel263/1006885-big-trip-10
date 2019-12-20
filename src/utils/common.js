import {TripTypes} from '../const.js';
import moment from 'moment';

export const timeFormat = (date) => {
  return moment(date).format(`hh:mm`);
};

export const dateFormat = (date) => {
  return moment(date).format();
};

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

export const formatTripType = (tripType) => {
  let formattedTripType = ``;
  Object.keys(TripTypes).forEach((el) => {
    TripTypes[el].forEach((it) => {
      if (tripType === it && el === `ACTIVITY`) {
        formattedTripType = `${doFirstLetterUppercase(tripType)} in`;
      } else if (tripType === it && el === `TRANSFER`) {
        formattedTripType = `${doFirstLetterUppercase(tripType)} to`;
      } else if (tripType === `check-in`) {
        formattedTripType = `${doFirstLetterUppercase(tripType).slice(0, 5)} in`;
      }
    });
  });
  return formattedTripType;
};
