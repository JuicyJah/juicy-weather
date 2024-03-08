export const ssr = false

function getLocationFromBrowserLocation() {
  return new Promise((resolve, reject) => {

    if ("geolocation" in navigator) {
      // check if geolocation is supported/enabled on current browser
      navigator.geolocation.getCurrentPosition(
        function success(position) {
          // for when getting location is a success
          console.log('latitude', position.coords.latitude,
            'longitude', position.coords.longitude);
          resolve(position?.coords)
        },
        function error(error_message) {
          // for when getting location results in an error
          console.error('An error has occured while retrievinglocation', error_message)
          resolve(null)
        }
      )
    } else {
      // geolocation is not supported
      // get your location some other way
      console.log('geolocation is not enabled on this browser')
      resolve(null)
    }
  })
}

export async function load({ params, data, fetch }) {
  let weatherData

  try {
    const coords = await getLocationFromBrowserLocation()
    let resp
    if (coords)
      resp = await fetch(`api/weather?lat-long=${coords?.latitude},${coords?.longitude}`)
    else
      resp = await fetch('/api/weather')
    weatherData = await resp.json()

    return {
      ...data,
      ...weatherData,
      latitude: coords?.latitude ?? weatherData?.location?.lat,
      longitude: coords?.longitude ?? weatherData?.location?.lon
    }

  } catch (e) {
    return {
      ...data
    }
  }
}