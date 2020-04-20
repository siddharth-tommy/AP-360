import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  AfterContentInit
} from "@angular/core";
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";
import { ChartComponent } from "../chart/chart.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscriber, Subscription } from "rxjs";

@Component({
  selector: "pdfreportcomponent",
  templateUrl: "./pdfreport.component.html",
  styleUrls: ["./pdfreport.component.css"]
})
export class PdfreportComponent implements OnInit, AfterContentInit, OnDestroy {
  chartType: number;
  isBatteryDataSelected: boolean = false;
  reportAssetTypeData: any = [];
  reportAssetData: any = [];
  isReportGenerated: boolean = false;
  constructor(private route: ActivatedRoute) {}
  paramData: Subscription;
  chartData: any;
  chartInformation: any;
  batteryData: any;
  @ViewChild("chartcomponent") chartcomponent: ChartComponent;
  ngOnInit() {
    var chartReponseData;
    this.isDetailedViewOpened = false;
    this.paramData = this.route.queryParams.subscribe(
      response => (chartReponseData = response)
    );
    this.chartData = JSON.parse(chartReponseData.chartData);
    this.chartType = this.chartData.chartType;
    this.chartInformation = this.chartData.chartInformation;
    this.batteryData = this.chartData.batteryData;
    this.reportAssetTypeData = this.chartData.assetTypeData;
    this.isBatteryDataSelected = this.chartData.isBatteryDataSelected;
  }

  ngOnDestroy() {
    this.paramData.unsubscribe();
  }

  ngAfterContentInit() {
    if (this.chartData.chartType == 1) {
      this.formatReponseData(this.chartData.assetTypeData);
    } else if (this.chartData.chartType == 2) {
      this.isDetailedViewOpened = true;
      this.formatReponseData(this.chartData.assetData);
    } else {
      this.formatReponseData(this.chartData.batteryData);
    }
  }

  formatReponseData(paramArray, isRedraw = false) {
    var xAxis = [];
    var yAxis = [];
    var labels = [];
    if (!this.isDetailedViewOpened) this.reportAssetTypeData = [];
    paramArray.forEach(element => {
      if (element.System == 2 || this.chartType == 2 || isRedraw) {
        if (this.chartType == 1) {
          if (
            element.overallActualUsage != undefined &&
            element.overallExpectedUsage != undefined &&
            element.AssetTypeName != undefined
          ) {
            xAxis.push(element.overallActualUsage);
            yAxis.push(element.overallExpectedUsage);
            labels.push(element.AssetTypeName);
            this.reportAssetTypeData.push(element);
          }
        } else {
          if (
            element.ActualUsage != undefined &&
            element.ExpectedUsage != undefined &&
            element.AssetName != undefined
          ) {
            xAxis.push(element.ActualUsage);
            yAxis.push(element.ExpectedUsage);
            labels.push(element.AssetName);
            this.reportAssetData.push(element);
          }
        }
      }
    });
    this.chartcomponent.generateBarChart(xAxis, yAxis, labels, 100);
    this.isReportGenerated = true;
  }

  shoDetailView(selectedItem) {
    this.isDetailedViewOpened = true;
    this.chartType = 2;
    this.reportAssetData = [];
    this.formatReponseData(selectedItem.Assets, true);
  }
  isDetailedViewOpened = false;
  goToPreviousChart() {
    this.chartType = 1;
    this.isDetailedViewOpened = false;
    this.formatReponseData(this.reportAssetTypeData, true);
  }

  generatePDF() {
    var data = document.getElementById("pdfformat");
    var date = new Date();
    html2canvas(data).then(canvas => {
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      //enter code here
      const imgData = canvas.toDataURL("image/png");

      var doc = new jspdf("p", "mm");
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();
      var position = 0;
      doc.setDisplayMode(6, "single", "UseOutlines");
      // doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight + 15);
      doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight + 15);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight + 15);
        heightLeft -= pageHeight;
      }
      doc.save("ProductivityReport" + date.getTime() + ".pdf");
    });
  }
}
