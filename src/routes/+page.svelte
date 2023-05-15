<script lang="ts">
    import { relativeTimeFromDates } from '$lib/getRelativeTime';
    import Icon from '@krowten/svelte-heroicons/Icon.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let data;
    $: streamed = data.streamed;

    $: pageNum = Number($page.url.searchParams.get('page'));

    $: previousPageHref = previousPage($page.url.searchParams);
    $: nextPageHref = nextPage($page.url.searchParams);
    $: setTypeHref = (type: 'crossplay' | 'pc' | 'psn' | 'xbl' | 'luna') =>
        setType($page.url.searchParams, type);
    $: curType = $page.url.searchParams.get('type');

    function previousPage(searchParams: URLSearchParams) {
        const localSearchParams = new URLSearchParams(searchParams);
        localSearchParams.set('page', String(pageNum - 1));

        return `?${localSearchParams.toString()}`;
    }

    function nextPage(searchParams: URLSearchParams) {
        const localSearchParams = new URLSearchParams(searchParams);
        localSearchParams.set('page', String(pageNum + 1));

        return `?${localSearchParams.toString()}`;
    }

    function setType(
        searchParams: URLSearchParams,
        type: 'crossplay' | 'pc' | 'psn' | 'xbl' | 'luna'
    ) {
        const localSearchParams = new URLSearchParams(searchParams);
        localSearchParams.set('type', type);

        return `?${localSearchParams.toString()}`;
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
        <div>
            <h2 class="text-2xl font-bold">COTD</h2>
            <div class="flex gap-4">
                <a
                    href={setTypeHref('crossplay')}
                    class="hover:underline"
                    class:font-extrabold={curType === 'crossplay'}>Crossplay</a
                >
                <a
                    href={setTypeHref('pc')}
                    class="hover:underline"
                    class:font-extrabold={curType === 'pc'}>PC</a
                >
                <a
                    href={setTypeHref('psn')}
                    class="hover:underline"
                    class:font-extrabold={curType === 'psn'}>Playstation</a
                >
                <a
                    href={setTypeHref('xbl')}
                    class="hover:underline"
                    class:font-extrabold={curType === 'xbl'}>Xbox</a
                >
                <a
                    href={setTypeHref('luna')}
                    class="hover:underline"
                    class:font-extrabold={curType === 'luna'}>Luna</a
                >
            </div>
        </div>
        <div class="flex flex-col gap-2">
            {#await streamed.data}
                <p>Loading data...</p>
            {:then data}
                {#if data.cotdList.length === 0}
                    <p><i>No competitions with at least 1 players found</i></p>
                {/if}

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
            {#if pageNum > 1}
                <a href={previousPageHref} class="hover:underline cursor-pointer bg-transparent"
                    >Previous page</a
                >
            {:else}
                <span class="text-stone-500 cursor-not-allowed">Previous page</span>
            {/if}
            <a href={nextPageHref} class="hover:underline cursor-pointer bg-transparent"
                >Next page</a
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
