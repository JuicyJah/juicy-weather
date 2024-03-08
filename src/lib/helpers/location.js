export function getLocationFromBrowser() {
  return new Promise((resolve, reject) => {

    if ("geolocation" in navigator) {
      // check if geolocation is supported/enabled on current browser
      navigator.geolocation.getCurrentPosition(
        function success(position) {
          // for when getting location is a success
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

const STORAGE_LOCATION_ID = "weather.juicyjah.com:location"
export function getLocationFromLocalStorage() {
  if (!localStorage) return
  return JSON.parse(localStorage.getItem(STORAGE_LOCATION_ID))
}

export function setLocationInLocalStorage(loc) {
  if (!localStorage) return
  localStorage.setItem(STORAGE_LOCATION_ID, JSON.stringify(loc))
}