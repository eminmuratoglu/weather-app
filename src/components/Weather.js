import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherIcon from "./WeatherIcon";
import { convertFahreneitToCelcius } from '../utils/utils'
import './Weather.scss';

const BASE_COORDINATES_API_URL = 'http://api.openweathermap.org/geo/1.0'
const BASE_WEATHER_API_URL = 'https://api.openweathermap.org/data/3.0/'
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY

const Weather = () => {
  const [zipCode, setZipCode] = useState('')
  const [zipCodeError, setZipCodeError] = useState(false)
  const [coordinates, setCoordinates] = useState({})
  const [weatherData, setWeatherData] = useState({})
  const [activeDegree, setActiveDegree] = useState('f')

  const getCoordinatesByZipCode = async () => {
    // We know that US zipcodes consist of 5 digits. If input is not 5 digits in the first place, we should avoid attempting to send the request for performance reasons.
    setZipCodeError(false)
    if (zipCode.length !== 5) setZipCodeError(true)
    else {
      try {
        const { data } = await axios.get(`${BASE_COORDINATES_API_URL}/zip?zip=${zipCode},US&appid=${API_KEY}`)
        console.log(data);
        setCoordinates(data);
        return data
      } catch (error) {
        console.log(error);
        setZipCodeError(true)
      }
    }
  }

  const getWeatherInfo = async (e) => {
    e.preventDefault()
    const coords = await getCoordinatesByZipCode()
    if (!coords) return
    try {
      const { data } = await axios.get(`${BASE_WEATHER_API_URL}onecall?lat=${coords?.lat}&lon=${coords?.lon}&units=imperial&exclude=hourly,minutely,daily&appid=${API_KEY}`)
      setWeatherData(data)
      console.log(data);
    } catch (error) {
      console.log(error)
    }
  }

  const onZipCodeInputChange = (e) => setZipCode(e.target.value)

  const onDegreeClick = (val) => setActiveDegree(activeDegree !== val ? val : activeDegree)

  return <main className='weather__container'>
    <div>
      <h1 className='mainHeader'>Weather App</h1>
      {/* <h5 style={{margin: '0 0 .3rem 0'}}>Enter your area's zipcode.</h5> */}
      <div className='input-items'>
        <input type='number' placeholder='Enter zipcode...' onChange={onZipCodeInputChange} />
        <button onClick={getWeatherInfo} type='submit'>Search</button>
      </div>
      {zipCodeError &&
        <small style={{ color: 'darkorange', display: 'block', marginTop: '0.3rem' }}>Please enter a valid US zipcode!</small>
      }
    </div>
    {!zipCodeError && <>
      <section className='currentWeather' style={{ marginTop: '1rem' }}>
        {
          Object.keys(weatherData).length > 0 &&
          <>
            {
              Object.keys(coordinates).length > 0 &&
              <div>
                Current weather in {coordinates?.name}
              </div>
            }
            <div className='currentWeather__coreInfo'>
              <WeatherIcon icon={weatherData.current.weather[0].icon} size='large' />
              <p style={{ margin: '0' }}>
                {
                  activeDegree === 'c' ? Math.round(convertFahreneitToCelcius(weatherData.current.temp)) :
                    Math.round(weatherData.current.temp)
                }
              </p>
              <div className='degree-letters'>
                <span>°</span>
                <span
                  onClick={() => onDegreeClick('f')}
                  className={`letter-f ${activeDegree === 'f' ? 'active' : ''}`}
                >F</span>
                <span>|</span>
                <span
                  onClick={() => onDegreeClick('c')}
                  className={`letter-f ${activeDegree === 'c' ? 'active' : ''}`}
                >C</span>
              </div>
              <div className='currentWeather__coreInfo-details'>
                <div>Humidity: {weatherData.current.humidity}%</div>
                <div>Cloudiness: {weatherData.current.clouds}%</div>
                <div>UV Index: {weatherData.current.uvi}</div>
              </div>
            </div>
            <p className='currentWeather__description'>{weatherData.current.weather[0].description}</p>
          </>
        }
      </section>
      <section className='dailyWeather'>

      </section>
    </>}
  </main>;
};

export default Weather;
