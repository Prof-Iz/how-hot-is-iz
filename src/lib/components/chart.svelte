<script>
	import { onMount } from 'svelte';

	export let options;

	options = options;

	let ApexCharts;
	let loaded = false;
	let chart;

	function remakeChart(options) {
		chart = (node, options) => {
			if (!loaded) return;

			let myChart = new ApexCharts(node, options);
			myChart.render();

			return {
				update(options) {
					myChart.updateOptions(options);
				},
				destroy() {
					myChart.destroy();
				}
			};
		};
	}

	$: remakeChart(options);

	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		window.ApexCharts = ApexCharts;
		loaded = true;
	});
</script>

{#if loaded}
	<div use:chart={options} />
{/if}
