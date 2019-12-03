const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatDate = (currentDate) => {
  const date = castTimeFormat(currentDate.getDate());
  const month = castTimeFormat(currentDate.getMonth() + 1);
  const year = castTimeFormat(currentDate.getFullYear() % 100);
  const hours = castTimeFormat(currentDate.getHours());
  const minutes = castTimeFormat(currentDate.getMinutes());

  return `${date}/${month}/${year} ${hours}:${minutes}`;
};

export const valueToMonth = {
  0: `JAN`,
  1: `FEB`,
  2: `MAR`,
  3: `APR`,
  4: `MAY`,
  5: `JUN`,
  6: `JUL`,
  7: `AUG`,
  8: `SEP`,
  9: `OCT`,
  10: `NOV`,
  11: `DEC`
};
