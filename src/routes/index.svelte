<script context="module">
	export const load = async ({ fetch }) => {
		const res = await fetch(
			'https://api.thingspeak.com/channels/1674983/feeds.json?api_key=1HFCHQH0JULE0E98&results=8000'
		);
		const data = await res.json();

		return {
			props: {
				data
			}
		};
	};
</script>

<script>
	import { writable } from 'svelte/store';
	export let data;
	import Hero from '$lib/components/Hero.svelte';
	import Chart from '$lib/components/chart.svelte';
	let options;
	let temp_dic;

	let data_temp = writable([]);
	let data_humidity = writable([]);
	let num_samples_base = writable(data.channel.last_entry_id);

	function formatDate(date) {
		let d = new Date(date);
		return d.toLocaleString();
	}

	async function refetchData() {
		const original_feed = await fetch(
			'https://api.thingspeak.com/channels/1674983/feeds.json?api_key=1HFCHQH0JULE0E98&results=1'
		);

		let original_feed_json = await original_feed.json();
		num_samples_base.set(original_feed_json.channel.last_entry_id);

		temp_dic = {};
		if (original_feed_json['feeds'][0].field1 != null) {
			temp_dic = {
				// y: data['feeds'][0].field1,
				y: original_feed_json['feeds'][0].field1,
				x: formatDate(original_feed_json['feeds'][0].created_at)
			};
			data_temp.update((n) => {
				n.push(temp_dic);
				return n;
			});
		}

		temp_dic = {};
		if (original_feed_json['feeds'][0].field2 != null) {
			temp_dic = {
				y: original_feed_json['feeds'][0].field2,
				x: formatDate(original_feed_json['feeds'][0].created_at)
			};

			data_humidity.update((n) => {
				n.push(temp_dic);
				return n;
			});
		}
	}

	let reload = setInterval(refetchData, 30000);

	for (let i = 0; i < data['feeds'].length; i++) {
		temp_dic = {};
		if (data['feeds'][i].field1 != null) {
			let temp_dic = {
				y: data['feeds'][i].field1,
				x: formatDate(data['feeds'][i].created_at)
			};
			data_temp.update((n) => {
				n.push(temp_dic);
				return n;
			});
		}
		temp_dic = {};
		if (data['feeds'][i].field2 != null) {
			let temp_dic = {
				y: data['feeds'][i].field2,
				x: formatDate(data['feeds'][i].created_at)
			};
			data_humidity.update((n) => {
				n.push(temp_dic);
				return n;
			});
		}
	}

	$: options = {
		chart: {
			type: 'line',
			background: 'bg-base-200'
		},
		series: [
			{
				name: 'Temperature',
				data: $data_temp
			},
			{
				name: 'Humidity',
				data: $data_humidity
			}
		],
		xaxis: {
			type: 'datetime',
			labels: {
				datetimeUTC: false
			}
		},
		yaxis: [
			{
				title: {
					text: 'Temperature °C'
				}
			},
			{
				opposite: true,
				title: {
					text: 'Humidity %'
				}
			}
		],
		theme: {
			mode: 'dark'
		}
	};
</script>

<Hero
	img_url={'iz_mlm.png'}
	main_text={'This is Iz'}
	body_text={'A Data communication student of group 4. Looking kinda chill there.'}
/>

<Hero
	img_url={'iz_room.jpg'}
	main_text={'Iz lives in a small room in an apartment'}
	body_text={'He eats, sleeps, repeats there. So its important that he has a good time there.\
	But theres a problem.'}
/>

<Hero
	img_url={'iz_noventilation.jpg'}
	main_text={'The ventilation in his room  is not good'}
	body_text={'So we set out to make our IoT Project Related to his comfort'}
/>

<div class="md:px-10 px-3 grid grid-cols-1 md:grid-cols-2 bg-base-200">
	<div class="flex flex-col ">
		<h1 class="text-5xl  bold mb-2"><b>Temperature and Humidity Measurements</b></h1>
		<p class="mb-2">
			Temperature and humidity measurements were taken from a <b>DHT 11</b>
			sensor at interval of 30 seconds for the past few days. The data was uploaded to a Thingspeak channel
			for the group to analyse later.
		</p>
		<div class="stats shadow w-max">
			<div class="stat">
				<div class="stat-title">Total Sampled Points</div>
				<div class="stat-value">{$num_samples_base}</div>
				<div class="stat-desc">every 30s</div>
			</div>
		</div>
	</div>
	<Chart {options} />
</div>
