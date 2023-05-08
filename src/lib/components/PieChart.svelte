<script lang="ts">
    import { Chart, registerables } from 'chart.js';
    import { onMount } from 'svelte';

    Chart.register(...registerables);

    let chartElement: HTMLCanvasElement;

    export let data: Record<string, number>;

    export let label: string;

    function processData(data: Record<string, number>) {
        const keys = Object.keys(data).slice(0, 15);
        const dataNew = Object.entries(data)
            .slice(0, 15)
            .map(([, value]) => value);

        const othersData = Object.entries(data)
            .slice(15)
            .map(([, value]) => value);
        const othersSum = othersData.reduce((a, b) => a + b, 0);

        const newKeys = [...keys, 'Other'];
        const newData = [...dataNew, othersSum];

        return {
            labels: newKeys,
            data: newData,
        };
    }

    const chartData = {
        labels: processData(data).labels,
        datasets: [
            {
                label: label,
                data: processData(data).data,
            },
        ],
    };

    onMount(() => {
        new Chart(chartElement, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                            color: 'rgb(200, 200, 200)',
                        },
                    },
                },
            },
        });
    });
</script>

<figure {...$$restProps}>
    <canvas bind:this={chartElement} />
</figure>
