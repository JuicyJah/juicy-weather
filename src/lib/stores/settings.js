import { writable, get } from "svelte/store"

const darkModeEnabled = typeof localStorage != "undefined" ? (localStorage?.theme == "dark" || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) : false

const store = writable({
  darkMode: !!darkModeEnabled
})

function toggleDarkMode() {
  if (!localStorage) return
  const isDark = !get(store).darkMode
  localStorage.theme = isDark ? "dark" : "light"
  store.update(s => {
    s.darkMode = isDark
    return s
  })

  if (document?.documentElement) {
    if (isDark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }
}

export const settings = {
  ...store,
  toggleDarkMode
}