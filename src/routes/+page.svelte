<script lang="ts">
    export let data;
    const { title, info, streamed } = data;
</script>

<div class="prose prose-invert">
    <h1>Welcome to {title}</h1>
    
    <p>
        Hello visitor, this is currently still a test page... But if you
        are *really* interested in this, free to open the details element below...
    </p>

    <h2>Data</h2>

    {info}
</div>

<hr class="my-2" />
{#await streamed.data}
    Loading...
{:then data}
    <details open>
        <summary>Amount of players / country</summary>
        <div class="block border border-stone-700 w-full bg-stone-900 rounded-lg mt-2">
            <p class="overflow-y-scroll h-[30rem] p-4 whitespace-break-spaces font-mono">
                {JSON.stringify(data.countryCount, null, 4)}
            </p>
        </div>
    </details>

    <hr class="my-2" />

    <details>
        <summary>Average rank of a country</summary>
        <div class="block border border-stone-700 w-full bg-stone-900 rounded-lg mt-2">
            <p class="overflow-y-scroll h-[30rem] p-4 whitespace-break-spaces font-mono">
                {JSON.stringify(data.test, null, 4)}
            </p>
        </div>
    </details>
{/await}
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
