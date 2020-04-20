import { Component, OnInit, ViewChild, AfterContentInit } from "@angular/core";
import { SinglesiteComponent } from "../../components/singlesite/singlesite.component";
import { CommonanDepartmentComponent } from "../../../configuration/assettype/commondepartment/commondepartment.component";
import { CommonassetComponent } from "../../../configuration/assettype/commonasset/commonasset.component";
import { AssetprohelperService } from "src/app/share/services/assetprohelper.service";
import { ChartComponent } from "../../components/chart/chart.component";
import { ToastrService } from "ngx-toastr";

import { PdfreportComponent } from "../../components/pdfreport/pdfreport.component";
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/internal/Subscription";
@Component({
  selector: "productivityreport-component",
  templateUrl: "./productivityreport.component.html",
  styleUrls: ["./productivityreport.component.css"]
})
export class ProductivityreportComponent implements OnInit, AfterContentInit {
  @ViewChild("singlesitecomponent") siteComponent: SinglesiteComponent;
  @ViewChild("commondepartment") commondepartment: CommonanDepartmentComponent;
  @ViewChild("commonasset") commonasset: CommonassetComponent;
  @ViewChild("chartcomponent") chartcomponent: ChartComponent;
  @ViewChild("pdfreportcomponent") pdfreportcomponent: PdfreportComponent;

  sytemUsed: any;
  sytemUsedID: any;
  commonsite: any;
  threshold: number = 25;

  availableHours = "10";
  usageHours = "20";
  productiveTime = "30";
  idleTime = "40";
  expectedUsage = "80%";
  actualUsage = "70%";
  usedCount = "100";
  notUsedCount = "5";
  siteName: string;
  constructor(
    public assetprohelperService: AssetprohelperService,
    private toastr: ToastrService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.getSystemUsedList();
    this.commondepartment.isInitialDeptLoadEnabled = false;
    this.commondepartment.isClearOptionEnabled = true;
  }
  ngAfterContentInit() {
    this.commonasset.isDeleteEnabled = false;
    this.commonasset.isMultiSelectEnabled = true;
    this.commondepartment.isAllSiteValidationSkip = true;
    this.commonasset.isAllSiteValidationSkip = true;
    //this.chartcomponent.Initialdraw();
  }
  searchText
   currentDate: Date = new Date();
   minStartDate: Date = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  ChangeFromDate() {
    if (this.fromDate >= this.toDate) this.toDate = this.fromDate;
  }

  siteChange() {
    var selectedSites = this.siteComponent.bubbles;
    if (this.loader) this.loader = false;
    var computedSiteIDs = [];
    for (var index = 0; index < selectedSites.length; index++) {
      var currentSite = selectedSites[index];
      computedSiteIDs.push(currentSite.id);
    }
    if (computedSiteIDs.length > 0) {
      this.commonasset.assets = [];
      this.commonasset.bubbles = [];
      this.commondepartment.getDepartmentList(computedSiteIDs);
    } else {
      this.commondepartment.departmentList = [];
      this.commondepartment.bubbles = [];
      this.commonasset.assets = [];
      this.commonasset.bubbles = [];
    }
    this.resetReport();
  }
  sentDepartmentList = [];
  departmentChange() {
    this.sentDepartmentList = this.commondepartment.bubbles;
    if (this.commonasset != undefined) {
      this.commonasset.departmentList = this.commondepartment.bubbles;
      this.commonasset.GetAssetsList();
    }
    this.resetReport();
  }

  assetChange() {
    this.resetReport();
  }

  fromDate = new Date();
  toDate = new Date();
  public sytemUsedList = [];
  getSystemUsedList() {
    try {
      //var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
      let url = "Configuration/GetSystemList";
      this.sytemUsedList = [];
      this.assetprohelperService.GetMethod(url).subscribe(data => {
        let body: any = data.json();
        this.sytemUsedList = body.Data;
        this.sytemUsed = this.sytemUsedList[0].Value;
        this.sytemUsedID = this.sytemUsedList[0].Key;
      });
    } catch (e) {
      console.log(e);
    }
  }

  selectedSystems = [];
  systemUsedChange(item) {
    var isExist = this.selectedSystems.filter(p => p.Value == item.Value);
    if (isExist.length == 0)
      this.selectedSystems.push({ ID: item.Key, Value: item.Value });
    this.resetReport();
  }

  resetReport() {
    if (this.isReportGenerated) {
      this.isReportGenerated = false;
      this.productivityReponseData = [];
      this.reportAssetData = [];
      this.reportAssetTypeData = [];
      this.reportBatteryData = [];
    }
  }

