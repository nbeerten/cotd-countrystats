<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="mb-2 flex gap-2 font-medium">
    <a href="/" class="hover:underline">Home</a>
    <span>/</span>
    <a href={$page.url.toString()} class="underline">Competition #{$page.params.id}</a>
</div>

<slot />
