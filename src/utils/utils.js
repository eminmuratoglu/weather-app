export const convertFahreneitToCelcius = (deg) => {
  // Formula = (32°F − 32) × 5/9 = 0°C
  return (deg - 32) * 5 / 9;
};
