<script lang="ts">
    import '../satoshi.css';
    import '@unocss/reset/tailwind-compat.css';
    import 'virtual:uno.css';
    import { page } from '$app/stores';
</script>

<main class="font-sans shell-max-w-center">
    {#if /\/[0-9]?/.test($page.url.pathname)}
        <div class="mb-2 flex gap-2 font-medium">
            <a href="/" class="underline">Home</a>
        </div>
    {/if}

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