  RemoveProduct(selectedItem) {
    this.selectedSystems.splice(selectedItem, 1);
    this.resetReport();
  }

  getClassificationList(Key: any) {
    throw new Error("Method not implemented.");
  }

  getPDFReport() {
    this.pdfreportcomponent.generatePDF();
    //var data = document.getElementById("productivityReportDiv");
    // html2canvas(data).then(canvas => {
    //   // Few necessary setting options
    //   var imgWidth = 208;
    //   var pageHeight = 295;
    //   var imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   var heightLeft = imgHeight;

    //   const contentDataURL = canvas.toDataURL("image/png");
    //   let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
    //   var position = 0;
    //   pdf.addImage(contentDataURL, "JPEG", 0, position, imgWidth, imgHeight);
    //   pdf.save("ProductivityReport.pdf"); // Generated PDF
    // });
  }

  reportAssetTypeData = [];
  reportAssetData = [];
  reportBatteryData = [];
  chartType = 1;
  isBatteryDataSelected = false;
  productivityReponseData = [];

  isReportGenerated: boolean = false;
  formatReponseData(paramArray, isRedraw = false) {
    this.isReportGenerated = true;

    var xAxis = [];
    var yAxis = [];
    var labels = [];
    if (!this.isDetailedViewOpened) this.reportAssetTypeData = [];
    paramArray.forEach(element => {
      let currentBarChart = element;
      if (element.BarChart) currentBarChart = element.BarChart[0];

      if (element.System == 2 || element.System == 3 || isRedraw) {
        if (!isRedraw) {
          if (element.System == 2) this.chartType = 1;
          else if (element.System == 3) this.chartType = 2;
        }
        if (this.chartType == 1) {
          if (
            currentBarChart.OverAllActual != undefined &&
            currentBarChart.OverAllExpected != undefined &&
            element.AssetTypeName != undefined
          ) {
            xAxis.push(currentBarChart.OverAllActual);
            yAxis.push(currentBarChart.OverAllExpected);
            labels.push(element.AssetTypeName);
            this.reportAssetTypeData.push(element);
          }
        } else {
          if (isRedraw) {
            if (
              currentBarChart.ActualUsage != undefined &&
              currentBarChart.ExpectedUsage != undefined &&
              element.AssetName != undefined
            ) {
              xAxis.push(currentBarChart.ActualUsage);
              yAxis.push(currentBarChart.ExpectedUsage);
              labels.push(element.AssetName);
              this.reportAssetData.push(element);
            }
          } else {
            if (
              currentBarChart.OverAllActual != undefined &&
              currentBarChart.OverAllExpected != undefined &&
              element.AssetTypeName != undefined
            ) {
              xAxis.push(currentBarChart.OverAllActual);
              yAxis.push(currentBarChart.OverAllExpected);
              labels.push(element.AssetTypeName);
              this.reportAssetData.push(element);
            }
          }
        }
      } else if (element.System == 4) {
        if (
          currentBarChart.OverAllActual != undefined &&
          currentBarChart.OverAllExpected != undefined &&
          element.AssetTypeName != undefined
        ) {
          xAxis.push(currentBarChart.OverAllActual);
          yAxis.push(currentBarChart.OverAllExpected);
          labels.push(element.AssetTypeName);
          this.reportAssetData.push(element);
        }
        element.Assets.forEach(battery => {
          battery.Discharged_Time = this.convertToLocaleString(
            battery.Discharged_Time
          );
          battery.Charged_Time = this.convertToLocaleString(
            battery.Charged_Time
          );
          battery.IdleTotalTime = this.convertToLocaleString(
            battery.IdleTotalTime
          );
          battery.IdleAvgTime = this.convertToLocaleString(battery.IdleAvgTime);
          this.reportBatteryData.push(battery);
        });
        this.threshold = element.Assets[0].IdleThreshold;
        this.isBatteryDataSelected = true;
        // this.chartType = 3;
      }
    });
    this.chartcomponent.generateBarChart(xAxis, yAxis, labels, 280);
  }

  convertToLocaleString(currentElement) {
    if (currentElement) return new Date(currentElement).toLocaleTimeString();
    else return "-";
  }

  goToPreviousChart() {
    this.chartType = 1;
    this.isDetailedViewOpened = false;
    this.formatReponseData(this.reportAssetTypeData, true);
  }
  isDetailedViewOpened = false;
  shoDetailView(selectedItem) {
    this.isDetailedViewOpened = true;
    this.chartType = 2;
    this.reportAssetData = [];
    //this.reportAssetData = selectedItem.Assets;
    this.formatReponseData(selectedItem.Assets, true);
  }

