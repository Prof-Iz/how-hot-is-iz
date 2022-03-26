<script context="module">
	export const load = async ({ fetch }) => {
		const result_base = await fetch(
			'https://api.thingspeak.com/channels/1674983/feeds.json?api_key=1HFCHQH0JULE0E98&start=2022-03-15%2000:00:00&timescale=daily&round=1'
			// 'https://api.thingspeak.com/channels/1674983/feeds.json?api_key=1HFCHQH0JULE0E98&results=8000&round=1'
		);
		const result_base_json = await result_base.json();

		const result_std_daily = await fetch(
			'https://api.thingspeak.com/channels/1674989/fields/3.json?api_key=DJT93QMW2XQHOANG&timescale=1440&start=2022-03-15%2000:00:00&timezone=Asia%2FKuala_Lumpur&round=1'
		);

		const result_std_daily_json = await result_std_daily.json();

		const result_hi_hourly = await fetch(
			'https://api.thingspeak.com/channels/1674989/fields/1.json?api_key=DJT93QMW2XQHOANG&timescale=60&timezone=Asia%2FKuala_Lumpur&round=1'
		);

		const result_hi_hourly_json = await result_hi_hourly.json();

		return {
			props: {
				result_base_json,
				result_std_daily_json,
				result_hi_hourly_json
			}
		};
	};
</script>

