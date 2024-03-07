<script>
	import Temperature from '$lib/components/Temperature.svelte'
	export let hours
</script>

<div class="my-4">
	<h2 class="text-xl px-1">Upcoming</h2>
	<div class="flex flex-row no-wrap max-w-full overflow-auto py-4">
		{#each hours as { temp, icon, time }}
			<div class="flex flex-col p-4 bg-white border border-slate-300 rounded-lg m-1 justify-between">
				<div class="text-center h-8">
					<Temperature {temp} />
				</div>
				<div class="text-center">
					<!-- %chance precipitation -->
				</div>
				<div class="text-center">
					<!-- icon -->
					<img src={icon} />
				</div>
				<div class="w-max text-center">
					<!-- time -->
					{new Intl.DateTimeFormat('en-US', { hour: 'numeric' }).format(new Date(time))}
				</div>
			</div>
		{/each}
	</div>
</div>
