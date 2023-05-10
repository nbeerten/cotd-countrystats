<script lang="ts">
    import '../satoshi.css';
    import '@unocss/reset/tailwind-compat.css';
    import 'virtual:uno.css';
</script>

<svelte:head>
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
</svelte:head>

<main class="font-sans shell-max-w-center">
    <slot />
</main>

<style>
    :global(:root) {
        --font-satoshi: 'Satoshi-Variable', 'Satoshi', system-ui, 'Segoe UI', Roboto, Helvetica,
            Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        color-scheme: dark;
        scrollbar-gutter: stable both-edges;
    }

    :global(.font-sans) {
        font-family: var(--font-satoshi);
    }
</style>
