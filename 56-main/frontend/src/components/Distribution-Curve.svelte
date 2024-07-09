<script lang="ts">
    import {onMount} from 'svelte';
    import Chart, {type ChartConfiguration} from 'chart.js/auto';
    import {makeRequest} from "../scripts/fetch.ts";
    import 'chartjs-adapter-date-fns';
    import annotationPlugin, {type AnnotationOptions, type AnnotationTypeRegistry} from "chartjs-plugin-annotation";

    export let currentNotification: Date;

    Chart.register(annotationPlugin);

    interface DataItem {
        hour: number;
        power: number;
    }

    interface ChartDataItem {
        x: number;
        y: number;
    }

    let futureData: ChartDataItem[] = [];
    let chart: Chart | null = null;
    let canvas: HTMLCanvasElement;
    let colorCode = localStorage.getItem('darkMode') === "true" ? '#A9A9A9' : '#000000';
    let currentHour = new Date().getHours();

    function getColor(item: ChartDataItem): string {
        const maxPower = Math.max(...futureData.map(dataItem => dataItem.y));
        const normalizedValue = item.y / maxPower;
        let red = 255;
        let green = normalizedValue < 0.5 ? normalizedValue * 2 * 255 : 255;
        red = normalizedValue < 0.5 ? red : (1 - normalizedValue) * 2 * 255;
        return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`;
    }

    function createGradient(ctx: CanvasRenderingContext2D, chartArea: { left: number, right: number, top: number, bottom: number }, data: ChartDataItem[]): CanvasGradient {
        const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);

        data.forEach((item, index: number) => {
            gradient.addColorStop(index / (data.length - 1), getColor(item));
        });

        return gradient;
    }

    async function getCurrentData(): Promise<ChartDataItem[]> {
        try {
            const data = await makeRequest('/weather/Amsterdam', 'GET');
            const min = new Date().setHours(currentHour, 0, 0, 0);
            const max = new Date().setHours(currentHour + 24, 0, 0, 0);
            const increment = (max - min) / (data.length - 1);
            return data.map((item: DataItem, index: number) => {
                return { x: min + increment * index, y: item.power + 0.3 };
            });
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    onMount(async () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        futureData = await getCurrentData();

        const data = {
            datasets: [{
                label: 'Values',
                data: futureData,
                borderColor: '#000000',
                borderWidth: 0,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        };

        const config: ChartConfiguration<'line', ChartDataItem[], string> = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                layout: {
                    padding: {
                        top: 20
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    },
                    annotation: {
                        clip: false,
                        annotations: {
                            currentTimeLine: {
                                type: 'line',
                                xMin: Date.now(),
                                xMax: Date.now(),
                                borderColor: colorCode,
                                borderDash: [8],
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: function() {
                                        const currentTime = new Date();
                                        return currentTime.getHours().toString().padStart(2, '0') + ":" + currentTime.getMinutes().toString().padStart(2, '0');
                                    },
                                    position: 'end',
                                    color: colorCode,
                                    backgroundColor: 'transparent',
                                    yAdjust: -30,
                                    xAdjust: -20,
                                }
                            },
                            notificationTimeLine: {
                                type: 'line',
                                xMin: currentNotification.getTime(),
                                xMax: currentNotification.getTime(),
                                borderColor: 'red',
                                borderDash: [8],
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: function() {
                                        return currentNotification.getHours().toString().padStart(2, '0') + ':' + currentNotification.getMinutes().toString().padStart(2, '0');
                                    },
                                    position: 'end',
                                    color: 'red',
                                    backgroundColor: 'transparent',
                                    yAdjust: -30,
                                    textAlign: 'center'
                                }
                            }
                        } as Record<string, AnnotationOptions<keyof AnnotationTypeRegistry>>
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 0
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            round: 'hour',
                            displayFormats: {
                                hour: 'HH:00'
                            },
                        },
                        min: new Date(new Date().setHours(currentHour, 0, 0, 0)).getTime(),
                        max: new Date(new Date().setHours(currentHour + 24, 0, 0, 0)).getTime(),
                        title: {
                            display: true,
                            color: '#ffffff'
                        },
                        ticks: {
                            stepSize: 4,
                            color: colorCode
                        },
                        grid: {
                            drawOnChartArea: false,
                            color: colorCode,
                            tickLength: 8
                        }
                    },
                    y: {
                        display: false,
                    }
                }
            }
        };

        chart = new Chart(ctx, config);

        const updateGradient = () => {
            if (chart) {
                const chartArea = chart.chartArea;
                chart.data.datasets[0].backgroundColor = createGradient(ctx, chartArea, futureData);
                chart.update();
            }
        };

        updateGradient();

        setInterval(async () => {
            const newHour = new Date().getHours();
            if (newHour !== currentHour) {
                currentHour = newHour;
                futureData = await getCurrentData();

                if (chart && chart.options.scales && chart.options.scales.x) {
                    chart.options.scales.x.min = new Date(new Date().setHours(currentHour, 0, 0, 0)).getTime();
                    chart.options.scales.x.max = new Date(new Date().setHours(currentHour + 24, 0, 0, 0)).getTime();
                }

                updateGradient();
            }

            if (chart && chart.options.plugins && chart.options.plugins.annotation && chart.options.plugins.annotation.annotations) {
                const annotations = chart.options.plugins.annotation.annotations as Record<string, AnnotationOptions<keyof AnnotationTypeRegistry>>;
                if (annotations.currentTimeLine) {
                    annotations.currentTimeLine.xMin = Date.now();
                    annotations.currentTimeLine.xMax = Date.now();
                }
                if (annotations.notificationTimeLine) {
                    annotations.notificationTimeLine.xMin = currentNotification.getTime();
                    annotations.notificationTimeLine.xMax = currentNotification.getTime();
                }
                chart.update();
            }
        }, 1000);
    });

    $: if (chart && chart.options.plugins && chart.options.plugins.annotation) {
        const annotations = chart.options.plugins.annotation.annotations as Record<string, AnnotationOptions<keyof AnnotationTypeRegistry>>;
        annotations.notificationTimeLine.xMin = currentNotification.getTime();
        annotations.notificationTimeLine.xMax = currentNotification.getTime();
        chart.update();
    }
</script>

<div class="chart-container">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .chart-container {
        width: 95%;
        height: 300px;
    }
</style>