<script lang="ts">
    import { page } from '$app/stores';
    import Icon from '@krowten/svelte-heroicons/Icon.svelte';
    import { goto } from '$app/navigation';
</script>

<div class="mb-2 flex gap-2 font-medium">
    <button
        on:click={() => (history.length > 1 ? history.back() : goto('/'))}
        class="hover:underline flex gap-1 items-center bg-transparent"
        ><Icon name="arrow-left" class="h-5 w-5" /> Back</button
    >
    <span class="mx-2">|</span>
    <a href="/" class="hover:underline">Home</a>
    <span>/</span>
    <a href={$page.url.toString()} class="underline">Competition #{$page.params.id}</a>
</div>

<slot />
