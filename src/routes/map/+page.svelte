<script lang="ts">
    import MapChart from '$lib/components/MapChart.svelte';
    // export let data;
    // const { zones } = data;

    // function processData(data: typeof zones) {
    //     const out: Record<string, number> = {};
    //     for (const [key, value] of Object.entries(data)) {
    //         const ioc = value.icon?.slice(19, -4);
    //         if(ioc) {
    //             out[ioc] = 1;
    //         }
    //     }

    //     return out;
    // }
</script>

<main>
    <MapChart />
</main>
