

import { error, json } from '@sveltejs/kit'

const API_BASE = 'http://api.weatherapi.com/v1/forecast.json?key=50876e1ec1154a23ae5214802242902'

async function getDataFromGPSOrCity(city, gps) {
  if (gps)
    return await fetch(`${API_BASE}&q=${gps}&days=3`)
  return fetch(`${API_BASE}&q=${city}&days=3`)
}

export const GET = async ({ url: { searchParams }, fetch }) => {
  let city = 'New York', gps = null

  if (searchParams.get("city"))
    city = searchParams.get("city")

  if (searchParams.get("lat-long"))
    gps = searchParams.get("lat-long")

  // TODO: cache responses

  try {
    const resp = await getDataFromGPSOrCity(city, gps)
    const data = await resp.json()

    return json(data)
  } catch (e) {

    error(500, 'Internal Error')
  }
}