  isNullOrEmptyOrUndefined(targetElement) {
    if (
      targetElement == null ||
      targetElement == undefined ||
      targetElement == ""
    )
      return true;
    else return false;
  }
  loader: boolean = false;
  applyFilter() {
    this.isDetailedViewOpened = false;
    var selectedSiteIDs = this.siteComponent.getSelectedSiteIDs();
    var selectedDepartmentIDs = this.commondepartment.getDepartmentIDs();
    var selectedAssetIDs = this.commonasset.getSelectedAssetIDs();
    this.chartType = this.commonasset.getSelectedOptionType();

    if (!this.fromDate) {
      this.toastr.warning("Please select valid From Date", "Reporting");
      return;
    }
    if (!this.toDate) {
      this.toastr.warning("Please select valid To Date", "Reporting");
      return;
    }
    if (this.selectedSystems.length <= 0) {
      this.toastr.warning("Please select product", "Reporting");
      return;
    }
    if (this.commondepartment.bubbles.length == 0) {
      this.toastr.warning("Please select department", "Reporting");
      return;
    }
    if (this.commonasset.bubbles.length == 0) {
      this.toastr.warning("Please select asset", "Reporting");
      return;
    }

    var startDate = this.fromDate;
    var endDate = this.toDate;

    var selectedProducts = [];
    this.selectedSystems.forEach(currentSystem => {
      selectedProducts.push(currentSystem.Key);
    });

    var requestModel = {
      SiteIDs: selectedSiteIDs,
      DepartmentIDs: selectedDepartmentIDs,
      AssetIDs: selectedAssetIDs,
      StartDate: startDate,
      EndDate: endDate,
      Products: selectedProducts
    };
    // var requestModel = {
    //   AssetIDs: [
    //     "657731C6-9AED-41EE-BE38-5FBD70136C76",
    //     "E2FD75C8-778A-4ADF-B6EB-1AE97B880B0B",
    //     "ED25B3E1-361F-4F8E-9E43-DFDB96E45E70"
    //   ],
    //   DepartmentIDs: ["A316596F-BC37-44E2-BED3-DE30364380B8"],
    //   EndDate: "2019-06-09T08:08:04.549Z",
    //   Products: ["1"],
    //   SiteIDs: ["D328DDBF-6004-4202-BAE5-1D5D94618E87"],
    //   StartDate: "2019-06-09T08:08:04.549Z"
    // };

    this.reportAssetTypeData = [];
    this.reportAssetData = [];
    this.reportBatteryData = [];
    var xAxis = [];
    var yAxis = [];
    var labels = [];
    this.loader = true;
    this.chartType = 0;
    var url = "Report/GetReportProductivity";
    this.assetprohelperService
      .PostMethod(url, requestModel)
      .subscribe(response => {
        let body = response.json();
        this.loader = false;
        if (body.Status) {
          this.productivityReponseData = body.Data;
          this.formatReponseData(this.productivityReponseData);
        } else {
          this.toastr.warning(body.Message, "Warning");
        }
      });
  }

  getTitles() {
    var obj = {
      Site: this.siteComponent.getSelectedSiteNames(),
      Departments: this.commondepartment.getDepartmentNames(),
      Assets: this.commonasset.getSelectedAssetNames(),
      Period:
        this.fromDate.toLocaleString() + " - " + this.toDate.toLocaleString(),
      AvailableHours: this.availableHours,
      UsageHours: this.usageHours,
      ProductiveTime: this.productiveTime,
      IdleTime: this.idleTime,
      ExpectedUsage: this.expectedUsage,
      ActualUsage: this.actualUsage,
      Used: this.usedCount,
      NotUsed: this.notUsedCount
    };
    return obj;
  }

  clearFilter() {
    this.siteComponent.bubbles = [];
    this.siteComponent.isAllSiteSelected = false;
    this.siteComponent.siteChangeEvent.emit();
    this.selectedSystems = [];
    this.isReportGenerated = false;
    this.fromDate = new Date();
    this.toDate = new Date();
    //this.commondepartment.bubbles = [];
  }

  redirectToPdfPage() {
    var chartData = {
      chartType: this.chartType,
      isBatteryDataSelected: this.isBatteryDataSelected,
      assetData: this.reportAssetData,
      assetTypeData: this.reportAssetTypeData,
      batteryData: this.reportBatteryData,
      chartInformation: this.getTitles()
    };

    this._router.navigate(["/home/pdfreport"], {
      queryParams: {
        chartData: JSON.stringify(chartData)
      },
      skipLocationChange: true
    });
  }
}
