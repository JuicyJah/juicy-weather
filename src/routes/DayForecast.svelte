<script>
	import Temperature from '$lib/components/Temperature.svelte'
	export let date
	export let day

	let dateCopy = new Date(date)
	dateCopy = new Date(dateCopy.getUTCFullYear(), dateCopy.getUTCMonth(), dateCopy.getUTCDate())
	const today = new Date()
	const tomorrow = new Date()
	tomorrow.setDate(today.getDate() + 1)

	function isDayEqual(day1, day2) {
		return day1.setHours(0, 0, 0, 0) == day2.setHours(0, 0, 0, 0)
	}
</script>

<div class="flex justify-between bg-white border border-solid border-gray-300 rounded-lg p-4 my-2">
	<div class="w-1/3">
		{#if isDayEqual(dateCopy, today)}
			Today
		{:else if isDayEqual(dateCopy, tomorrow)}
			Tomorrow
		{:else}
			{new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateCopy)}
		{/if}
	</div>

	<div class="w-1/3 text-center">{day?.condition ?? ''}</div>
	<div class="w-1/3 text-right"><span class="mx-1"><Temperature temp={day.maxtemp} /></span>/<span class="mx-1"><Temperature temp={day.mintemp} /></span></div>
</div>
