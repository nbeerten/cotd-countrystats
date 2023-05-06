<script lang="ts">
    import '../satoshi.css';
    import '@unocss/reset/tailwind-compat.css';
    import 'virtual:uno.css';
</script>

<svelte:head>
    <title>COTD CountryStats</title>
</svelte:head>

<main class="font-sans shell-max-w-center">
    <slot />
</main>

<style>
    :global(:root) {
        --font-satoshi: 'Satoshi-Variable', 'Satoshi', system-ui, 'Segoe UI', Roboto, Helvetica,
            Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        color-scheme: dark;
    }

    :global(.font-sans) {
        font-family: var(--font-satoshi);
    }
</style>
