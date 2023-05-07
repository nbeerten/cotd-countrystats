<script lang="ts">
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$page.status} | COTD CountryStats</title>
</svelte:head>

<div class="mb-2 flex gap-2 font-medium">
    <a href="/" class="underline">Home</a>
</div>

<div>
    <h1 class="text-4xl font-bold">{$page.status}</h1>
    <p class="text-lg font-medium mb-6">
        {$page.error.message}
    </p>
</div>
