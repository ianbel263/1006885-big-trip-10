export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const renderElement = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

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
  const startDate = new Date(time1);
  const endDate = new Date(time2);

  const daysInt = Math.abs(endDate.getDay() - startDate.getDay());
  const hoursInt = Math.abs(endDate.getHours() - startDate.getHours());
  const minutesInt = Math.abs(endDate.getMinutes() - startDate.getMinutes());

  let formattedInt = daysInt > 0 ? castDateInterval(daysInt) : ``;
  if (daysInt > 0 || hoursInt > 0) {
    formattedInt += ` ${castHoursInterval(hoursInt)}`;
  }
  return formattedInt + ` ${castMinutesInterval(minutesInt)}`;
};

const castDateInterval = (days) => {
  return days < 10 ? `0${days}D` : `${days}D`;
};

const castHoursInterval = (hours) => {
  return hours < 10 ? `0${hours}H` : `${hours}H`;
};

const castMinutesInterval = (minutes) => {
  return minutes < 10 ? `0${minutes}M` : `${minutes}M`;
};
