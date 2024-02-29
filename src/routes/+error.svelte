<script>
	import { page } from '$app/stores'
</script>

<main class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
	<div class="text-center">
		<h1 class="text-9xl font-bold text-indigo-600 dark:text-indigo-400">{$page.status}</h1>
		<p class="mt-4 text-5xl font-semibold tracking-tight text-gray-900 dark:text-slate-200 sm:text-5xl">{$page?.error?.message}</p>
	</div>
</main>
