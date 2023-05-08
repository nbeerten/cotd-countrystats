<script lang="ts">
    import { Chart, registerables } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import { onMount } from 'svelte';

    Chart.register(...registerables, ChartDataLabels);

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
            }
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
                    datalabels: {
                        formatter: function(value, context) {
                            if(!context.chart.data.labels) return;
                            return (context.chart.data.labels[context.dataIndex] as string) + ': ' + value;
                        },
                        anchor: 'end',
                        clamp: true,
                        display: function() {
                            return screen.width < 768 ? false : 'auto';
                        },
                        color: 'rgb(10, 10, 10)',
                        align: 'start',
                        offset: 10,
                        font: {
                            family: "Satoshi-Variable",
                            size: 11,
                            weight: 600,
                        }                        
                    }
                },
            },
        });
    });
</script>

<figure {...$$restProps}>
    <canvas bind:this={chartElement} />
</figure>
