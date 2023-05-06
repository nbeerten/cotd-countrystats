<script lang="ts">
    export let data;
    const { title, info, test } = data;
</script>

<h1>Welcome to {title}</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{info}

<hr />
<details>
    <summary>Data Test</summary>
    <pre>{JSON.stringify(test, null, 4)}</pre>
</details>
<!-- <hr>
<details>
    <summary>Country Count</summary>
    <pre>{JSON.stringify(countryCount, null, 4)}</pre>
</details>
<hr>
<details>
    <summary>Div 1</summary>
    <pre>{JSON.stringify(Object.fromEntries(div1), null, 4)}</pre>
</details> -->
