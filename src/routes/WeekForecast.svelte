<script>
	import DayForecast from './DayForecast.svelte'
	export let forecast
</script>

<div class="my-4">
	<h2 class="text-xl px-1 dark:text-slate-200">This Week</h2>
	{#each forecast as { date, ...day }}
		<DayForecast {date} {day} />
	{/each}
</div>
