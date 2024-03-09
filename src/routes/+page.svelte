<script>
	import { settings } from '$lib/stores/settings.js'
	import weather from '$lib/stores/weather.js'
	import { setLocationInLocalStorage } from '$lib/helpers/location.js'
	import WeekForecast from './WeekForecast.svelte'
	import SummaryRightNow from './SummaryRightNow.svelte'
	import HourlyForecast from './HourlyForecast.svelte'
	import LocationSearch from './LocationSearch.svelte'

	export let data

	let errors, loading

	// $: console.log('weather data', data)
	$: weather.set(data)
	// $: console.log('weather store', $weather)

	async function search(e) {
		const loc = e.detail
		try {
			loading = true
			const resp = await fetch(`api/weather?lat-long=${loc?.lat},${loc?.lon}`)
			data = await resp.json()

			if (data?.location) setLocationInLocalStorage(data.location)
		} catch (e) {
			errors = e
			console.log('errors while searching for weather', e)
		} finally {
			loading = false
		}
	}
</script>

<div class="container max-w-xl mx-auto px-2">
	<div class="py-4">
		<LocationSearch on:select={search} currentLocation={$weather.location} />
	</div>
	<div class="flex justify-end pt-2">
		<label class="inline-flex items-center cursor-pointer">
			<span class="me-2 text-sm font-medium text-gray-900 dark:text-gray-300">&deg; C</span>
			<input type="checkbox" bind:checked={$settings.farenheight} class="sr-only peer" />
			<div
				class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
			</div>
			<span class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">&deg; F</span>
		</label>
	</div>

	{#if loading}
		<div class="dark:text-slate-200">Loading Weather...</div>
	{:else if data}
		<SummaryRightNow current={$weather.current} degree={$weather.degree} />

		<HourlyForecast hours={$weather.current.hourly} />

		{#if location}
			<WeekForecast forecast={$weather.forecast} />
		{/if}
	{:else}
		<div class="dark:text-slate-200">No Weather Data Found</div>
	{/if}
</div>
