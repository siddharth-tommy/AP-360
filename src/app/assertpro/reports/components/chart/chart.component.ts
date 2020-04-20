import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ApplicationRef,
  Injector
} from "@angular/core";
import { Chart } from "chart.js";
import { $ } from "protractor";

@Component({
  selector: "chart-component",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"]
})
export class ChartComponent implements OnInit {
  constructor() {
    this.paramDataSet.push(
      new DataSet({
        data: [10, 10],
        backgroundColor: "red",
        borderColor: "white",
        borderWidth: "Tests",
        fill: "true",
        lineTension: "0"
      })
    );
    this.paramDataSet.push(
      new DataSet({
        data: [20, 20],
        backgroundColor: "blue",
        borderColor: "white",
        borderWidth: "Tests",
        fill: "true",
        lineTension: "0"
      })
    );
    this.formatBarChartDataSet();
  }
  ngOnInit() {}
  @Input() chartType: string = "BARCHART";

  prodictivitylinechart: any;
  bottomLabel: any = ["Test", "Test1"];
  paramDataSet: any = [];
  formattedDataSet: any = [];

  formatBarChartDataSet() {
    for (var index = 0; index < this.paramDataSet.length; index++) {
      let currentDataSet = this.paramDataSet[index];
      let compuedDataSet = new DataSet(currentDataSet);
      this.formattedDataSet.push(compuedDataSet);
    }
  }

  maxvalue: any = 100;
  fontBackground: any = "";

  generateLineChart() {
    //this.prodictivitylinechart.destroy();
    this.prodictivitylinechart = new Chart("barChart", {
      type: "line",
      data: {
        labels: this.bottomLabel,
        // datasets: this.formattedDataSet
        datasets: [
          {
            // "label": "Body Weight Lost",
            data: [10, 10],
            borderColor: "#169bd7",
            backgroundColor: "red",
            lineTension: 0,
            borderWidth: 1,
            fill: true
          },
          {
            // "label": "Body Weight Lost",
            data: [20, 20],
            borderColor: "#e8e8e8",
            backgroundColor: "#e8e8e822",
            lineTension: 0,
            borderWidth: 1,
            fill: true
          }
        ]
      },
      options: {
        legend: { display: false },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              // stacked: true,  // value line doubled
              ticks: {
                fontSize: 10,
                fontColor: "#1d3d57",
                fontFamily: "robotoregular",
                beginAtZero: true,
                min: 0,
                max: this.maxvalue,
                stepSize: 10
              },
              scaleLabel: {
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 9,
                fontColor: "black",
                fontFamily: "robotoregular"
              },
              scaleLabel: {
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    });
  }
  @ViewChild("barChart") barChart;
  barchart: any;

  @ViewChild("doughnutChartEqualization") doughnutChartEqualization;
  maintenancedoughnutchartEqualization: any;

  reDraw(a, clickedElement, c) {
    if (clickedElement.length != 0) {
      new Chart("doughnutChartEqualization", {
        type: "doughnut",
        data: {
          labels: ["Productive", "Idle", "UnOccupied"],
          datasets: [
            {
              label: "Maintenance",
              backgroundColor: ["#b3e7ff", "#169bd7", "#ea4256"],
              data: [70, 20, 10]
            }
          ]
        },
        options: {
          cutoutPercentage: 60,
          tooltips: {
            titleFontSize: 7,
            bodyFontSize: 7
          },
          plugins: {
            labels: {
              render: "value",
              fontSize: 0,
              fontColor: "#fff",
              fontStyle: "normal",
              fontFamily: "robotoregular",
              fontWeight: "bold",
              fontStretch: "condensed"
            }
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              fontColor: "#4a4a4a",
              padding: 15, //space between labels
              usePointStyle: true, //Border radius
              boxWidth: 15 //Box width
            }
          },
          title: {
            fontColor: "#4a4a4a",
            fontSize: 18,
            display: false,
            text: "Maintenance"
          }
        }
      });
    }
  }

  generateBarChart(x, y, paramLabels, maxRange) {
    var targetElement = document.getElementById("barChart");
    if (this.barChart.nativeElement == null) return;
    if (this.barchart) this.barchart.destroy();
    this.barchart = new Chart(this.barChart.nativeElement, {
      type: "bar",
      data: {
        labels: paramLabels,
        datasets: [
          {
            backgroundColor: "#3e95cd",
            data: x,
            label: "Actual Usage"
          },
          {
            backgroundColor: "rgba(167,167,180,0.33)",
            data: y,
            label: "Expected Usage"
          }
        ]
      },
      options: {
        onClick: this.reDraw,
        plugins: {
          labels: false
        },
        title: {
          display: true,
          fontSize: 0
        },
        legend: { display: true, position: "bottom", labels: { boxWidth: 15 } },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              // stacked: true,  // value line doubled
              ticks: {
                fontSize: 10,
                fontColor: "#1d3d57",
                fontFamily: "robotoregular",
                beginAtZero: false,
                min: 0,
                max: maxRange,
                stepSize: 20
              },
              scaleLabel: {
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              barThickness: 5,
              ticks: {
                fontSize: 10,

                fontFamily: "robotolight"
              },
              scaleLabel: {
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    });
  }
}

class DataSet {
  public data: any;
  public borderColor: string;
  public backgroundColor: string;
  public lineTension: number;
  public borderWidth: number;
  public fill: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
    // this.data = currentDataSet.data;
    // this.backgroundColor = currentDataSet.backgroundColor;
    // this.borderColor = currentDataSet.borderColor;
    // this.lineTension = currentDataSet.lineTension;
    // this.borderWidth = currentDataSet.borderWidth;
    // this.fill = currentDataSet.fill;
  }
}
