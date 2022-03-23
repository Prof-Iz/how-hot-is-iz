<script>
	export let img_url;
	export let main_text;
	export let body_text;
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row justify-start">
		<img src={`\\${img_url}`} class="max-w-sm rounded-lg shadow-2xl" />
		<div>
			<h1 class="text-5xl font-bold">{main_text}</h1>
			<p class="py-6">{body_text}</p>
		</div>
	</div>
</div>
