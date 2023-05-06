<script lang="ts">
    export let data;
    const { title, info, test } = data;
</script>

<div class="prose">
    <h1>Welcome to {title}</h1>
    <p>
        Hello visitor, (hopefully) human-being, this is currently still a test page... But if you
        are *really* interested in the 255 best players with their zone IDs of some random COTD,
        feel free to open the details element below...
    </p>

    {info}
</div>

<hr class="my-2" />

<details open>
    <summary>Data Test</summary>
    <div class="block border border-stone-700 w-full bg-stone-900 rounded-lg mt-2">
        <pre class="overflow-y-scroll h-[30rem] p-4">{JSON.stringify(test, null, 4)}</pre>
    </div>
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
