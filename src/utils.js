const castZeroFirstFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const castTimeFormat = (date) => {
  const hours = castZeroFirstFormat(date.getHours());
  const minutes = castZeroFirstFormat(date.getMinutes());
  return `${hours}: ${minutes}`;
};


export const castDateFormat = (date) => {
  let yyyy = date.getFullYear();
  let mm = castZeroFirstFormat(date.getMonth() + 1);
  let dd = castZeroFirstFormat(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDate = (currentDate) => {
  const date = castZeroFirstFormat(currentDate.getDate());
  const month = castZeroFirstFormat(currentDate.getMonth() + 1);
  const year = castZeroFirstFormat(currentDate.getFullYear() % 100);
  const hours = castZeroFirstFormat(currentDate.getHours());
  const minutes = castZeroFirstFormat(currentDate.getMinutes());

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
