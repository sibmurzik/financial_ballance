import Chart from 'chart.js/auto';
import {sideMenu} from "./sideMenu";





export class Main {
    constructor(sideMenuInstance) {

        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("mainPage");
        }

        this.incomesData = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue',

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


        this.scaleChart = {
            id: 'scale-chart',
            beforeDatasetsDraw(chart, _args, plugins) {
                const {ctx} = chart;
                ctx.save();
                const screenWidth = window.innerWidth;

                chart.getDatasetMeta(0).data.forEach((dataPoint, index) => {
                    if(screenWidth <= 650){
                        dataPoint.outerRadius = 100;
                    } else if (screenWidth > 650 && screenWidth <= 900) {
                        dataPoint.outerRadius = 120;
                    } else if (screenWidth > 900 && screenWidth <= 1200) {
                        dataPoint.outerRadius = 140;
                    } else{
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


}