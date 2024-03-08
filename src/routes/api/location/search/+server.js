

import { error, json } from '@sveltejs/kit'

const API_BASE = 'http://api.weatherapi.com/v1/search.json?key=50876e1ec1154a23ae5214802242902'

async function getDataFromLocation(city) {
  return fetch(`${API_BASE}&q=${city}`)
}

export const POST = async ({ request }) => {
  const form = await request.formData()
  let loc = 'New York'

  if (form.get("location"))
    loc = form.get("location")

  // TODO: cache responses

  try {
    const resp = await getDataFromLocation(loc)
    const data = await resp.json()

    return json(data)
  } catch (e) {

    error(500, 'Internal Error')
  }
}