<script>
	import { writable } from 'svelte/store';
	export let result_base_json, result_std_daily_json, result_hi_hourly_json;

	import Hero from '$lib/components/Hero.svelte';
	import Chart from '$lib/components/chart.svelte';
	let options_base;
	let temp_dic;

	let hi_data = [];
	let std_data = [];
	let data_temp = writable([]);
	let data_humidity = writable([]);
	let num_samples_base = writable(result_base_json.channel.last_entry_id);

	function formatDate(date) {
		let d = new Date(date);
		return d.toLocaleString();
	}

	async function refetchData() {
		const original_feed = await fetch(
			'https://api.thingspeak.com/channels/1674983/feeds.json?api_key=1HFCHQH0JULE0E98&results=1&round=1'
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

	// Iterating over base results
	for (let i = 0; i < result_base_json['feeds'].length; i++) {
		temp_dic = {};
		if (result_base_json['feeds'][i].field1 != null) {
			let temp_dic = {
				y: result_base_json['feeds'][i].field1,
				x: formatDate(result_base_json['feeds'][i].created_at)
			};
			data_temp.update((n) => {
				n.push(temp_dic);
				return n;
			});
		}
		temp_dic = {};
		if (result_base_json['feeds'][i].field2 != null) {
			let temp_dic = {
				y: result_base_json['feeds'][i].field2,
				x: formatDate(result_base_json['feeds'][i].created_at)
			};
			data_humidity.update((n) => {
				n.push(temp_dic);
				return n;
			});
		}
	}
	// Iterating over Hourly Heat index
	for (let i = 0; i < result_hi_hourly_json['feeds'].length; i++) {
		temp_dic = {};
		if (result_hi_hourly_json['feeds'][i].field1 != null) {
			let temp_dic = {
				y: result_hi_hourly_json['feeds'][i].field1,
				x: formatDate(result_hi_hourly_json['feeds'][i].created_at)
			};
			hi_data.push(temp_dic);
		}
	}

	// Iterating over STD of HI Daily
	for (let i = 0; i < result_std_daily_json['feeds'].length; i++) {
		temp_dic = {};
		if (result_std_daily_json['feeds'][i].field3 != null) {
			let temp_dic = {
				y: result_std_daily_json['feeds'][i].field3,
				x: formatDate(result_std_daily_json['feeds'][i].created_at)
			};
			std_data.push(temp_dic);
		}
	}

	$: options_base = {
		chart: {
			type: 'line',
			background: 'bg-base-200'
		},
		colors: ['#FF8080', '#00E6E6'],
		stroke: {
			curve: 'smooth'
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
				},
				min: 25,
				max: 37
			},
			{
				opposite: true,
				title: {
					text: 'Humidity %'
				},
				min: 30,
				max: 90
			}
		],
		theme: {
			mode: 'dark'
		}
	};

	let options_hi = {
		chart: {
			type: 'line',
			background: 'bg-base-200'
		},
		colors: ['#FF8066'],
		stroke: {
			curve: 'smooth'
		},
		series: [
			{
				name: 'Heat Index Hourly',
				data: hi_data
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
					text: 'Heat Index °C'
				},
				min: 25,
				max: 48
			}
		],
		theme: {
			mode: 'dark'
		}
	};

	let options_std_hi = {
		chart: {
			type: 'line',
			background: 'bg-base-200'
		},
		colors: ['#FF9933'],
		stroke: {
			curve: 'smooth'
		},
		series: [
			{
				name: 'Heat Index Hourly',
				data: std_data
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
					text: 'STD Deviation per Day in Heat Index °C'
				},
				min: 0,
				max: 7
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

<Hero
	img_url={'esp.jpg'}
	main_text={'Setting up our own Thingspeak Project: Channel 1674983'}
	body_text={'A thingspeak Project was set up as shown in the picture. Just a simple ESP8266 and a sensor we had \
	lying around - but it is perfect for our needs. Only if Rayden had this sensor then we would know if he was hot or not.\
	Since the channel was made with the express purpose of getting an A in Data Communication, we will not worry about how\
	hot IZ is after Monday. Rayden is free to take this sensor if he wants. DM me please.'}
/>

<!-- Graph for realtime base results -->
<div class="md:px-10 px-3 grid grid-cols-1 md:grid-cols-2 bg-base-200 gap-y-3">
	<div class="flex flex-col mb-2">
		<h1 class="text-5xl  bold mb-2"><b>Temperature and Humidity Measurements</b></h1>
		<p class="mb-2">
			Temperature and humidity measurements were taken from a <b>DHT 11</b>
			sensor at interval of 30 seconds for the past few days. The data was uploaded to a Thingspeak channel
			for the group to analyse later.
		</p>
		<div class="flex justify-center md:justify-start items-center md:justify-items-start">
			<div class="stats shadow stats-vertical md:stats-horizontal w-max">
				<div class="stat">
					<div class="stat-title">Total Sampled Points</div>
					<div class="stat-value">{$num_samples_base}</div>
					<div class="stat-desc">every 30s</div>
				</div>
				<div class="stat">
					<div class="stat-title">Current Temperature</div>
					<div class="stat-value">{$data_temp[$data_temp.length - 1].y}</div>
					<div class="stat-desc">°C</div>
				</div>
				<div class="stat">
					<div class="stat-title">Current Humidity</div>
					<div class="stat-value">{$data_humidity[$data_humidity.length - 1].y}</div>
					<div class="stat-desc">%</div>
				</div>
			</div>
		</div>
	</div>
	<Chart options={options_base} />
</div>

<Hero
	img_url={'iz_mlm.png'}
	main_text={'But how hot does he FEEL?'}
	body_text={'It may not directly be the air temperature. PS - humidity is to blame.'}
/>

<!-- Graph for Heat Index Hourly -->
<div class="md:px-10 px-3 grid grid-cols-1 md:grid-cols-2 bg-base-200 gap-y-3">
	<div class="flex flex-col mb-2">
		<h1 class="text-5xl  bold mb-2"><b>HEAT INDEX</b></h1>
		<p class="mb-2">
			It is the human body's perception of what the temperature is like when humidity and air
			temperature are taken into account. The human body's comfort is a major factor here.
			Perspiration and sweating are the body's natural responses to overheating. The body's
			temperature cannot be controlled if perspiration cannot be evaporated.
		</p>
		<div class="flex justify-center md:justify-start items-center md:justify-items-start">
			<!-- The button to open modal -->
			<label for="my-modal" class="btn btn-primary modal-button w-max"
				>OPEN MATLAB<br />Visualisation</label
			>

			<!-- Put this part before </body> tag -->
			<input type="checkbox" id="my-modal" class="modal-toggle" />
			<div class="modal">
				<div class="modal-box">
					<iframe
						width="100%"
						height="300"
						title="Matlab Visualisation with Hourly Heat Index"
						src="https://thingspeak.com/apps/matlab_visualizations/454135"
						frameborder="0"
					/>
					<iframe
						width="100%"
						height="300"
						title="Matlab Visualisation with STD of Heat Index"
						src="https://thingspeak.com/apps/matlab_visualizations/454151"
						frameborder="0"
					/>
					<div class="modal-action">
						<label for="my-modal" class="btn">Close</label>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Chart options={options_hi} />
</div>

<!-- Graph for Std Deviation in Heat Index -->
<div class="md:px-10 px-3 grid grid-cols-1 md:grid-cols-2 bg-base-200 gap-y-3">
	<div class="flex flex-col mb-2">
		<h1 class="text-5xl  bold mb-2"><b>Using Std Deviation for Analysis</b></h1>
		<p class="mb-2">
			Standard deviation was calculated for each day's average heat index to assess how erratic it
			was. The wider the temperature range, the larger the standard deviation, which could imply a
			more volatile day in terms of thermal comfort.
		</p>
		<div class="flex justify-center md:justify-start items-center md:justify-items-start">
			<label for="my-second-modal" class="btn btn-primary modal-button w-max"
				>OPEN MATLAB<br />Visualisation</label
			>

			<!-- Put this part before </body> tag -->
			<input type="checkbox" id="my-second-modal" class="modal-toggle" />
			<div class="modal">
				<div class="modal-box">
					<iframe
						width="100%"
						height="300"
						title="Matlab Visualisation with Hourly Heat Index"
						src="https://thingspeak.com/apps/matlab_visualizations/454271"
						frameborder="0"
					/>
					<div class="modal-action">
						<label for="my-second-modal" class="btn">Close</label>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Chart options={options_std_hi} />
</div>
