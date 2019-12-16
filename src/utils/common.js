const castZeroFirstFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const castTimeFormat = (dateUnix) => {
  const date = new Date(dateUnix);

  const hours = castZeroFirstFormat(date.getHours());
  const minutes = castZeroFirstFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};

export const castDateFormat = (dateUnix) => {
  const date = new Date(dateUnix);

  const yyyy = date.getFullYear();
  const mm = castZeroFirstFormat(date.getMonth() + 1);
  const dd = castZeroFirstFormat(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDate = (dateUnix) => {
  const currentDate = new Date(dateUnix);

  const date = castZeroFirstFormat(currentDate.getDate());
  const month = castZeroFirstFormat(currentDate.getMonth() + 1);
  const year = castZeroFirstFormat(currentDate.getFullYear() % 100);
  const hours = castZeroFirstFormat(currentDate.getHours());
  const minutes = castZeroFirstFormat(currentDate.getMinutes());

  return `${date}/${month}/${year} ${hours}:${minutes}`;
};

export const calculateTimeInterval = (time1, time2) => {
  const daysInt = Math.floor((time2 - time1) / (1000 * 60 * 60 * 24));
  const hoursInt = Math.floor((time2 - time1) / (1000 * 60 * 60)) - daysInt * 24;
  const minutesInt = Math.floor((time2 - time1) / (1000 * 60)) - daysInt * 60 * 24 - hoursInt * 60;

  const formattedInt = `${daysInt > 0 ? castInterval(daysInt, `D`) : ``} ${hoursInt > 0 ? castInterval(hoursInt, `H`) : ``} ${castInterval(minutesInt, `M`)}`;
  return formattedInt;
};

const castInterval = (timeValue, unitOfTime) => timeValue < 10 ? `0${timeValue}${unitOfTime}` : `${timeValue}${unitOfTime}`;

export const doFirstLetterUppercase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
