<script>
	import { settings } from '$lib/stores/settings.js'
	export let temp
	export let unit = false
</script>

<span>{Math.round(temp)}&deg;{unit ? ($settings.farenheight ? ' F' : ' C') : ''}</span>
