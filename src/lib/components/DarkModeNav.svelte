<script>
	import { settings } from '$lib/stores/settings.js'

	function toggleDarkMode() {
		settings.toggleDarkMode()
	}
</script>

<div class="w-full pt-4 pr-4 md:p-8 pb-12">
	<button class="relative float-right text-3xl dark:text-slate-200 z-10" on:click={toggleDarkMode}>
		{#if $settings.darkMode}
			<i class="fa-regular fa-lightbulb"></i>
		{:else}
			<i class="fa-regular fa-moon"></i>
		{/if}
	</button>
</div>
