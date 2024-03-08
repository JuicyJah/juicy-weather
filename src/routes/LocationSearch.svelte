<script>
	import { createEventDispatcher } from 'svelte'
	import { enhance, applyAction } from '$app/forms'
	import debounce from 'debounce'
	import { getLocationFromBrowser } from '$lib/helpers/location.js'

	export let currentLocation

	const dispatch = createEventDispatcher()

	let searchInput, searchForm, data, focused

	function submitsearch({ formElement, formData, action, cancel, submitter }) {
		if (bounce) bounce.clear()

		if (selectIndex > -1 && data) {
			cancel()
			selectLocation(data[selectIndex])
		}

		return async ({ result, update }) => {
			data = result
			await applyAction(result)
		}
	}

	let bounce
	function onFormChange() {
		bounce = debounce((e) => {
			if (['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
				e.preventDefault()
			} else {
				searchForm.requestSubmit()
			}
		}, 1000)
		return bounce
	}

	let focusBounce
	function onFocus(e) {
		if (focusBounce) focusBounce.clear()
		focused = true
	}

	function onBlur() {
		focusBounce = debounce((e) => {
			focused = false
			selectIndex = -1
		}, 100)
		return focusBounce
	}

	function onFormBlur(e) {
		if (bounce) bounce.clear()
	}

	let selectIndex = -1
	function navigateList(e) {
		if (data?.length > 0 && e.key == 'ArrowDown' && selectIndex + 1 < data.length) {
			selectIndex = selectIndex + 1
		}

		if (data?.length > 0 && e.key == 'ArrowUp' && selectIndex > -1) {
			selectIndex = selectIndex - 1
		}
		e.preventDefault()
	}

	function onKeyDown(e) {
		if (['ArrowUp', 'ArrowDown'].includes(e.key)) navigateList(e)
	}

	function reset() {
		selectIndex = -1
		focused = false
		data = null
		searchInput.blur()
	}

	function selectLocation(loc) {
		searchInput.value = loc?.name && loc?.region ? `${loc.name}, ${loc.region}` : `${loc.lat}, ${loc.lon}`
		reset()
		dispatch('select', loc)
	}

	function formatLocation(loc) {
		return `${loc.name}, ${loc.region}, ${loc.country}`
	}

	async function askForCurrentLocation() {
		searchInput.value = 'Loading Current Position...'
		reset()
		const coords = await getLocationFromBrowser()
		if (coords) selectLocation({ lat: coords.latitude, lon: coords.longitude })
		else searchInput.value = formatLocation(currentLocation)
	}

	let showLocOption = false
	async function checkGeoPermissions() {
		const perm = await navigator.permissions.query({ name: 'geolocation' })
		showLocOption = ['granted', 'prompt'].includes(perm.state)
		return perm
	}
</script>

<div class="relative" on:focusin={onFocus} on:focusout={onBlur()}>
	<form method="POST" action="api/location/search" autocomplete="off" bind:this={searchForm} use:enhance={submitsearch}>
		<div class="field-input">
			<input
				class="w-full rounded-lg p-2 text-xl"
				class:rounded-b-none={(data || showLocOption) && focused}
				type="search"
				name="location"
				value={formatLocation(currentLocation)}
				bind:this={searchInput}
				on:keyup={onFormChange()}
				on:focusout={onFormBlur}
				on:keydown={onKeyDown} />
		</div>
	</form>

	{#if focused}
		<div class="absolute w-full z-10">
			<ul class="block bg-white w-full border border-slate-200 rounded-b" class:hidden={!data && !showLocOption}>
				{#await checkGeoPermissions() then permission}
					{#if ['granted', 'prompt'].includes(permission.state)}
						<button class="p-2 hover:bg-slate-200 w-full text-left text-md text-indigo-800" on:click={askForCurrentLocation}
							>Use Current Location<i class="ml-2 fa-solid fa-location-arrow"></i></button>
					{/if}
				{/await}
				{#if data}
					{#each data as option, i}
						<option class="p-4 hover:bg-slate-200 w-full text-left" class:bg-slate-200={selectIndex == i} on:click={() => selectLocation(option)}
							>{option.name}, {option.region}, {option.country}</option>
					{/each}
				{/if}
			</ul>
		</div>
	{/if}
</div>
