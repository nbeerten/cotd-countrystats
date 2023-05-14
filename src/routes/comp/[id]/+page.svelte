<script lang="ts">
    import { browser } from '$app/environment';
    import PieChart from '$lib/components/PieChart.svelte';

    export let data;
    const { id, streamed } = data;
</script>

<svelte:head>
    {#await streamed.data}
        <title>Competition #{id} - COTD Countrystats</title>
    {:then data}
        {#if data.compInfo}
            <title>{data.compInfo.name} - COTD Countrystats</title>
        {:else}
            <title>{data.error} - COTD Countrystats</title>
        {/if}
    {/await}
</svelte:head>

<div>
    {#await streamed.data}
        <h1 class="text-4xl font-bold">
            Loading data for competition {id}...
        </h1>
        <p class="text-lg font-medium">Might take a couple of seconds to load...</p>
    {:then data}
        {#if data.compInfo}
            <h1 class="text-4xl font-bold -ml-2px">
                {data.compInfo.name}
            </h1>
            <p class="text-lg font-medium flex gap-6">
                <span class="capitalize font-bold">{data.compInfo.partition}</span>
                <span class="text-stone-400">{data.compInfo.nbPlayers} players total</span>
                <span class="text-stone-400">
                    {#if browser}
                        {new Date(data.compInfo.startDate * 1000).toLocaleDateString('en-UK')},
                        {new Date(data.compInfo.startDate * 1000).toLocaleTimeString('en-UK', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        -
                        {new Date(data.compInfo.endDate * 1000).toLocaleTimeString('en-UK', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    {/if}
                </span>
            </p>

            <div class="flex flex-col md:flex-row w-full h-[70vh] my-8">
                <PieChart class="w-full" data={data.countryCount} label="Players" />
            </div>

            <hr class="border-white/10" />
        {:else}
            <p class="text-3xl font-bold">{data.error}</p>
        {/if}
    {:catch error}
        <p>Something went wrong...</p>
        <p class="text-2xl font-bold">{error.message}</p>
    {/await}
</div>
