import Chart from 'chart.js/auto';
import {allFinancialData} from "../utils/getAllFinancialData";
import {TimeIntervalSelection} from "./intervalSelection";


export class Main extends TimeIntervalSelection{
    constructor(sideMenuInstance, openNewRoute) {
        super(sideMenuInstance, openNewRoute);


        this.gettingUserOperation().then();

        this.incomesData = {
            labels: [
                'Red',
                'Orange',


            ],
            datasets: [{
                data: [27, 40, 15, 15, 8],
                backgroundColor: [
                    'rgb(214,58,91)',
                    'rgb(218,99,14)',
                    'rgb(255,208,0)',
                    'rgb(56,205,17)',
                    'rgb(38,102,194)',

                ],
                hoverOffset: 6,

            }]
        };
        this.spenceData = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue',

            ],
            datasets: [{
                data: [5, 10, 35, 35, 15],
                backgroundColor: [
                    'rgb(214,58,91)',
                    'rgb(218,99,14)',
                    'rgb(255,208,0)',
                    'rgb(56,205,17)',
                    'rgb(38,102,194)',

                ],
                hoverOffset: 6,

            }]
        };

        this.incomeChartElement = document.getElementById('incomesChart');
        this.spenceChartElement = document.getElementById('spenceChart');

        this.colorMap = new Map(JSON.parse(localStorage.getItem('colorMap')));
        if (!this.colorMap) {
            this.colorMap = new Map();
        }
        //console.log("color Map",  this.colorMap);

        this.scaleChart = {
            id: 'scale-chart',
            beforeDatasetsDraw(chart, _args, plugins) {
                const {ctx} = chart;
                ctx.save();
                const screenWidth = window.innerWidth;

                chart.getDatasetMeta(0).data.forEach((dataPoint, index) => {
                    if (screenWidth <= 650) {
                        dataPoint.outerRadius = 100;
                    } else if (screenWidth > 650 && screenWidth <= 900) {
                        dataPoint.outerRadius = 120;
                    } else if (screenWidth > 900 && screenWidth <= 1200) {
                        dataPoint.outerRadius = 140;
                    } else {
                        dataPoint.outerRadius = 180;
                    }


                })
            }
        }

        this.incomeChart = this.createChart(this.incomesData, this.incomeChartElement);
        this.spenceChart = this.createChart(this.spenceData, this.spenceChartElement);


        window.matchMedia("(max-width: 650px)")
            .addEventListener('change', this.handleLayoutChanges.bind(this));

        window.matchMedia("(max-width: 900px)")
            .addEventListener('change', this.handleLayoutChanges.bind(this));

        window.matchMedia("(max-width: 1200px)")
            .addEventListener('change', this.handleLayoutChanges.bind(this));


    }

    createChart(data, element) {
        return new Chart(
            element,
            {
                type: 'pie',
                data: data,
                options: {
                    rotation: 50,
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 12,
                                    family: "'Roboto', sans-serif",
                                    weight: 500,
                                },
                                boxWidth: 35,
                                boxHeight: 10,
                                padding: 10,
                            },
                        }
                    },
                },
                plugins: [this.scaleChart],
            }
        )
    }


    handleLayoutChanges(e) {
        this.incomeChart.update();
        this.spenceChart.update();

    }

    async gettingUserOperation() {
        if(await allFinancialData.httpsRequestGettingUserOperations("all")) {
            const diagramsData = allFinancialData.getDiagramsData();
            //console.log("summary", diagramsData);
            this.updateDigram(diagramsData[0], this.spenceData);
            this.updateDigram(diagramsData[1], this.incomesData);
        }
    }

    updateDigram(dataMap, digramData ) {
        digramData.labels = [];
        digramData.datasets[0].data = [];
        digramData.datasets[0].backgroundColor = [];

        dataMap.forEach((value, key) => {
            digramData.labels.push(key);
            digramData.datasets[0].data.push(value);
            if (this.colorMap.has(key)) {
                digramData.datasets[0].backgroundColor.push(this.colorMap.get(key));
            } else {
                let r = Math.floor(Math.random() * 255) + 1;
                let g = Math.floor(Math.random() * 255) + 1;
                let b = Math.floor(Math.random() * 255) + 1;
                let color = 'rgb('+r+','+g+','+b+')'
                digramData.datasets[0].backgroundColor.push(color);
                this.colorMap.set(key, color);
            }

        })

        localStorage.setItem('colorMap', JSON.stringify(Array.from(this.colorMap.entries())));
    }

}