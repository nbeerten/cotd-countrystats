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
            },
        ],
    };

    onMount(() => {
        new Chart(chartElement, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                cutout: '40%',
                datasets: {
                    pie: {
                        borderColor: '#121212',
                        borderWidth: 4,
                        borderRadius: 8,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        usePointStyle: true,
                        callbacks: {
                            labelPointStyle: () => {
                                return {
                                    pointStyle: 'rectRounded',
                                    rotation: 0,
                                };
                            },
                        },
                    },
                    datalabels: {
                        labels: {
                            country: {},
                            percentage: {},
                        },
                        formatter: function (value, context) {
                            if (!context.chart.data.labels) return;
                            if (!context.chart.data.datasets[0].data) return;
                            return [
                                context.chart.data.labels[context.dataIndex],
                                Math.round(
                                    (value /
                                        (context.chart.data.datasets[0].data.reduce(
                                            (a, b) => ((a as number) ?? 0) + ((b as number) ?? 0),
                                            0
                                        ) as number)) *
                                        100
                                ) + '%',
                            ];
                        },
                        anchor: 'end',
                        align: 'start',
                        clamp: true,
                        display: function () {
                            return screen.width < 768 ? false : 'auto';
                        },
                        color: 'rgb(240, 240, 240)',
                        backgroundColor: '#1c1917',
                        textAlign: 'end',
                        offset: 10,
                        font: {
                            family: 'Satoshi-Variable',
                            size: 10,
                            weight: 700,
                        },
                        borderRadius: 4,
                    },
                },
            },
        });
    });
</script>

<figure {...$$restProps}>
    <canvas bind:this={chartElement} />
</figure>
