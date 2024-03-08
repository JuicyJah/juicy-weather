import { writable, derived } from "svelte/store"
import { settings } from "$lib/stores/settings.js"

const _weatherData = writable({})

function formatCondition(condition) {
  return condition.text.trim()
}

function formatCurrentWeather(weather, forecast, isFaren) {
  if (!weather) return null
  return {
    ...weather,
    condition: formatCondition(weather.condition),
    icon: weather.condition.icon,
    feels: isFaren ? weather.feelslike_f : weather.feelslike_c,
    temp: isFaren ? weather.temp_f : weather.temp_c,
    high: forecast?.at(0)?.maxtemp,
    low: forecast?.at(0)?.mintemp
  }
}

function formatDay(day, isFaren) {
  if (!day) return null
  return {
    ...day,
    condition: formatCondition(day.condition),
    icon: day.condition.icon,
    avgtemp: isFaren ? day.avgtemp_f : day.avgtemp_c,
    maxtemp: isFaren ? day.maxtemp_f : day.maxtemp_c,
    mintemp: isFaren ? day.mintemp_f : day.mintemp_c
  }
}

function formatForecast(forecast, isFaren) {
  if (!forecast) return null
  return {
    ...forecast,
    condition: formatCondition(forecast.condition),
    icon: forecast.condition.icon,
    feels: isFaren ? forecast.feelslike_f : forecast.feelslike_c,
    temp: isFaren ? forecast.temp_f : forecast.temp_c
  }
}

function forecastMap(forecast, isFaren) {
  if (!forecast) return null
  return forecast.map(x => {
    const day = {
      ...x,
      ...formatDay(x?.day, isFaren)
    }
    day.hour = day.hour.map(h => {
      return formatForecast(h, isFaren)
    })

    return day
  })
}

function formatHourlyToday(today, tomorrow) {
  if (!today || !tomorrow) return []
  const now = new Date()
  const time = now.getHours()
  const hours1 = today.filter(x => new Date(x.time).getHours() > time)
  const hours2 = tomorrow.filter(x => new Date(x.time).getHours() <= time)
  return [...hours1, ...hours2]
}

const weather = derived([settings, _weatherData], ([$settings, $weather], set, update) => {
  const forecast = forecastMap($weather?.forecast?.forecastday, $settings.farenheight)
  const current = formatCurrentWeather($weather?.current, forecast, $settings.farenheight)
  const hourlyToday = formatHourlyToday(forecast?.at(0)?.hour, forecast?.at(1)?.hour)

  set({
    degree: $settings.farenheight ? "\xB0 F" : "\xB0 C",
    location: $weather?.location,
    forecast,
    current: { ...current, hourly: hourlyToday }
  })
}, {})

export default {
  set: _weatherData.set,
  update: _weatherData.update,
  subscribe: weather.subscribe
}