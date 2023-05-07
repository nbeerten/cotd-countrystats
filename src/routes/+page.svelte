<script lang="ts">
    import { relativeTimeFromDates } from '$lib/getRelativeTime';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let data;
    $: cotdList = data.cotdList;

    function previousPage() {
        goto(`?page=${Number($page.url.searchParams.get('page') || 1) - 1}`);
    }

    function nextPage() {
        goto(`?page=${Number($page.url.searchParams.get('page') || 1) + 1}`);
    }
</script>

<svelte:head>
    <title>COTD CountryStats</title>
</svelte:head>

<div>
    <h1 class="text-4xl font-bold">COTD Countrystats</h1>
    <p class="text-lg font-medium mb-6">
        Made by <a href="//nilsbeerten.nl" class="underline font-bold">nbeerten</a>
    </p>
</div>

<div class="w-full md:w-[32ch]">
    <div class="flex flex-col gap-2">
        {#each cotdList as cotd, i}
            <div
                class="flex gap-2 justify-between items-center"
                data-sveltekit-preload-data="tap"
            >
                <div>
                    <h2 class="text-[1.05em]">
                        <span class="tabular-nums font-medium">{cotd.date}</span>
                        <span class="ml-2 text-stone-400">{relativeTimeFromDates(cotd.time)}</span>
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
            {#if i < cotdList.length - 1}
                <hr class="border-white/10 border-0 border-b" />
            {/if}
        {/each}
    </div>

    <div class="mt-2 flex gap-4 justify-between">
        <button
            on:click={() => previousPage()}
            disabled={Number($page.url.searchParams.get('page') || 1) == 1}
            class="not-disabled:hover:underline not-disabled:cursor-pointer bg-transparent disabled:text-stone-500"
            role="link">Previous page</button
        >
        <button
            on:click={() => nextPage()}
            class="hover:underline cursor-pointer bg-transparent"
            role="link">Next page</button
        >
    </div>
</div>
