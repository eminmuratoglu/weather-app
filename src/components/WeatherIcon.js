import React from "react";

const BASE_ICON_URL = 'https://openweathermap.org/img/wn'

const WeatherIcon = ({ icon, size }) => {
  return <img src={`${BASE_ICON_URL}/${icon}${size === 'large' ? '@2x.png' : '.png'}`} alt='weather icon' />
};

export default WeatherIcon;
