const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatDate = (currentDate) => {
  const date = castTimeFormat(currentDate.getDate());
  const month = castTimeFormat(currentDate.getMonth() + 1);
  const year = currentDate.getFullYear() - 2000;
  const hours = castTimeFormat(currentDate.getHours());
  const minutes = castTimeFormat(currentDate.getMinutes());

  return `${date}/${month}/${year} ${hours}:${minutes}`;
};
