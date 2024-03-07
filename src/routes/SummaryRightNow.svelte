<script>
	import Temperature from '$lib/components/Temperature.svelte'
	export let current
	export let degree
</script>

<div class="flex justify-between text-2xl p-8 bg-white border border-slate-300 rounded-lg my-8">
	<div class="flex flex-col">
		<div>Now</div>
		<div class="text-7xl"><Temperature temp={current.temp} /></div>
		<div class="text-base pt-4">Feels like <Temperature temp={current.feels} /></div>
	</div>
	<div class="flex flex-col">
		<div class="text-xl">{current?.condition ?? ''}</div>
		{#if current.high && current.low}
			<div class="pt-8">
				<div class="text-lg flex justify-between"><span class="mr-1">High:</span><Temperature temp={current.high} /></div>
				<div class="text-lg flex justify-between"><span class="mr-1">Low:</span><Temperature temp={current.low} /></div>
			</div>
		{/if}
	</div>
</div>
