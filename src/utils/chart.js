export const Utils = {};

/**
 * count:
 */
Utils.month = function (options) {
  const count = options?.count ?? 12;
  if (count > 12) throw new Error("month should not bigger than 12");
  const abbreviation = options?.abbreviation ?? true;

  const data = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var result = [...data];

  result = result.map((e) => e.slice(0, 3));
  if (count !== 12) {
    result = result.slice(0, count);
  }

  return result;
};

Utils.hours = function (options) {
  const count = options?.count ?? 24;
  const start = (options?.start ?? 1) - 1;

  const data = Array.from({ length: count }, (_, i) => ((i + start) % 24) + 1);

  return data;
};

Utils.week = function (options) {};

Utils.year = function (options) {};

Utils.number = function (options) {
  const count = options?.count ?? 12;
  const random = options?.random ?? false;
  console.log(random);

  var result = [];
  if (!random) result = Array.from({ length: count }, (_, i) => i + 1);
  else
    result = Array.from({ length: count }, (_, i) =>
      Math.ceil(Math.random().toFixed(2) * 100),
    );
  return result;
};
