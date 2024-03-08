import { getLocationFromLocalStorage } from "$lib/helpers/location.js"

export const ssr = false

export async function load({ params, data, fetch }) {

  try {
    let resp

    const storageLoc = getLocationFromLocalStorage()
    if (storageLoc?.lat && storageLoc?.lon)
      resp = await fetch(`api/weather?lat-long=${storageLoc?.lat},${storageLoc?.lon}`)
    else
      resp = await fetch('/api/weather')
    const weatherData = await resp.json()

    return {
      ...data,
      ...weatherData,
      // latitude: coords?.latitude ?? weatherData?.location?.lat,
      // longitude: coords?.longitude ?? weatherData?.location?.lon
    }

  } catch (e) {
    return {
      ...data
    }
  }
}