<script lang="ts">
    // import { Pie } from "svelte-chartjs";
    // import type { ChartData } from "chart.js";

    export let data;
    const { streamed, id } = data;
</script>

<div class="my-12">
    {#await streamed.data}
        <h3 class="text-xl font-bold">Loading data for competition {id}...</h3>
    {:then data}
        <h3 class="text-xl font-bold">{data.compInfo.name}</h3>
        <p>{data.compInfo.nbPlayers} players total.</p>

        <!-- <Pie data={data.countryCount} /> -->

        <details open class="my-4">
            <summary>Amount of players / country</summary>
            <div class="block border border-stone-700 w-full bg-stone-900 rounded-lg mt-2">
                <p class="overflow-y-scroll h-[30rem] p-4 whitespace-break-spaces font-mono">
                    {JSON.stringify(data.countryCount, null, 4)}
                </p>
            </div>
        </details>

        <details class="my-4">
            <summary>Average rank of a country</summary>
            <div class="block border border-stone-700 w-full bg-stone-900 rounded-lg mt-2">
                <p class="overflow-y-scroll h-[30rem] p-4 whitespace-break-spaces font-mono">
                    {JSON.stringify(data.averageRankData, null, 4)}
                </p>
            </div>
        </details>
    {:catch error}
        <p>Something went wrong...</p>
        <p class="text-2xl font-bold">{error.message}</p>
    {/await}
</div>
