<script lang="ts">
    import { Chart, registerables } from 'chart.js';
    import {
        ChoroplethController,
        GeoFeature,
        ColorScale,
        ProjectionScale,
        topojson,
    } from 'chartjs-chart-geo';
    import { onMount } from 'svelte';
    import countries from 'world-atlas/countries-110m.json';
    const countryData = countries as unknown as Parameters<(typeof topojson)['feature']>[0];
    const topoData = topojson.feature(countryData, countryData.objects.countries);
    const data = 'features' in topoData ? topoData.features : [];

    Chart.register(...registerables, ChoroplethController, GeoFeature, ColorScale, ProjectionScale);

    let canvasElement: HTMLCanvasElement;

    onMount(() => {
        new Chart(canvasElement, {
            type: 'choropleth',
            data: {
                labels: data.map((d) => d.properties?.name),
                datasets: [
                    {
                        label: 'Countries',
                        data: data.map((d) => ({ feature: d, value: Math.random() })),
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    projection: {
                        axis: 'x',
                        projection: 'naturalEarth1',
                    },
                },
            },
        });
    });
</script>

<canvas bind:this={canvasElement} />
