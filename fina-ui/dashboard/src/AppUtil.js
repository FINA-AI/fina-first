const domain = window.location.origin.includes("://localhost:")
  ? "http://localhost:9080"
  : window.location.origin;

export const BASE_REST_URL = `${domain}/fina/rest`;

export const getSafeFloatValue = (value) => {
  let result = 0;
  if (value && !isNaN(value) && isFinite(value)) {
    result = value;
  }
  return parseFloat(result);
};

export const yearlyCoefficient = (date) => {
  const dayInYear =
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
    24 /
    60 /
    60 /
    1000;

  return 365 / dayInYear;
};
