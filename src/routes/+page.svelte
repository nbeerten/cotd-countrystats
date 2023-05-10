<script lang="ts">
    import { relativeTimeFromDates } from '$lib/getRelativeTime';
    import Icon from '@krowten/svelte-heroicons/Icon.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let data;
    $: streamed = data.streamed;

    function previousPage(hash: string) {
        goto(`?page=${Number($page.url.searchParams.get('page') || 1) - 1}#${hash}`);
    }

    function nextPage(hash: string) {
        goto(`?page=${Number($page.url.searchParams.get('page') || 1) + 1}#${hash}`);
    }

    let otherCompInputField: number;
</script>

<svelte:head>
    <title>COTD Countrystats</title>
</svelte:head>

<div class="mb-2 flex gap-2 font-medium">
    <a href="/" class="underline">Home</a>
</div>

<div>
    <h1 class="text-4xl font-bold">COTD Countrystats</h1>
    <p class="text-lg font-medium mb-6">
        Made by <a href="//nilsbeerten.nl" class="underline font-bold">nbeerten</a>
    </p>
</div>

<div class="flex flex-col sm:flex-row gap-y-8 gap-x-12">
    <div class="flex flex-col gap-4 w-full md:w-[32ch]">
        <hgroup>
            <h2 class="text-2xl font-bold">COTD (Crossplay)</h2>
            <p>
                <i
                    >The "main" COTD for all platforms, available for players with crossplay
                    enabled.</i
                >
            </p>
        </hgroup>
        <div class="flex flex-col gap-2">
            {#await streamed.data}
                <p>Loading data...</p>
            {:then data}
                {#each data.cotdList as cotd, i}
                    <div
                        class="flex gap-2 justify-between items-center h-[2.05lh]"
                        data-sveltekit-preload-data="tap"
                    >
                        <div>
                            <h2 class="text-[1.05em]">
                                <span class="tabular-nums font-medium">{cotd.date}</span>
                                <span class="ml-2 text-stone-400"
                                    >{relativeTimeFromDates(cotd.time)}</span
                                >
                            </h2>
                            <p>
                                <span class:text-amber-300={cotd.type === 'Main'}>{cotd.type}</span>
                                | {cotd.nbPlayers} players
                            </p>
                        </div>
                        <a
                            href="/comp/{cotd.id}"
                            class="bg-stone-900 border border-white/10 px-2 py-1 rounded">Info</a
                        >
                    </div>
                    {#if i < data.cotdList.length - 1}
                        <hr class="border-white/10 border-0 border-b" />
                    {/if}
                {/each}
            {/await}
        </div>
        <div class="flex gap-4 justify-between">
            <button
                on:click={() => previousPage('crossplay')}
                disabled={Number($page.url.searchParams.get('page') || 1) == 1}
                class="not-disabled:hover:underline not-disabled:cursor-pointer bg-transparent disabled:text-stone-500"
                role="link">Previous page</button
            >
            <button
                on:click={() => nextPage('crossplay')}
                class="hover:underline cursor-pointer bg-transparent"
                role="link">Next page</button
            >
        </div>
    </div>

    <div class="flex flex-col gap-4 w-full md:w-[32ch]">
        <hgroup>
            <h2 class="text-2xl font-bold">Other competitions</h2>
            <p>
                <i
                    >This website works for any competition. If you have the ID of the competition,
                    insert it below to retrieve the data. <b
                        >Not every ID has a valid competition.</b
                    ></i
                >
            </p>
        </hgroup>
        <form
            class="flex gap-2"
            on:submit|preventDefault={() =>
                otherCompInputField && goto(`/comp/${otherCompInputField}`)}
        >
            <input
                type="number"
                min="0"
                max="9999"
                bind:value={otherCompInputField}
                class="px-2 py-1 bg-stone-900 border border-white/10 rounded w-full"
            />
            <button type="submit" class="px-2 py-1 bg-stone-900 border border-white/10 rounded"
                ><Icon name="magnifying-glass" class="h-5 w-5" /></button
            >
        </form>
    </div>
</div>
