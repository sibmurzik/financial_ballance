import Chart from "chart.js/auto";
import {allFinancialData} from "../utils/getAllFinancialData";
import {TimeIntervalSelection} from "./intervalSelection";
import type {sideMenu} from "./sideMenu";



export class Main extends TimeIntervalSelection{

    readonly incomesData: any;
    readonly spenceData: any;
    readonly incomeChartElement: HTMLCanvasElement;
    readonly spenceChartElement: HTMLCanvasElement;
    private colorMap: Map<unknown, unknown>;
    readonly scaleChart: any;
    readonly incomeChart: Chart<"pie", [], never> | null = null;
    readonly spenceChart: Chart<"pie", [], never> | null= null;

    constructor(sideMenuInstance: sideMenu, openNewRoute: (url: string) => Promise<void>) {
        super( openNewRoute);

        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("mainPage");
            sideMenuInstance.updateSideBarInfo().then();
        }

        //Chart.register(PieController);
        //Chart.register(ArcElement);




        this.gettingUserOperation().then();

        this.incomesData = {
                labels: [],
                datasets: [{
                data: [],
                backgroundColor: [],
                hoverOffset: 6,
            }]
        };
        this.spenceData = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                hoverOffset: 6,
            }]
        };

        this.incomeChartElement = document.getElementById('incomesChart') as HTMLCanvasElement;
        this.spenceChartElement = document.getElementById('spenceChart') as HTMLCanvasElement;
        const storageData: string | null = localStorage.getItem('colorMap');
        if (storageData) {
            this.colorMap = new Map(JSON.parse(storageData));
        } else {
            this.colorMap = new Map();
        }

        //console.log("color Map",  this.colorMap);

        this.scaleChart = {
            id: 'scale-chart',
            beforeDatasetsDraw(chart:any, _args: any, plugins: any) {
                const {ctx} = chart;
                ctx.save();
                const screenWidth = window.innerWidth;

                chart.getDatasetMeta(0).data.forEach((dataPoint:any, index: any): void => {
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
        if (this.incomeChartElement) {
            this.incomeChart = this.createChart(this.incomesData, this.incomeChartElement);
        }
        if (this.spenceChartElement) {
            this.spenceChart = this.createChart(this.spenceData, this.spenceChartElement);
        }





        window.matchMedia("(max-width: 650px)")
            .addEventListener('change', this.handleLayoutChanges.bind(this));

        window.matchMedia("(max-width: 900px)")
            .addEventListener('change', this.handleLayoutChanges.bind(this));

        window.matchMedia("(max-width: 1200px)")
            .addEventListener('change', this.handleLayoutChanges.bind(this));


    }

    private createChart(data: any, element:HTMLCanvasElement):any {
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


    private handleLayoutChanges(): void {
        if(this.incomeChart){
            this.incomeChart.update();
        }
        if (this.spenceChart) {
            this.spenceChart.update();
        }



    }

    private async gettingUserOperation():Promise<void> {
        if(await allFinancialData.httpsRequestGettingUserOperations(this.getHttpPeriodParams())) {
            const diagramsData:Map<string, number>[] = allFinancialData.getDiagramsData();
            //console.log("summary", diagramsData);
            if(diagramsData){
                this.updateDigram(diagramsData[0], this.spenceData);
                this.updateDigram(diagramsData[1], this.incomesData);
            }

            this.handleLayoutChanges.call(this);



        }
    }

    private updateDigram(dataMap:Map<string, number>| undefined, digramData: any ):void {
        digramData.labels = [];
        digramData.datasets[0].data = [];
        digramData.datasets[0].backgroundColor = [];
        if (dataMap) {
            if (dataMap.size === 0) {
                digramData.labels.push("Нет данных за этот период");
                digramData.datasets[0].data.push(100);
                digramData.datasets[0].backgroundColor.push('rgb(240,240,240)');
                return;
            }

            dataMap.forEach((value: number, key: string): void => {
                digramData.labels.push(key);
                digramData.datasets[0].data.push(value);
                if (this.colorMap.has(key)) {
                    const color: string = this.colorMap.get(key) as string;
                    if (color) {
                        digramData.datasets[0].backgroundColor.push(color);
                    }

                } else {
                    let r: number = Math.floor(Math.random() * 255) + 1;
                    let g: number = Math.floor(Math.random() * 255) + 1;
                    let b: number = Math.floor(Math.random() * 255) + 1;
                    let color: string = 'rgb(' + r + ',' + g + ',' + b + ')'
                    digramData.datasets[0].backgroundColor.push(color);
                    this.colorMap.set(key, color);
                }

            })

            localStorage.setItem('colorMap', JSON.stringify(Array.from(this.colorMap.entries())));
        }
    }

     protected intervalSelection(element:EventTarget):void {
        super.intervalSelection(element);
        this.gettingUserOperation().then();
    }

}