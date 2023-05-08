<script lang="ts">
    import PieChart from '$lib/components/PieChart.svelte';

    export let data;
    const { id, streamed } = data;
</script>

<svelte:head>
    {#await streamed.data}
        <title>Competition #{id} - COTD Countrystats</title>
    {:then data}
        <title>{data.compInfo.name} - COTD Countrystats</title>
    {/await}
</svelte:head>

<div>
    {#await streamed.data}
        <h1 class="text-4xl font-bold">
            Loading data for competition {id}...
        </h1>
        <p class="text-lg font-medium">Might take a couple of seconds to load...</p>
    {:then data}
        <h1 class="text-4xl font-bold">
            {data.compInfo.name}
        </h1>
        <p class="text-lg font-medium">{data.compInfo.nbPlayers} players total.</p>

        <div class="flex flex-col md:flex-row w-full h-[70vh] my-8">
            <PieChart class="w-full" data={data.countryCount} label="Players" />
        </div>
    {:catch error}
        <p>Something went wrong...</p>
        <p class="text-2xl font-bold">{error.message}</p>
    {/await}
</div>
