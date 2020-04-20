import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Component, OnInit, Inject, Input, ViewChild, HostListener } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material';
import { ConfirmationDailog } from '../usersdirectory/usersdirectory.component';
//import { FixedmenubarComponent } from 'src/app/share/components/fixedmenubar/fixedmenubar.component';
import { MapViewDailog } from './mapview/mapview.component';
import * as moment from 'moment';
import { PersonInchargepopupComponent } from './personIncharge.component ';
import { Equipmenttable } from './equipmenttable.component';
import { Batterytable } from './batterytable.component';
import { Chargertable } from './chargertable.component';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private assetprohelperService: AssetprohelperService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private modalService: NgbModal, public dialog: MatDialog, private _router: Router,location: Location) { }
  private serviceSubscription: Subscription;
 
 // @ViewChild('fixedmenubarComponent') fixedmenubarComponent: FixedmenubarComponent
  prodictivemenu: any = 'equipment';
  accidentmenu: any = 'assettype';
  siteidisget: any = '';
  siteName: string = 'All Sites';
  maintenancedoughnutchart: any;
  maintenancedoughnutchartEqualization: any;
  maintenancedoughnutchartEqualizationCharge: any;
  prodictivitylinechart: any;
  accidentslinechart: any;
  defaultshow = false;
  sitename = localStorage.getItem('sitename');
  siteId: string = ''
  overView: boolean = false;
  loader: boolean = false;
  loader_two: boolean = false;
  siteNameSort: boolean = false;
  UsageTimeSort: boolean = false;
  IdlingTime: boolean = false;
  MaintWeightage: boolean = false;
  AlarmWeightage: boolean = false;
  ComplianceWeightage: boolean = false;
  AdminName: boolean = false;
  Units:boolean=false;
  minDate: Date;
  maxDate: Date;
  tableName1='UsageTime'
  tableName2='Usage'
  tableName3='Usage'
  @ViewChild('doughnutChart') public doughnutChart;
  @ViewChild('doughnutChartEqualization') public doughnutChartEqualization;
  @ViewChild('doughnutChartEqualizationCharge') public doughnutChartEqualizationCharge;
  buttonByDefault: boolean = true;
  displayedColumns = ['SiteName','Units', 'UsageTime', 'IdlingTime', 'MaintWeightage', 'AlarmWeightage', 'ComplianceWeightage', 'AdminName'];
  displayedColumns2=['SiteName','Units','Usage','Idle','Alarms','Equalizations','Plugins','Personincharge']
  displayedColumns3=['SiteName','Units','Usage','KwhPerCharger','Faults','Equalizations','Personincharge']
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatSort2') sort2: MatSort;
  @ViewChild('MatSort3') sort3: MatSort;
  equipmentOverviewDatas2: any;
  equipmentOverviewColumn2: any[];
  popupAlarmDatas2: any;
  arrow1:boolean=true;
  arrow2:boolean=false;
  mapviewData2: any[];
  isAscendingOrder:boolean=false
  isAscendingOrderAccident: boolean=false;
  isAscendingOrderAlarm: boolean=false;
  isAscendingOrderAvg1: boolean=true;
  isAscendingOrderAvg2: boolean=true;
  isAscendingOrderTemp: boolean=true;
  isAscendingOrderECalarm: boolean=true;
  isAscendingOrderFaultcode: boolean=true;
  sortTable(data){
  this.tableName1=data.active
  }
  sortTable2(data){
   this.tableName2=data.active
   }
   sortTable3(data){
      this.tableName3=data.active
   }
  siteNameChange() {
    this.headerField = 'SiteName';
    this.siteNameSort = !this.siteNameSort
  }
  UsageTimeChange() {
    this.headerField = 'UsageTime';
    this.UsageTimeSort = !this.UsageTimeSort
  }
  IdlingTimeChange() {
    this.headerField = 'IdlingTime';
    this.IdlingTime = !this.IdlingTime
  }
  MaintWeightageChange() {
    this.headerField = 'MaintWeightage';
    this.MaintWeightage = !this.MaintWeightage
  }
  AlarmWeightageChange() {
    this.headerField = 'AlarmWeightage';
    this.AlarmWeightage = !this.AlarmWeightage
  }
  ComplianceWeightageChange() {
    this.headerField = 'ComplianceWeightage';
    this.ComplianceWeightage = !this.ComplianceWeightage
  }
  AdminNameChange() {
    this.headerField = 'AdminName';
    this.AdminName = !this.AdminName
  }
  unitsChange(){
    this.headerField = 'Units';
    this.Units = !this.Units
  }
  headerField: string = 'UsageTime'
  sortData(sort: Sort) {
    const data = this.stateOverviewDatas.slice();
    if (!sort.active || sort.direction === '') {
      this.stateOverviewDatas = data;
      //return;
    }

    this.stateOverviewDatas = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'SiteName': return this.compare(a.SiteName, b.SiteName, isAsc);
        case 'UsageTime': return this.compare(a.UsageTime, b.UsageTime, isAsc);
        case 'IdlingTime': return this.compare(a.IdlingTime, b.IdlingTime, isAsc);
        case 'MaintWeightage': return this.compare(a.MaintWeightage, b.MaintWeightage, isAsc);
        case 'AlarmWeightage': return this.compare(a.AlarmWeightage, b.AlarmWeightage, isAsc);
        case 'ComplianceWeightage': return this.compare(a.ComplianceWeightage, b.ComplianceWeightage, isAsc);
        case 'AdminName': return this.compare(a.AdminName, b.AdminName, isAsc);
        case 'Units': return this.compare(a.Units, b.Units, isAsc);
        default: return 0;
      }
    });
  }
  sortDataBatteries(sort: Sort) {
    const data = this.equipmentOverviewDatas.TableRecords.slice();
    if (!sort.active || sort.direction === '') {
      this.equipmentOverviewDatas.TableRecords = data;
      //return;
    }
    this.headertype2 = sort.direction
    this.equipmentOverviewDatas.TableRecords = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      let du = sort.active.replace(/\s+/g, '').toLowerCase();
      let ac = Object.keys(a);
      let col = ''
      ac.filter(data => { if (du == data.toLowerCase()) col = data });
      switch (col) {
        case col: return this.compare(a[col], b[col], isAsc);
        default: return 0;
      }
    });
  }
  sortDataBatteries2(sort: Sort) {
    const data = this.equipmentOverviewDatas2.TableRecords.slice();
    if (!sort.active || sort.direction === '') {
      this.equipmentOverviewDatas2.TableRecords = data;
      //return;
    }
    this.headertype3 = sort.direction
    this.equipmentOverviewDatas2.TableRecords = data.sort((a, b) => {
      const isAscdng = sort.direction === 'asc';
      let du = sort.active.replace(/\s+/g, '').toLowerCase();
      let ac = Object.keys(a);
      let col = ''
      ac.filter(data => { if (du == data.toLowerCase()) col = data });
      switch (col) {
        case col: return this.compare(a[col], b[col], isAscdng);
        default: return 0;
      }
    });
  }
  headerField2: string = 'Site Name'
  headerField3: string = 'Site Name'
  headertype2: string = 'asc';
  headertype3: string = 'asc';
  equipmentHeaderChange(data) {
    this.headerField2 = data;
    //this.siteNameSort = !this.siteNameSort
  }
  equipmentHeaderChange2(data) {
    this.headerField3 = data;
    //this.siteNameSort = !this.siteNameSort
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  ngOnDestroy() {
    // empty
  this.serviceSubscription.unsubscribe();
  // this.arrowUp=true;
  // this.arrowDown=false;
  // this.arrowUpAccident=true;
  // this.arrowDownAccident=false;
  this.arrowDownAlarm=false;
  this.isAscendingOrder=true;
  this.arrowUpAvg=true;
  this.arrowDownAvg=false;
  this.arrowUpHottest=true;
  this.arrowDownHottest=false;
  this.arrowDownMostAlarm=false;
  this.arrowUpMostAlarm=true;
  this.arrowUpAvgAH=true;
  this.arrowDownAvgAH=false;
  }
  maxScreen = false;
  
  // arrowUp:boolean=true;
  // arrowDown:boolean=false;
  // arrowUpAccident:boolean=true;
  // arrowDownAccident:boolean=false;
  arrowDownAlarm:boolean=false;
  // arrowUpAlarm:boolean=true;
  arrowUpAvg:boolean=true;
  arrowDownAvg:boolean=false;
  arrowUpHottest:boolean=true;
  arrowDownHottest:boolean=false;
  arrowDownMostAlarm:boolean=false;
  arrowUpMostAlarm:boolean=true;
  arrowUpAvgAH:boolean=true;
  arrowDownAvgAH:boolean=false;
  ngOnInit() {
    let value
  // this.arrowUp=true;
  // this.arrowDown=false;
  this.isAscendingOrder=true;
  // this.arrowDownAccident=false;
  this.arrowDownAlarm=false;
  this.isAscendingOrder=true;
  this.arrowUpAvg=true;
  this.arrowDownAvg=false;
  this.arrowUpHottest=true;
  this.arrowDownHottest=false;
  this.arrowDownMostAlarm=false;
  this.arrowUpMostAlarm=true;
  this.arrowUpAvgAH=true;
  this.arrowDownAvgAH=false;
    //this.doughnutchart([23, 7, 7, 3]);
    //this.prodictivitychart();
    //this.accidentschart();
    // if(this.arrow1==true){
    //   this.arrow2=false
    // }
    // else{
    //   this.arrow1=true
    // }
    this.siteId = '';
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 7);
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 2);
    this.minDate.setDate(1);
    this.dataSource.sort = this.sort;
    this.loadWidget(value);
    if (screen.availWidth >= 1920) {
      this.maxScreen = true;
    }
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe((data) => {
      this.siteName = this.siteidisget = localStorage.getItem('sitename'); 
    
        if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
          this.siteId = localStorage.getItem('selectitemId');
          this.overView = true;
          this.loadSingleSiteProd('WEEK', this.siteId);
          this.loadSingleSideAccident('WEEK', this.siteId);
        } else {
          this.siteId = '';
        }

        if (this.siteName != 'All Sites') {
          this.overView = true;

        } else {
          this.overView = false;
          this.stateOverview = 'MONTH';
          this.loadAllSitesStates(null);
        }
        this.prodictivemenu = 'equipment';
        this.prodictive = 'MOST PRODUCTIVE';
        this.typeProductive = null;
        this.maxProdictive = 0;
        this.productType = 'Equipment'
        this.filterType = 'WEEK';
        this.loadMostProdictive(null, 'Equipment', null);
        this.accident = 'MOST ACCIDENTS';
        this.accidenType = 'Assettype';
        this.maxAccidentCount = 0;
        this.loadAccidentProdictive('WEEK', null, null);
        this.mostAlaramsTYpe = 'MOST ALARMS'
        this.maxAlarmscount = 0;
        this.loadAlarmProdictive('WEEK', null);
        this.noMaintenceRecord = false;
        this.loadMaintenance('WEEK');
        this.communicationType = 'WEEK';
        this.loadCommunication('WEEK');
        this.filterType = 'THIS WEEK';
        this.loadBatteries('THIS WEEK');
        this.filterType = 'WEEK';
        this.loadSaftyComplaince('WEEK');
        this.editWidgetFlag = false;
        this.permissionLogic(data);
      })
  }
  siteidis(actualId,value) {
    this.assetprohelperService.callAgain(actualId.ID);
    return;
    this.cancelWidget(value)
    this.overView = true;
    this.siteId = this.siteidisget = actualId.ID;

    this.loadSingleSiteProd('WEEK', actualId.ID);
    this.loadSingleSideAccident('WEEK', actualId.ID);
    this.prodictivemenu = 'equipment';
    this.prodictive = 'MOST PRODUCTIVE';
    this.typeProductive = null;
    this.maxProdictive = 0;
    this.productType = 'Equipment'
    this.filterType = 'WEEK';
    this.loadMostProdictive(null, 'Equipment', null);
    this.accident = 'MOST ACCIDENTS';
    this.accidenType = 'Assettype';
    this.maxAccidentCount = 0;
    this.loadAccidentProdictive('WEEK', null, null);
    this.mostAlaramsTYpe = 'MOST ALARMS'
    this.maxAlarmscount = 0;
    this.loadAlarmProdictive('WEEK', null);
    this.noMaintenceRecord = false;
    this.loadMaintenance('WEEK');
    this.communicationType = 'WEEK';
    this.loadCommunication('WEEK');
    this.filterType = 'THIS WEEK';
    this.loadBatteries('THIS WEEK');
    this.filterType = 'WEEK';
    this.loadSaftyComplaince('WEEK');
    this.loadWidget(value);
    // this.fixedmenubarComponent.selectdropdownitem = actualId.SiteName;
    // this.fixedmenubarComponent.usersites.forEach(site => {
    //   if (site.Name == actualId.SiteName) {
    //     localStorage.setItem('siteLat', site.SiteLat);
    //     localStorage.setItem('siteLng', site.SiteLong);
    //     localStorage.setItem('selectitemId', actualId.ID);
    //     localStorage.setItem('sitename', actualId.SiteName);
    //     this.permissionLogic(site);
    //   }
    // });

  }
  permissionLogic(data) {
    this.batteriesEnable = false;
    this.chargesEnable = false;
    this.equipment = false;
    if (data && data.ServiceAndProduct.length > 0) {
      for (let i = 0; i < data.ServiceAndProduct.length; i++) {
        if (data.ServiceAndProduct[i].Status == 'Y') {
          if (data.ServiceAndProduct[i].UniqueKey == 'ULTIMATE' ||
            data.ServiceAndProduct[i].UniqueKey == 'ADVANCED' ||
            data.ServiceAndProduct[i].UniqueKey == 'VITAL') {
            this.equipment = true;
          }
          if (data.ServiceAndProduct[i].UniqueKey == 'CELLTRAC') {
            this.batteriesEnable = true;
          }
          if (data.ServiceAndProduct[i].UniqueKey == 'MOMENTUS' ||
            data.ServiceAndProduct[i].UniqueKey == 'ATLUS' ||
            data.ServiceAndProduct[i].UniqueKey == 'ATLUSPLUS') {
            this.chargesEnable = true;
          }
        }
      }
    }
    if(this.batteriesEnable || this.chargesEnable || this.equipment ){
      this.defaultshow = true;
    }
    this.loadBattChargesMethod();
  }
  batteriesEnable: boolean = false;
  chargesEnable: boolean = false;
  equipment: boolean = false;
  userDetails(data) {
    this.batteriesEnable = false;
    this.chargesEnable = false;
    this.equipment = false;

    if (data.AllsiteBatteries == 'Y') {
      this.batteriesEnable = true;
    }
    if (data.AllsiteChargers == 'Y') {
      this.chargesEnable = true;
    }
    if (data.AllsiteEquipments == 'Y') {
      this.equipment = true;
    }
    this.loadBattChargesMethod();
  }

  loadBattChargesMethod() {
    this.prodictivBatCharType = null;
    this.prodictivBatCharHottesType = null;
    this.prodictivEcAlarmType = null;
    this.filterType = 'WEEK';
    this.averages = 'MAX AVG STATE';
    this.averages2 = 'AVG AH TIME';
    this.typeAverage = null;
    this.maxAverage = 0;
    this.prodictivBatCharType = 'batteries'
    this.filterType = 'WEEK';
    this.hottests = 'MOST HOT BATTERY';
    this.typeHotest = null;
    this.maxHotest = 0;
    this.prodictivBatCharHottesType = 'batteries'
    this.filterType = 'WEEK';
    this.ecAlarms = 'MOST ALARMS';
    this.ecAlarms2 = 'MOST FAULT CODES';
    this.typeEcAlarm = null;
    this.maxEcAlarm = 0;
    this.prodictivEcAlarmType = 'batteries'
    this.maintenanceTypeEqualization = 'WEEK';
    this.equalizationRecord = false
    this.maintenanceTypeEqualizationCharge = 'WEEK';
    this.equalizationChargRecord = false
    this.filterType = 'WEEK';
    if (this.equipment) {
      this.loadMostProdictive(null, 'Equipment', null);
    } else if (this.batteriesEnable) {
      this.loadMostProdictive(null, 'Batteries', null);
    }
    if (this.batteriesEnable && this.chargesEnable) {
      this.loadMostAverage('WEEK', 'batteries', 'MAX AVG STATE');
      this.loadMostHottest('WEEK', null, null);
      this.loadMostEcAlarm('WEEK', null, 'MOST ALARMS');
      this.loadEqualization('WEEK');
      this.loadEqualizationCharge('WEEK');
      if (!this.overView) {
        this.loadAllSitesStatesForBattery('MONTH');
        this.loadAllSitesStatesChargerTable('MONTH');
      }

    } else if (this.batteriesEnable) {
      this.loadMostAverage('WEEK', 'batteries', 'MAX AVG STATE');
      this.loadMostHottest('WEEK', null, null);
      this.loadMostEcAlarm('WEEK', null, 'MOST ALARMS');
      this.loadEqualization('WEEK');
      if (!this.overView) {
        this.loadAllSitesStatesForBattery('MONTH');
        this.loadAllSitesStatesChargerTable('MONTH');
      }
    } else if (this.chargesEnable) {
      this.loadMostAverage('WEEK', 'charges', null);
      this.loadMostEcAlarm('WEEK', 'charges', null);
      this.loadEqualizationCharge('WEEK');
      if (!this.overView) {
        this.loadAllSitesStatesForBattery('MONTH');
        this.loadAllSitesStatesChargerTable('MONTH');
      }
    }
  }
  prodictivediv(menu) {
    this.prodictivemenu = menu;
    this.loadMostProdictive(null, menu, null);
  }
assetNavigation(data){
   
  localStorage.setItem('selectitemId', data.ID);
  //localStorage.setItem('siteLat', site.SiteLat);
  //localStorage.setItem('siteLng', site.SiteLong);
  localStorage.setItem('sitename', data.SiteName);
  //localStorage.setItem('siteUnique',site.UniqueID)
  this._router.navigate(['/home/asset']);
}
alarmNavigation(data){
  
  localStorage.setItem('selectitemId', data.ID);
  //localStorage.setItem('siteLat', site.SiteLat);
  //localStorage.setItem('siteLng', site.SiteLong);
  localStorage.setItem('sitename', data.SiteName);
  //localStorage.setItem('siteUnique',site.UniqueID)
  this._router.navigate(['/home/notification']);
  
}
complainceNavigation(data){
  
  localStorage.setItem('selectitemId', data.ID);
  //localStorage.setItem('siteLat', site.SiteLat);
  //localStorage.setItem('siteLng', site.SiteLong);
  localStorage.setItem('sitename', data.SiteName);
  //localStorage.setItem('siteUnique',site.UniqueID)
  this._router.navigate(['/home/reports']);
  
}
  accidentdiv(menu) {
    if (this.accidentmenu == menu) return;
    this.accidentmenu = menu;
    this.loadAccidentProdictive(this.filterType, null, null);
  }

  // Doughnut Chart - Maintenance
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.maintenancedoughnutchart) {
      if (this.previsousData != undefined && this.previsousData.length != 0) {
        if (event.target.outerWidth <= 450) {
          this.doughnutchart(this.previsousData, event.target.outerWidth);
        } else
          this.doughnutchart(this.previsousData, event.target.outerWidth);
      }
      if (this.batteriesEnable)
        this.doughnutchartEqualization(this.previsousDataEqualization, event.target.outerWidth);
    }
    if (this.chargesEnable) {
      this.doughnutchartEqualizationCharge(this.previsousDataEqualizationCharges, null);
    }
  }
  previsousData = []
  doughnutchart(parameter, device) {
    let position = 'right';
    let paddingRunTime = 14;
    let labelFont = 12
    if (screen.availWidth >= 1920) {
      paddingRunTime = 26;
      labelFont = 15
    }
    if (device != null) {
      if (device <= 990) {
        paddingRunTime = 10;
        labelFont = 11
        position = 'right'
      }
      else if (device <= 1160) {
        paddingRunTime = 10;
        labelFont = 11
        position = 'bottom'
      }
    }
    if (screen.availWidth <= 990) {
      paddingRunTime = 10;
      labelFont = 11
      position = 'right'
    }
    else if (screen.availWidth <= 1160) {
      paddingRunTime = 10;
      labelFont = 11
      position = 'bottom'
    }

    this.previsousData = parameter;
    if (this.doughnutChart == undefined) return
    if (this.doughnutChart.nativeElement == undefined) return
    if (this.maintenancedoughnutchart) this.maintenancedoughnutchart.destroy();
    this.maintenancedoughnutchart = new Chart(this.doughnutChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [ "Under PM","Upcoming", "Complete","Overdue"],
        datasets: [
          {
            label: "Maintenance",
            backgroundColor: ["#ffff73","#736AFF", "#90EE90", "#EA4256"],
            data: parameter,
            fill: false

          }
        ]
      },
      options: {
        cutoutPercentage: 70,
        plugins: {
          labels: {
            render: 'value',
            fontSize: 12,
            fontColor: '#fff',
            fontStyle: 'normal',
            fontFamily: "robotoregular",
            fontWeight: "bold",
            fontStretch: "condensed"
          }
        },
        legend: {
          display: true,
          position: position,
          labels: {
            fontSize: labelFont,
            fontColor: '#4a4a4a',
            padding: paddingRunTime,  //space between labels
            usePointStyle: true, //Border radius
            boxWidth: 15  //Box width
          }
        },
        layout: {
          padding: 5
        },
        title: {
          fontColor: '#4a4a4a',
          fontSize: 18,
          display: false,
          text: 'Maintenance'
        }
      }
    });

  }

  // Line Chart 1 - Prodictivity
  prodictivitychart() {
    let chart = "#169bd722";
    // gradientStroke = chart.createLinearGradient(500, 0, 100, 0);
    // gradientStroke.addColorStop(0, "#80b6f4");
    // gradientStroke.addColorStop(1, "#f49080");
    if (this.prodictivitylinechart) this.prodictivitylinechart.destroy();
    this.prodictivitylinechart = new Chart('lineChart1', {
      type: 'line',
      data: {
        "labels": ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        "datasets": [{
          //"label": "Body Weight Lost",
          "data": [60, 70, 60, 60],
          "borderColor": "#169bd7",
          "backgroundColor": chart,
          "lineTension": 0,
          "borderWidth": 1,
          "fill": true
        },
        {
          //"label": "Body Weight Lost",
          "data": [20, 40, 40, 70, 70, 60, 70],
          "borderColor": "#e8e8e8",
          "backgroundColor": "#e8e8e822",
          "lineTension": 0,
          "borderWidth": 1,
          "fill": true
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
          yAxes: [{
            // stacked: true,  // value line doubled
            ticks: {
              fontSize: 10,
              fontColor: "#1d3d57",
              fontFamily: "robotoregular",
              beginAtZero: true,
              min: 0,
              max: 100,
              stepSize: 10
            },
            scaleLabel: {
              display: false,
            },
            gridLines: {
              display: false
            }
          }],
          xAxes: [{
            ticks: {
              fontSize: 9,
              fontColor: "#1d3d57",
              fontFamily: "robotoregular",
            },
            scaleLabel: {
              display: false,
            },
            gridLines: {
              display: false
            }
          }]
        }
      }
    });
  }

  // Line Chart 2 - Accidents
  accidentschart() {
    if (this.accidentslinechart) this.accidentslinechart.destroy();
    this.accidentslinechart = new Chart('lineChart2', {
      type: 'line',
      data: {
        "labels": ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        "datasets": [{
          //"label": "Body Weight Lost",
          "data": [30, 10, 30, 30],
          "borderColor": "#ff1c00",
          "backgroundColor": "#ff1c0022",
          "lineTension": 0,
          "borderWidth": 1,
          "fill": true
        },
        {
          //"label": "Body Weight Lost",
          "data": [13, 20, 20, 30, 30, 27, 30],
          "borderColor": "#e8e8e8",
          "backgroundColor": "#e8e8e822",
          "lineTension": 0,
          "borderWidth": 1,
          "fill": true
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
          yAxes: [{
            // stacked: true,  // value line doubled
            ticks: {
              fontSize: 10,
              fontColor: "#1d3d57",
              fontFamily: "robotoregular",
              beginAtZero: true,
              min: 0,
              max: 40,
              stepSize: 10
            },
            scaleLabel: {
              display: false,
            },
            gridLines: {
              display: false
            }
          }],
          xAxes: [{
            ticks: {
              fontSize: 9,
              fontColor: "#1d3d57",
              fontFamily: "robotoregular",
            },
            scaleLabel: {
              display: false,
            },
            gridLines: {
              display: false
            }
          }]
        }
      }
    });
  }
  /** OVERVIEW SITE FUNCTION*/
  stateOverviewDatas = []
  stateOverview = 'MONTH';
  stateOverviewType = ['MONTH', 'PREVIOUS MONTH', 'LAST THREE MONTHS']
  loadAllSitesStates(value) {
    try {
      this.tableName1='UsageTime'
      this.showcritical = false
      let monthType = 'current_month';
      if (value != null) {
        this.stateOverview = value;
      }
      if (value == 'MONTH')
        this.stateOverview = value;
      else if (value == 'PREVIOUS MONTH') {
        monthType = 'previous_month';
      } else if (value == 'LAST THREE MONTHS') {
        monthType = 'last_3_months';
      }

      // if (this.batteriesEnable && this.chargesEnable) {
      //   this.loadAllSitesStatesForEquipment(this.stateOverview);
      //   this.loadAllSitesStatesForEquipment2(this.stateOverview)
      // }
       if (this.batteriesEnable) {
        this.loadAllSitesStatesForBattery(this.stateOverview);
      } 
       if (this.chargesEnable) {
        this.loadAllSitesStatesChargerTable(this.stateOverview);
      }
      this.loader = true;
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(this.stateOverview);
      this.assetprohelperService.PostMethod('Dashboard/AllSitesStats', {
        "Month": monthType,
        "EndDate": endYear + '-' + endMonth + '-' + endDate,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
      }).subscribe(data => {
        try {
          this.loader = false;
          let body = data.json();
          if (body.Status) {
            this.stateOverviewDatas = body.Data;
            this.dataSource.data=body.Data.slice(0,5);
            this.dataSource.sort = this.sort;
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }

      });
    } catch (exception) {
      console.log(exception);
    }
  }
  /** OVERVIEW SITE FUNCTION*/
  equipmentOverviewDatas: any = []
  equipmentOverviewColumn: any = []
  equipmentOverview = 'MONTH';
  equipmentOverviewType = ['MONTH', 'PREVIOUS MONTH', 'LAST THREE MONTHS']
  mapviewData = []
   loadAllSitesStatesForBattery(value) {
    try {
      if (this.loader_two) {
        return;
      }
    this.tableName2='Usage'
  
      // this.apiloaded=true;
      this.showcritical = false
      let monthType = 'current_month';
      if (value != null) {
        this.equipmentOverview = value;
      }
      if (value == 'MONTH')
        this.equipmentOverview = value;
      else if (value == 'PREVIOUS MONTH') {
        monthType = 'previous_month';
      } else if (value == 'LAST THREE MONTHS') {
        monthType = 'last_3_months';
      }

      this.loader_two = true;
      let parentBattery = this.mapViewEnable
      this.mapViewEnable = false
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      //this.equipmentOverviewColumn = []
     // this.equipmentOverviewDatas = []
      //this.equipmentOverviewColumn = []
      this.mapviewData = []
      this.assetprohelperService.PostMethod('Dashboard/AllSitesBatteriesMainTable', {
        "Month": monthType,
        "EndDate": endYear + '-' + endMonth + '-' + endDate,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
      }).subscribe(data => {
        this.equipmentOverviewColumn = []
        this.equipmentOverviewDatas = []
        this.equipmentOverviewColumn = []
        this.loader_two = false;
        let body: any = data.json();
        if (body.Status) {
          this.equipmentOverviewDatas = body.Data;
          if (this.equipmentOverviewDatas != null && this.equipmentOverviewDatas != undefined && this.equipmentOverviewDatas != '' && this.equipmentOverviewDatas.length != 0 && this.equipmentOverviewDatas.TableRecords.length != 0) {
            let data = Object.keys(this.equipmentOverviewDatas.TableRecords[0])
            data.forEach(a => {
              if (a != 'ID' && a != 'AdminID' && a != 'IdlingBatteries' && a != 'BatteryCharged' && a != 'AdminName' && a != 'AdminID'
                && a != 'TotalHourCharged' && a != 'BatteryDischarged' && a != 'IdlingChargers' && a != 'Lon' && a != 'Lat' && a != 'ColorCode' && a != 'LastSeenStateUnit1'
                && a != 'LastUpdateDate' && a != 'LastUpdateTime' && a != 'PreIdlingTime')
                this.equipmentOverviewColumn.push(a);
            });
            this.mapviewData = body.Data.TableHeadings
            this.mapViewEnable = parentBattery
            this.dataSource2.data=this.equipmentOverviewDatas.TableRecords.slice(0,5);
            this.dataSource2.sort = this.sort2;
          }
        } else {

        }
        //console.log(this.stateOverviewDatas);
      }, error => {
        this.loader_two = false;
        console.log(error)
      });
    } catch (exception) {
      this.loader_two = false;
      console.log(exception);
    }
  }
  loadAllSitesStatesChargerTable(value) {
    try {
      if (this.loader3) {
        return;
      }
      this.tableName3='Usage'
      this.showcritical = false
      let monthType = 'current_month';
      if (value != null) {
        this.equipmentOverview = value;
      }
      if (value == 'MONTH')
        this.equipmentOverview = value;
      else if (value == 'PREVIOUS MONTH') {
        monthType = 'previous_month';
      } else if (value == 'LAST THREE MONTHS') {
        monthType = 'last_3_months';
      }

      this.loader3 = true;
      let parentBattery = this.mapViewEnable
      this.mapViewEnable = false
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      //this.equipmentOverviewColumn2 = []
      //this.equipmentOverviewDatas = []
     // this.equipmentOverviewColumn2 = []
      this.mapviewData2 = []
      this.assetprohelperService.PostMethod('Dashboard/AllSitesChargersMainTable', {
        "Month": monthType,
        "EndDate": endYear + '-' + endMonth + '-' + endDate,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
      }).subscribe(data => {
        this.equipmentOverviewColumn2 = []
        this.equipmentOverviewDatas2 = []
        this.equipmentOverviewColumn2 = []
        this.loader3 = false;
        let body: any = data.json();
        if (body.Status) {
          this.equipmentOverviewDatas2 = body.Data;
          if (this.equipmentOverviewDatas2 != null && this.equipmentOverviewDatas2 != undefined && this.equipmentOverviewDatas2 != '' && this.equipmentOverviewDatas2.length != 0 && this.equipmentOverviewDatas2.TableRecords.length != 0) {
            let data = Object.keys(this.equipmentOverviewDatas2.TableRecords[0])
            data.forEach(a => {
              if (a != 'ID' && a != 'AdminID' && a != 'IdlingBatteries' && a != 'BatteryCharged' && a != 'AdminName' && a != 'AdminID'
                && a != 'TotalHourCharged' && a != 'BatteryDischarged' && a != 'IdlingChargers' && a != 'Lon' && a != 'Lat' && a != 'ColorCode' && a != 'LastSeenStateUnit1'
                && a != 'LastUpdateDate' && a != 'LastUpdateTime' && a != 'PreIdlingTime')
                this.equipmentOverviewColumn2.push(a);
            });
            this.mapviewData2 = body.Data.TableHeadings
            this.mapViewEnable = parentBattery
            this.dataSource3.data=this.equipmentOverviewDatas2.TableRecords.slice(0,5);
            this.dataSource3.sort = this.sort3;
          }
        } else {

        }
        //console.log(this.stateOverviewDatas);
      }, error => {
        this.loader3 = false;
        console.log(error)
      });
    } catch (exception) {
       this.loader3 = false;
      console.log(exception);
    }
  }
  
  /** MOST PRODUCTIVITY FUNCTION*/
  mostProdictiveDatas = []
  filterType = 'WEEK';
  filterTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  prodictiveType = ['MOST PRODUCTIVE', 'LEAST PRODUCTIVE']
  prodictive = 'MOST PRODUCTIVE';
  typeProductive = null;
  maxProdictive = 0;
  productType = 'Equipment';
  loadFilter(value){
    this.averages='MAX AVG STATE'
    this.averages2 = 'AVG AH TIME';
    this.ecAlarms = 'MOST ALARMS';
    this.ecAlarms2 = 'MOST FAULT CODES';
    try{
     if(this.equipment && this.batteriesEnable){
        this.loadMostProdictive(value,this.productType ,'MOST PRODUCTIVE')
        this.loadAccidentProdictive(value, null, 'MOST ACCIDENTS')
        this.loadAlarmProdictive(value, 'MOST ALARMS')
        this.loadSaftyComplaince(value)      
        this.loadSingleSiteProd(value, this.siteId)
        this.loadSingleSideAccident(value, this.siteId)
        this.loadMostHottest(value, this.prodictivBatCharHottesType, 'MOST HOT BATTERY')
     }
     
    else if(this.equipment){
      this.loadMostProdictive(value,'Equipment' ,'MOST PRODUCTIVE')
      this.loadAccidentProdictive(value, null, 'MOST ACCIDENTS')
      this.loadAlarmProdictive(value, 'MOST ALARMS')
      this.loadSaftyComplaince(value)      
      this.loadSingleSiteProd(value, this.siteId)
      this.loadSingleSideAccident(value, this.siteId)
    }
    else if(this.batteriesEnable){
      this.loadMostProdictive(value,'Batteries' ,'MOST PRODUCTIVE')
      this.loadMostAverage(value, this.prodictivBatCharType,'MAX AVG STATE')
      this.loadMostHottest(value, this.prodictivBatCharHottesType, 'MOST HOT BATTERY')
      this.loadMostEcAlarm(value,  this.prodictivEcAlarmType,'MOST ALARMS')
      this.loadBatteries(value)
    }
    else if(this.chargesEnable){
      this.loadMostAverage(value, this.prodictivBatCharType,'AVG AH TIME')
      this.loadMostEcAlarm(value,  this.prodictivEcAlarmType,'MOST FAULT CODES')
    } 
    if(this.batteriesEnable && this.chargesEnable){
      this.loadMostAverage(value, this.prodictivBatCharType,null)
      this.loadMostEcAlarm(value,  this.prodictivEcAlarmType,null)
    }
    }
    catch(filterError){
      console.log(filterError)
    }
  }
  loadMost:boolean=false;
  loadMostProdictive(value, type, value2) {
    if(this.loadMost){
      return;
    }
    try {
      if (value != null) {
        this.filterType = value;
      }
      if (type != null && type != undefined) {
        if (type != 'Equipment') {
          this.productType = 'Batteries'
        } else {
          this.productType = 'Equipment'
        }
       // if (this.prodictivemenu == type && value != null) return;
        this.prodictivemenu = type
      }
      //  if(this.prodictive==value2){
      //    return;
      //  }
      if (this.prodictivemenu == null) {
        this.prodictivemenu = 'Equipment'
      }

      if (value2 != null) {
        //if (this.prodictive == value2) return;
        this.prodictive = value2;
      //  this.mostProdictiveDatas.reverse();
      //  return;
      }
      if (type != null) {
        this.typeProductive = type;
      }
      let product = 'Equipment';
      if (type == 'Batteries') {
        product = 'Batteries';
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let url = 'AllSitesProductive';
      let parameter = {
        "Product": this.productType,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      };

      let parameter2 = {
        "Product": this.productType,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate, "SiteID": this.siteId
      };

      if (this.overView) {
        url = 'SingleSiteProductive';
        parameter = parameter2;
      }
      this.loadMost = true;
      //this.mostProdictiveDatas = []
      this.assetprohelperService.PostMethod('Dashboard/' + url, parameter).subscribe(data => {

        try {
          this.loadMost = false;
          let body = data.json();
          if (body.Status) {
            this.mostProdictiveDatas = body.Data;
            let count = 0;
            this.mostProdictiveDatas.forEach(a => {
              if (a.MostProductive > count) {
                count = a.MostProductive;
              }
            });
            this.maxProdictive = count;

            this.mostProdictiveDatas.forEach(a => {
              if (a.MostProductive == undefined || a.MostProductive == '' || a.MostProductive == 0) {
                a.MostProductive = 0;
                a.range = 0;
              } else {
                a.range = Math.round((a.MostProductive / count) * 100)
              }

            });
            //  console.log(this.mostProdictiveDatas);
            if (this.prodictive == 'LEAST PRODUCTIVE')
              this.mostProdictiveDatas.reverse();

          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          this.loadMost=false
          console.log(apierror)
        }
      });
    } catch (exception) {
      this.loadMost=false
      console.log(exception);
    }
  }
  mostAccidentDatas = []
  // filterType = 'WEEK';
  // filterTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  accidenTypeList = ['MOST ACCIDENTS', 'LEAST ACCIDENTS']
  accident = 'MOST ACCIDENTS';
  accidenType = 'Assettype';
  maxAccidentCount = 0;
  loadAccident:boolean=false;
  loadAccidentProdictive(value, type, accidentType) {
      //this.accidentmenu == 'assettype';
    this.accidenType = 'Assettype';
  
    //  this.isAscendingOrder=!this.isAscendingOrder;
    //  this.arrowDownAccident=!this.arrowDownAccident
    try {
      if (value != null) {
        this.filterType = value;
      }
      if (type != null && type != undefined) {
        this.accidenType = type;
      } else {
        this.accidenType = "Operator";
      }
      if (accidentType != null) {
        this.accident = accidentType
      }
      if (type != null && type != undefined) {
        // if (this.accident == type) return;
        this.accident = type
        //this.accidentmenu = type;
       // this.mostAccidentDatas.reverse();
       // return;
      }
      if (this.accidenType == null) {
        this.accidenType = 'Assettype'
      }

      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let parameter = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      };
      let url = 'AllSitesAccident';
      let types = 'AssetType'
      if (this.accidentmenu == 'operator') {
        types = 'Operator'
      }
      let parameter2 = {
        "Type": types,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate, "SiteID": this.siteId
      };

      if (this.siteId != undefined && this.siteId != '') {
        url = 'SingleSiteAccident';
        parameter = parameter2;
      }
      this.loadAccident = true;
      //this.mostAccidentDatas = []
      this.assetprohelperService.PostMethod('Dashboard/' + url, parameter).subscribe(response => {
        try {
          this.loadAccident = false;
          let body = response.json();
          if (body.Status) {
            this.mostAccidentDatas = body.Data;
            let count = 0;
            this.mostAccidentDatas.forEach(a => {
              if (a.Impact > count) {
                count = a.Impact;
              }
            });
            this.maxAccidentCount = count;
            this.mostAccidentDatas.forEach(a => {
              if (a.HighImpact == undefined || a.HighImpact == '' || a.HighImpact == 0) {
                a.range = 0;
              } else {
                a.range = Math.round((a.HighImpact / a.Impact) * 100)
              }

            });
            //Math.round((25/109)*100)
            // console.log(this.mostAccidentDatas);
            if (this.accident == 'LEAST ACCIDENTS')
              this.mostAccidentDatas.reverse();
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }

      });
    } catch (exception) {
      console.log(exception);
    }
  }
  mostAlarmDatas = []
  // filterType = 'WEEK';
  // filterTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  mostAlarams = ['MOST ALARMS', 'LEAST ALARMS']
  mostAlaramsTYpe = 'MOST ALARMS'
  maxAlarmscount = 0;
  loadAlarm:boolean=false;
  loadAlarmProdictive(value, parameters) {
    // if(!isTabChange){
    //   this.isAscendingOrderAlarm = !this.isAscendingOrderAlarm;
    // }
    // if(this.isAscendingOrderAlarm){
    //   this.mostAlaramsTYpe='LEAST ALARMS'
    //  }
    //  else{
    //   this.mostAlaramsTYpe='MOST ALARMS'
    //  }
    //  this.isAscendingOrder=!this.isAscendingOrder;
    //  this.arrowDownAlarm=!this.arrowDownAlarm
    try {
      if (value != null) {
        this.filterType = value;
      }
      if (parameters != null) {
        // if (this.mostAlaramsTYpe == parameters) return;

        this.mostAlaramsTYpe = parameters;
      //  this.mostAlarmDatas.reverse();
       // return;
      }
      if (this.mostAlaramsTYpe == null) {
        this.mostAlaramsTYpe = 'MOST ALARMS'
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let url = 'AllSitesAlarm';
      let parameter = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      };

      let parameter2 = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate, "SiteID": this.siteId
      };

      if (this.siteId != undefined && this.siteId != '') {
        url = 'SingleSiteAlarm';
        parameter = parameter2;
      }
      this.loadAlarm = true;
     // this.mostAlarmDatas = []
      this.assetprohelperService.PostMethod('Dashboard/' + url, parameter).subscribe(response => {

        try {
          this.loadAlarm = false;
          let body = response.json();
          if (body.Status) {
            this.mostAlarmDatas = body.Data;
            let count = 0;
            this.mostAlarmDatas.forEach(a => {
              if (a.Actioned > count) {
                count = a.Actioned;
              }
              if (a.Unactioned > count) {
                count = a.Unactioned;
              }
            });
            this.maxAlarmscount = count;
            this.mostAlarmDatas.forEach(a => {
              if ((a.Actioned == undefined || a.Actioned == '' || a.Actioned == 0) && (a.Unactioned == undefined || a.Unactioned == '' || a.Unactioned == 0)) {
                a.range = 0;
              } else {
                let actTotal = a.Actioned == 0 ? 1 : (a.Actioned + a.Unactioned)
                a.range = Math.round(((a.Unactioned) / (actTotal)) * 100)
              }

            });
            if (this.mostAlaramsTYpe == 'LEAST ALARMS') {
              this.mostAlarmDatas.reverse();
            }
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }

      });
    } catch (exception) {
      console.log(exception);
    }
  }
  saftyComplainceDatas = []
  
  fromDateSafty: string = '';
  toDateSafty: string = '';
  saftyFromDate: Date;
  saftyToDate: Date;
  saftyComplaDateChoose(val) {
    this.saftyFromDate = val.value;
    this.saftyToDate = new Date(val.value);
    this.saftyToDate.setDate(this.saftyToDate.getDate() + 6);
    let fromDat = this.saftyFromDate.toString().split(' ');
    this.fromDateSafty = fromDat[1] + ',' + fromDat[2]
    let endDat = this.saftyToDate.toString().split(' ');
    this.toDateSafty = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.saftyFromDate, this.saftyToDate)
    this.saftyResponce(fromDate, toDate);
  }
  saftyComArrow(type) {
    if (type == 'left') {
      let to = new Date();
      to.setMonth(to.getMonth() - 3);
      if (this.saftyFromDate.toDateString() == to.toDateString()) {
        return;
      }
      this.saftyFromDate.setDate(this.saftyFromDate.getDate() - 1);
      this.saftyToDate.setDate(this.saftyToDate.getDate() - 1);
    } else {
      if (this.saftyToDate.toDateString() == new Date().toDateString()) {
        return;
      }
      this.saftyFromDate.setDate(this.saftyFromDate.getDate() + 1);
      this.saftyToDate.setDate(this.saftyToDate.getDate() + 1);
    }
    let fromDat = this.saftyFromDate.toString().split(' ');
    this.fromDateSafty = fromDat[1] + ',' + fromDat[2]
    let endDat = this.saftyToDate.toString().split(' ');
    this.toDateSafty = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.saftyFromDate, this.saftyToDate)
    this.saftyResponce(fromDate, toDate);
  }
  loadSafty:boolean=false;;
  loadSaftyComplaince(value) {
    try {
      if (value != null) {
        this.filterType = value;
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      let fromD = startDates.toString().split(' ');
      let endDat = endDates.toString().split(' ');
      this.fromDateSafty = fromD[1] + ',' + startDate
      this.toDateSafty = endDat[1] + ',' + endDat[2];
      this.saftyFromDate = new Date(startYear + '-' + startMonth + '-' + startDate)
      this.saftyToDate = new Date(endYear + '-' + endMonth + '-' + endDate);
      this.saftyResponce(startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);
    } catch (exception) {
      console.log(exception);
    }
  }
  saftyResponce(fromDate, toDate) {
    this.loadSafty = true;
    let url = 'Dashboard/AllSitesSafety'
    let body: any = {
      "StartDate": fromDate,
      "EndDate": toDate
    }
    if (this.overView) {
      body.SiteID = this.siteId
      url = 'Dashboard/SingleSiteSafety'
    }
    this.assetprohelperService.PostMethod(url, body).subscribe(response => {
      try {
        this.loadSafty = false;
        let body = response.json();
        if (body.Status) {
          this.saftyComplainceDatas = body.Data;
          if (this.saftyComplainceDatas.length > 0)
            this.saftyComplainceDatas = this.saftyComplainceDatas[0]
          //console.log(this.saftyComplainceDatas);       
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (apierror) {
        console.log(apierror)
      }

    });
  }

  maintenanceDatas = []
  maintenanceType = 'WEEK';
  maintenanceTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  noMaintenceRecord: boolean = false;
  loadMaintenan:boolean=false;
  loadMaintenance(value) {
    try {
      if (value != null) {
        this.maintenanceType = value;
      }

      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      this.loadMaintenan = true;
      let url = 'Dashboard/AllSitesMaintenance'
      let body: any = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }
      if (this.overView) {
        body.SiteID = this.siteId
        url = 'Dashboard/SingleSiteMaintenance'
      }
      let parent = this;
      this.assetprohelperService.PostMethod(url, body).subscribe(response => {
        try {
          this.loadMaintenan = false;
          let body = response.json();
          if (body.Status) {
            this.maintenanceDatas = body.Data;
            let chartDatas = []
            let tempData;
            if (this.maintenanceDatas.length > 0) {
              this.maintenanceDatas = this.maintenanceDatas;
              tempData = this.maintenanceDatas[0];
              chartDatas.push(tempData.InMaintenance);
              chartDatas.push(tempData.Upcoming);
              chartDatas.push(tempData.Completed);
              chartDatas.push(tempData.Overdue);
              
              if (tempData.Completed == 0 && tempData.InMaintenance == 0 && tempData.Overdue == 0 && tempData.Upcoming == 0) {
                this.noMaintenceRecord = true;
              } else {
                this.noMaintenceRecord = false;
              }
            }
            this.maintenanceDatas = chartDatas;
            setTimeout(() => {
              parent.doughnutchart(chartDatas, null);
            }, 200);
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }


      });
    } catch (exception) {

      console.log(exception);
    }
  }

  batteriesDatas = []
  fromDateBatter: string = '';
  toDateBatter: string = '';
  battFromDate: Date;
  battToDate: Date;
  batteriesComplaDateChoose(val) {
    this.battFromDate = val.value;
    this.battToDate = new Date(val.value);
    this.battToDate.setDate(this.battToDate.getDate() + 6);
    let fromDat = this.battFromDate.toString().split(' ');
    this.fromDateBatter = fromDat[1] + ',' + fromDat[2]
    let endDat = this.battToDate.toString().split(' ');
    this.toDateBatter = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.battFromDate, this.battToDate)
    this.batteriesResponce(fromDate, toDate);
  }
  batteriesComArrow(type) {
    if (type == 'left') {
      let to = new Date();
      to.setMonth(to.getMonth() - 3);
      if (this.battFromDate.toDateString() == to.toDateString()) {
        return;
      }
      this.battFromDate.setDate(this.battFromDate.getDate() - 1);
      this.battToDate.setDate(this.battToDate.getDate() - 1);
    } else {
      if (this.battToDate.toDateString() == new Date().toDateString()) {
        return;
      }
      this.battFromDate.setDate(this.battFromDate.getDate() + 1);
      this.battToDate.setDate(this.battToDate.getDate() + 1);
    }
    let fromDat = this.battFromDate.toString().split(' ');
    this.fromDateBatter = fromDat[1] + ',' + fromDat[2]
    let endDat = this.battToDate.toString().split(' ');
    this.toDateBatter = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.battFromDate, this.battToDate)
    this.batteriesResponce(fromDate, toDate);
  }
loadBatt:boolean=false;
  loadBatteries(value) {
    try {
      if (value != null) {
        this.filterType = value;
      }
      if (value == 'THIS WEEK') {
        value = 'WEEK'
      } else if (value == 'PAST 2 WEEKS') {
        value = 'PAST 2 WEEKS'
      } else if (value == 'THIS MONTH') {
        value = 'MONTH'
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let fromD = startDates.toString().split(' ');
      let endDat = endDates.toString().split(' ');
      this.fromDateBatter = fromD[1] + ',' + startDate
      this.toDateBatter = endDat[1] + ',' + endDat[2];
      this.battFromDate = new Date(startYear + '-' + startMonth + '-' + startDate)
      this.battToDate = new Date(endYear + '-' + endMonth + '-' + endDate);
      this.batteriesResponce(startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);
    } catch (exception) {
      console.log(exception);
    }
  }
  batteriesResponce(startDate, EndDate) {
    this.loadBatt = true;
    let url = 'Dashboard/AllSitesBatteries'
    let body: any = {
      "StartDate": startDate,
      "EndDate": EndDate
    }
    if (this.overView) {
      body.SiteID = this.siteId
      url = 'Dashboard/SingleSiteBatteries'
    }
    this.assetprohelperService.PostMethod(url, body).subscribe(response => {
      try {
        this.loadBatt = false;
        let body = response.json();
        if (body.Status) {
          this.batteriesDatas = body.Data;
          if (this.batteriesDatas.length > 0)
            this.batteriesDatas = this.batteriesDatas[0];
          // console.log(this.batteriesDatas);        
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (apierror) {
        console.log(apierror)
      }

    });
  }
  communicationDatas: any
  communicationType = 'WEEK';
  communicationTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  loadCommunicati:boolean=false;
  loadCommunication(value) {
    try {
      if (value != null) {
        this.communicationType = value;
      }

      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      this.loadCommunicati = true;
      let url = 'Dashboard/AllSitesCommunication'
      let body: any = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }
      if (this.overView) {
        body.SiteID = this.siteId
        url = 'Dashboard/SingleSiteCommunication'
      }
      this.assetprohelperService.PostMethod(url, body).subscribe(data => {
        this.loadCommunicati = false;
        try {
          let body = data.json();
          if (body.Status) {
            this.communicationDatas = body.Data;
            if (this.communicationDatas.length > 0) {
              this.communicationDatas = this.communicationDatas[0];
              if (this.communicationDatas.OutOfRange == null || this.communicationDatas.OutOfRange == undefined || this.communicationDatas.OutOfRange == '') {
                this.communicationDatas.OutOfRange = 0
              }
              if (this.communicationDatas.OverAllAssests == null || this.communicationDatas.OverAllAssests == undefined || this.communicationDatas.OverAllAssests == '') {
                this.communicationDatas.OverAllAssests = 0
              }
            }
            else {
              this.communicationDatas.OutOfRange = 0
              this.communicationDatas.OverAllAssests = 0
            }
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }

        //console.log(this.communicationDatas);
      });
    } catch (exception) {
      console.log(exception);
    }
  }
  singleSiteProdDatas = []
  // filterType = 'WEEK';
  // filterTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  fromDateProd: string = '';
  toDateProd: string = '';
  proFromDate: Date;
  proToDate: Date;
  prodDateChoose(val) {
    this.filterType = 'WEEK'
    this.proFromDate = val.value;
    this.proToDate = new Date(val.value);
    this.proToDate.setDate(this.proToDate.getDate() + 6);
    let fromDat = this.proFromDate.toString().split(' ');
    this.fromDateProd = fromDat[1] + ',' + fromDat[2]
    let endDat = this.proToDate.toString().split(' ');
    this.toDateProd = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.proFromDate, this.proToDate)
    this.proReponce(this.siteId, fromDate, toDate);
  }
  productionArrow(type) {
    if (type == 'left') {
      let to = new Date();
      to.setMonth(to.getMonth() - 3);
      if (this.proFromDate.toDateString() == to.toDateString()) {
        return;
      }
      this.proFromDate.setDate(this.proFromDate.getDate() - 1);
      this.proToDate.setDate(this.proToDate.getDate() - 1);
    } else {
      if (this.proToDate.toDateString() == new Date().toDateString()) {
        return;
      }
      this.proFromDate.setDate(this.proFromDate.getDate() + 1);
      this.proToDate.setDate(this.proToDate.getDate() + 1);
    }
    let fromDat = this.proFromDate.toString().split(' ');
    this.fromDateProd = fromDat[1] + ',' + fromDat[2]
    let endDat = this.proToDate.toString().split(' ');
    this.toDateProd = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.proFromDate, this.proToDate)
    this.proReponce(this.siteId, fromDate, toDate);
  }
  getDateFormat(v1: Date, v2: Date) {
    let startDate = '' + v1.getDate();
    let startMonth = '' + (v1.getMonth() + 1);
    let endMonth = '' + (v2.getMonth() + 1);
    let endDate = '' + v2.getDate();
    if (parseInt(startMonth) < 10) {
      startMonth = '0' + startMonth;
    }
    if (parseInt(startDate) < 10) {
      startDate = '0' + startDate;
    }
    if (parseInt(endMonth) < 10) {
      endMonth = '0' + endMonth;
    }
    if (parseInt(endDate) < 10) {
      endDate = '0' + endDate;
    }
    let fromDate = v1.getFullYear() + '-' + startMonth + '-' + startDate;
    let toDate = v2.getFullYear() + '-' + endMonth + '-' + endDate;
    return { fromDate, toDate }
  }
  loadSinglesitePr:boolean=false;
  loadSingleSiteProd(value, actualID) {
    try {
      if (value != null) {
        this.filterType = value;
      }
      if (actualID == undefined) {
        actualID = this.siteId;
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      let fromD = startDates.toString().split(' ');
      let endDat = endDates.toString().split(' ');
      this.fromDateProd = fromD[1] + ',' + startDate
      this.toDateProd = endDat[1] + ',' + endDat[2];
      this.proFromDate = new Date(startYear + '-' + startMonth + '-' + startDate)
      this.proToDate = new Date(endYear + '-' + endMonth + '-' + endDate);

      this.proReponce(actualID, startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);
    } catch (exception) {
      console.log(exception);
    }
  }
  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDates = moment(stopDate);
    while (currentDate <= stopDates) {
      dateArray.push(moment(currentDate).format('ddd'))
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }
  proReponce(id, startDate, EndDate) {
   
  if(this.siteId!=''){
    this.loadSinglesitePr = true;
    this.assetprohelperService.PostMethod('Dashboard/SingleSiteProductiveChart', {
      "SiteID": this.siteId,
      "StartDate": startDate,
      "EndDate": EndDate
    }).subscribe(response => {
      try {
        this.loadSinglesitePr = false;
        let body = response.json();
        let stepSize = 10
        let maxvalue = 40;
        if (body.Status) {
          let actual = []
          let expectedData = [];

          this.singleSiteProdDatas = body.Data;
          let tempDatas = body.Data;
          actual = tempDatas.Actual
          expectedData = tempDatas.Expected
          let count = 0;

          if (body.Data.length != 0) {
            expectedData.forEach(a => {

              if (a > count) {
                count = a;
              }
            });
            actual.forEach(a => {

              if (a > count) {
                count = a;
              }
            });
          }
          maxvalue = 100;

          if (count <= 10) {
            maxvalue = 20;
          }
          else if (count <= 30) {
            maxvalue = 40;
          }
          else if (count <= 40) {
            maxvalue = 50;
          }
          else if (count <= 50) {
            maxvalue = 60;
          }
          else if (count <= 100) {
            maxvalue = 100;
          }
          else if (count >= 10000) {
            maxvalue = count + 10000;
            stepSize = 10000
          }
          else if (count >= 1000) {
            maxvalue = count + 1000;
            stepSize = 1000
          }
          else if (count > 600) {
            maxvalue = count + 100;
            stepSize = 200
          }
          else if (count > 100) {
            maxvalue = count + 100;
            stepSize = 100
          }

          if (maxvalue == 100) {
            stepSize = 20
          }

          let chart = "#169bd722";
          let weekColor = "#1d3d57";
          let bottomLabel = []
          bottomLabel = this.getDates(startDate, EndDate);
          if (this.filterType == 'PAST 2 WEEKS') {
            weekColor = "fff";
          }
          else if (this.filterType == 'MONTH') {
            weekColor = "fff";
          }
          if (this.prodictivitylinechart) this.prodictivitylinechart.destroy();
          this.prodictivitylinechart = new Chart('lineChart1', {
            type: 'line',
            data: {
              "labels": bottomLabel,
              "datasets": [{
                //"label": "Body Weight Lost",
                "data": actual,
                "borderColor": "#169bd7",
                "backgroundColor": chart,
                "lineTension": 0,
                "borderWidth": 1,
                "fill": true
              },
              {
                //"label": "Body Weight Lost",
                "data": expectedData,
                "borderColor": "#e8e8e8",
                "backgroundColor": "#e8e8e822",
                "lineTension": 0,
                "borderWidth": 1,
                "fill": true
              }
              ]
            },
            options: {
              legend: { display: false },
              elements: {
                point: {
                  radius: 1
                }
              },
              scales: {
                yAxes: [{
                  // stacked: true,  // value line doubled
                  ticks: {
                    fontSize: 10,
                    fontColor: "#1d3d57",
                    fontFamily: "robotoregular",
                    beginAtZero: true,
                    min: 0,
                    max: maxvalue,
                    stepSize: stepSize
                  },
                  scaleLabel: {
                    display: false,
                  },
                  gridLines: {
                    display: false
                  }
                }],
                xAxes: [{
                  ticks: {
                    fontSize: 9,
                    fontColor: weekColor,
                    fontFamily: "robotoregular",
                  },
                  scaleLabel: {
                    display: false,
                  },
                  gridLines: {
                    display: false
                  }
                }]
              }
            }
          });
          //console.log(this.communicationDatas);
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (apierror) {
        console.log(apierror)
      }

    });

  }
  }

  singleSideAccidentDatas = []
  singleSideAccidenType = 'WEEK';
  singleSideAccidenTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  fromDateAccid: string = '';
  toDateAccid: string = '';
  accFromDate: Date;
  accToDate: Date;
  accidentDateChoose(val) {
    this.singleSideAccidenType = 'WEEK';
    this.accFromDate = val.value;
    this.accToDate = new Date(val.value);
    this.accToDate.setDate(this.accToDate.getDate() + 6);
    let fromDat = this.accFromDate.toString().split(' ');
    this.fromDateAccid = fromDat[1] + ',' + fromDat[2]
    let endDat = this.accToDate.toString().split(' ');
    this.toDateAccid = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.accFromDate, this.accToDate)
    this.accidentResponce(this.siteId, fromDate, toDate);
  }
  accidentArrow(type) {
    if (type == 'left') {
      let to = new Date();
      to.setMonth(to.getMonth() - 3);
      if (this.accFromDate.toDateString() == to.toDateString()) {
        return;
      }
      this.accFromDate.setDate(this.accFromDate.getDate() - 1);
      this.accToDate.setDate(this.accToDate.getDate() - 1);
    } else {
      if (this.accToDate.toDateString() == new Date().toDateString()) {
        return;
      }
      this.accFromDate.setDate(this.accFromDate.getDate() + 1);
      this.accToDate.setDate(this.accToDate.getDate() + 1);
    }
    let fromDat = this.accFromDate.toString().split(' ');
    this.fromDateAccid = fromDat[1] + ',' + fromDat[2]
    let endDat = this.accToDate.toString().split(' ');
    this.toDateAccid = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.accFromDate, this.accToDate)
    this.accidentResponce(this.siteId, fromDate, toDate);
  }
  loadSingleSideAc:boolean=false;
  loadSingleSideAccident(value, actualID) {
    try {
      if (value != null) {
        this.filterType = value;
      }
      if (actualID == undefined) {
        actualID = this.siteId;
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let fromD = startDates.toString().split(' ');
      let endDat = endDates.toString().split(' ');

      this.fromDateAccid = fromD[1] + ',' + startDate
      this.toDateAccid = endDat[1] + ',' + endDat[2];
      this.accFromDate = new Date(startYear + '-' + startMonth + '-' + startDate)
      this.accToDate = new Date(endYear + '-' + endMonth + '-' + endDate);
      this.accidentResponce(this.siteId, startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);
    } catch (exception) {
      console.log(exception);
    }
  }
  accidentResponce(id, fromDate, toDate) {
    if(this.siteId!=''){
    this.loadSingleSideAc = true;
    this.assetprohelperService.PostMethod('Dashboard/SingleSiteAccidentChart', {
      "StartDate": fromDate,
      "EndDate": toDate,
      "SiteID": this.siteId
    }).subscribe(response => {
      try {
        this.loadSingleSideAc = false;
        let body = response.json();
        let maxvalue = 40;
        let stepSize = 10
        if (body.Status) {
          this.singleSideAccidentDatas = body.Data;
          let tempDatas = body.Data;
          let actual = tempDatas.Actual
          let expectedData = tempDatas.Expected
          let count = 0
          if (body.Data.length != 0) {
            expectedData.forEach(a => {

              if (a > count) {
                count = a;
              }
            });
            actual.forEach(a => {

              if (a > count) {
                count = a;
              }
            });
          }
          let bottomLabel = this.getDates(fromDate, toDate);
          stepSize = 10
          maxvalue = 100;
          if (count <= 10) {
            maxvalue = 20;
          }
          else if (count <= 30) {
            maxvalue = 40;
          }
          else if (count <= 40) {
            maxvalue = 50;
          }
          else if (count <= 50) {
            maxvalue = 60;
          }
          else if (count <= 100) {
            maxvalue = 100;
          }
          else if (count >= 10000) {
            maxvalue = count + 10000;
            stepSize = 10000
          }
          else if (count >= 1000) {
            maxvalue = count + 1000;
            stepSize = 1000
          }
          else if (count > 600) {
            maxvalue = count + 100;
            stepSize = 200
          }
          else if (count > 100) {
            maxvalue = count + 100;
            stepSize = 100
          }


          if (maxvalue == 100) {
            stepSize = 20
          }
          let weekColortwo = "#1d3d57";
          if (this.filterType == 'PAST 2 WEEKS') {
            weekColortwo = "#fff";
          }
          if (this.filterType == 'MONTH') {
            weekColortwo = "#fff";
          }
          if (this.accidentslinechart) this.accidentslinechart.destroy();
          this.accidentslinechart = new Chart('lineChart2', {
            type: 'line',
            data: {
              "labels": bottomLabel,
              "datasets": [{
                //   "label": "Body Weight Lost",
                "data": actual,
                "borderColor": "#ff1c00",
                "backgroundColor": "#ff1c0022",
                "lineTension": 0,
                "borderWidth": 1,
                "fill": true
              },
              // {
              //   //"label": "Body Weight Lost",
              //   "data": expectedData,
              //   "borderColor": "#e8e8e8",
              //   "backgroundColor": "#e8e8e822",
              //   "lineTension": 0,
              //   "borderWidth": 1,
              //   "fill": true
              // }
              ]
            },
            options: {
              legend: { display: false },
              elements: {
                point: {
                  radius: 1
                }
              },
              scales: {
                yAxes: [{
                  // stacked: true,  // value line doubled
                  ticks: {
                    fontSize: 10,
                    fontColor: "#1d3d57",
                    fontFamily: "robotoregular",
                    beginAtZero: true,
                    min: 0,
                    max: maxvalue,
                    stepSize: stepSize
                  },
                  scaleLabel: {
                    display: false,
                  },
                  gridLines: {
                    display: false
                  }
                }],
                xAxes: [{
                  ticks: {
                    fontSize: 9,
                    fontColor: weekColortwo,
                    fontFamily: "robotoregular",
                  },
                  scaleLabel: {
                    display: false,
                  },
                  gridLines: {
                    display: false
                  }
                }]
              }
            }
          });
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (apierror) {
        console.log(apierror)
      }

    });
  }
}

  newFunction(value) {
    let startDates = new Date();
    startDates.setDate(startDates.getDate() - 7);
    let startDate = '' + startDates.getDate();
    let startMonth = '' + (startDates.getMonth() + 1);
    let startYear = '' + startDates.getFullYear();
    let endDates = new Date();
    let endDate = '' + new Date().getDate();
    let endMonth = '' + (new Date().getMonth() + 1);
    let endYear = '' + new Date().getFullYear();
    let endOldMonth = new Date().getMonth() - 1;
    let endMonths = new Date();
    endMonths.setMonth(endOldMonth);
    // if (value == null || value == 'WEEK') {
    //   startDates.setDate(startDates.getDate() + 1)
    //   startMonth = '' + (startDates.getMonth() + 1);
    //   if(new Date().getDate()-7<0){
    //     startDate = '1';
    //   }
    //     else{
    //       startDate = '' + startDates.getDate();
    //     }
    // }
    // else if (value == 'PAST 2 WEEKS') {
    //   startDates = new Date();
    //   startDates.setDate(startDates.getDate() - 13);
    //   startMonth = '' + (startDates.getMonth() + 1);
    //   startYear = '' + startDates.getFullYear();
    //   if(startDates.getDate()-13<=0){
    //     startDate = '1';
    //   }
    //   else{
    //     startDate = '' + startDates.getDate();
    //   }
    // }
    if (value==null ||value == 'WEEK') {
      startDates.setDate(startDates.getDate()+1)
      startMonth = '' + (new Date().getMonth() + 1);
      if(new Date().getDate()-7<0){
        startDate='1';
        
      }
      else{
        startDate = '' +startDates.getDate()
      }
      startYear = '' + new Date().getFullYear();
   }
   else if (value == 'PAST 2 WEEKS') {
     startDates = new Date();
     startDates.setDate(startDates.getDate() - 13);
     if(new Date().getDate()-13<=0){
      startDate='1';
    }
    else{
      startDate = '' +startDates.getDate()
    }
    startMonth = '' + (new Date().getMonth() + 1);
    startYear = '' + new Date().getFullYear();
   }
    else if (value == 'MONTH') {
      startDates = new Date();
      startDate = '1'
      startMonth = '' + (new Date().getMonth() + 1);
      startYear = '' + startDates.getFullYear();
      endDate = '' + startDates.getDate();
      endMonth = '' + (new Date().getMonth() + 1);
      endYear = '' + startDates.getFullYear();
    }
    if (value == 'PREVIOUS MONTH') {
      let firstDate=new Date();
      firstDate.setMonth(firstDate.getMonth()-1)
      startDate = '1';
      startMonth = '' + (firstDate.getMonth()+1);
      startYear = '' + (firstDate.getFullYear());
      endDate = '' + new Date(firstDate.getFullYear(), firstDate.getMonth()+1, 0).getDate();
      endMonth ='' + (firstDate.getMonth()+1);
      endYear = '' + (firstDate.getFullYear());
    }
    else if (value == 'LAST THREE MONTHS') {
      startDate = '1';
      startMonth = '' + (startDates.getMonth());
      startYear = '' + endMonths.getFullYear();
      endOldMonth = new Date().getMonth() - 2;
      endMonths = new Date();
      endMonths.setMonth(endOldMonth);
      endDate = '' + endMonths.getDate();
      endMonth = '' + (new Date().getMonth() + 1);
      endYear = endYear;
    }

    if (parseInt(startMonth) < 10) {
      startMonth = '0' + startMonth;
    }
    if (parseInt(startDate) < 10) {
      startDate = '0' + startDate;
    }
    if (parseInt(endMonth) < 10) {
      endMonth = '0' + endMonth;
    }
    if (parseInt(endDate) < 10) {
      endDate = '0' + endDate;
    }
    return { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate };
  }
  stateOverViewReport() {
    let titile = ['Site name', 'Usage time', 'Idling time', 'Maint. overdue', 'New alarms', 'Safety compliance', 'Person in charge']
    let data = [];
    this.stateOverviewDatas.forEach(val => {

      data.push({
        "Site name": val.SiteName, 'Usage time': val.UsageTime, 'Idling time': val.IdlingTime,
        'Maint. overdue': val.MaintWeightage, 'New alarms': val.AlarmWeightage, 'Safety compliance': val.ComplianceWeightage, 'Person in charge': val.AdminName,
        'Usage Time Total': val.UsageTimeTotal, 'Useage Time Expected': val.UsageTimeExpected, 'Most Used': val.MostUsedAT, 'Most Unused': val.MostUnUsedAT,
        'Idling Equipment': val.IdlingEquipment, 'Idling Batteries': val.IdlingBatteries, 'Idling charges': val.IdlingChargers,
        'CheckList Alarams': val.ComplianceWeightageAlarm, 'Kipped CheckList': val.ComplianceWeightageSkipped, 'Shorted CheckList': val.ComplianceWeightageShorted
      });
    });
    this.JSONToCSVConvertor(data, true);
  }
  JSONToCSVConvertor(JSONData, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    //CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
      var row = "";

      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {

        //Now convert each value to string and comma-seprated
        row += index + ',';
      }

      row = row.slice(0, -1);

      //append Label row with line break
      CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      var row = "";

      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
        if (arrData[i][index] == null || arrData[i][index] == 'null') {
          row += ',';
        } else {
          row += '"' + arrData[i][index] + '",';
        }
      }

      row.slice(0, row.length - 1);

      //add a line break after each row
      CSV += row + '\r\n';
    }

    if (CSV == '') {
      alert("Invalid data");
      return;
    }

    //Generate a file name
    var fileName = "Stats_OverView_Report_" + new Date().toLocaleString();
    //this will remove the blank-spaces from the title and replace it with an underscore
    //fileName += ReportTitle.replace(/ /g,"_");   

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link: any = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    //link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  editWidgetFlag: boolean = false;
  beforeEdit() {
    let parent = this;
    // let subdialogRef = this.dialog.open(ConfirmationDailog, {
    //   data: { name: 'Are you sure you want to Edit this widgets?' }
    // });

    // subdialogRef.afterClosed().subscribe(result => {
    //   if (result != undefined && result == 'Yes') {
    parent.editWidget();
    //   }
    // });
  }
  editWidget() {
    this.editWidgetFlag = true;
    this.tempProductive = true;
    this.tempAccident = true;
    this.tempAlarm = true;
    this.tempSafety = true;
    this.tempMaintenance = true;
    this.tempBatteries = true;
    this.tempCommunication = true;
    this.tempAverage = true;
    this.tempHottest = true;
    this.tempEcAlarm = true;
    this.tempEqualization = true;
    this.tempEqualizationCharge = true;
    if (this.batteriesEnable) {
      this.loadEqualizat = true;
    }
    if (this.chargesEnable) {
      this.loadEqualizationCha = true;
    }
    setTimeout(() => {
      this.doughnutchart(this.maintenanceDatas, null);
      if (this.batteriesEnable) {
        this.doughnutchartEqualization(this.previsousDataEqualization, null);
      }
      if (this.chargesEnable) {
        this.doughnutchartEqualizationCharge(this.previsousDataEqualizationCharges, null);
      }
    }, 1000);
  }
  changeMaintenance() {
    this.Maintenance = !this.Maintenance
    setTimeout(() => {
      this.doughnutchart(this.maintenanceDatas, null);
    }, 1000);
  }
  changeEqualization() {
    this.equalization = !this.equalization
    setTimeout(() => {
      if (this.batteriesEnable) {
        this.doughnutchartEqualization(this.previsousDataEqualization, null);
      }
    }, 1000);
  }
  changeEqualizationCharge() {
    this.equalizationCharge = !this.equalizationCharge
    setTimeout(() => {
      if (this.chargesEnable) {
        this.doughnutchartEqualizationCharge(this.previsousDataEqualizationCharges, null);
      }
    }, 1000);
  }
  animal: string;
  name: string;
  personEnabled: boolean = true;
  Productive: boolean = false;
  Accident: boolean = false;
  Alarm: boolean = false;
  Safety: boolean = false;
  Maintenance: boolean = false;
  Batteries: boolean = false;
  Communication: boolean = false;
  average: boolean = false;
  hottest: boolean = false;
  ecAlarm: boolean = false;
  equalization: boolean = false;
  equalizationCharge: boolean = false;
  widgetList: any = []
  disableWidget() {
    this.tempProductive = this.Productive = false;
    this.tempAccident = this.Accident = false;
    this.tempAlarm = this.Alarm = false;
    this.tempSafety = this.Safety = false;
    this.tempMaintenance = this.Maintenance = false;
    this.tempBatteries = this.Batteries = false;
    this.tempCommunication = this.Communication = false;
    this.tempAverage = this.average = false;
    this.tempHottest = this.hottest = false;
    this.tempEcAlarm = this.ecAlarm = false;
    this.tempEqualization = this.equalization = false;
    this.tempEqualizationCharge = this.equalizationCharge = false
    this.doughnutchart(this.maintenanceDatas, null);
    if (this.batteriesEnable) {
      this.loadEqualizat = true;
    }
    if (this.chargesEnable) {
      this.loadEqualizationCha = true;
    }
    if (this.batteriesEnable) {
      this.doughnutchartEqualization(this.previsousDataEqualization, null);
    }
    if (this.chargesEnable) {
      this.doughnutchartEqualizationCharge(this.previsousDataEqualizationCharges, null);
    }
  }
  tempProductive: boolean = false;
  tempAccident: boolean = false;
  tempAlarm: boolean = false;
  tempSafety: boolean = false;
  tempMaintenance: boolean = false;
  tempBatteries: boolean = true;
  tempCommunication: boolean = false;
  tempAverage: boolean = false;
  tempHottest: boolean = false;
  tempEcAlarm: boolean = false;
  tempEqualization: boolean = false;
  tempEqualizationCharge: boolean = false;
  loadWidget(value) {
    let screenNmae = 'AllSites';
    if (this.siteId != '') {
      screenNmae = 'SingleSite';
    }
    this.widgetList = []
    this.disableWidget();
    this.loader = true;
    this.assetprohelperService.PostMethod('Dashboard/WidgetUserPreference', { "ScreenName": screenNmae }).subscribe(response => {
      try {
        this.loadEqualization(value)
        this.loadEqualizationCharge(value)
        this.loadMaintenance(value)
        this.loader = false;
        let body = response.json();
        if (body.Status) {
          this.widgetList = body.Data
          this.widgetList.forEach(a => {
            if (a.IsDeleted == 0) {
              if (a.WidgetName == "Productive") {
                this.tempProductive = this.Productive = true;
              } if (a.WidgetName == "Accident") {
                this.tempAccident = this.Accident = true;
              } if (a.WidgetName == "Alarm") {
                this.tempAlarm = this.Alarm = true;
              } if (a.WidgetName == "Safety") {
                this.tempSafety = this.Safety = true;
              } if (a.WidgetName == "Maintenance") {
                this.tempMaintenance = this.Maintenance = true;
              } if (a.WidgetName == "Batteries") {
                this.tempBatteries = this.Batteries = true;
              } if (a.WidgetName == "Communication") {
                this.tempCommunication = this.Communication = true;
              }
              //batteries
              if (a.WidgetName == "AverageStateBatteries" || a.WidgetName == "AverageOccupiedCharger") {
                this.tempAverage = this.average = true;
              }
              if (a.WidgetName == "HottestBatteries") {
                this.tempHottest = this.hottest = true;
              }
              if (a.WidgetName == "BatteriesAlarm" || a.WidgetName == "ChargersFaults") {
                this.tempEcAlarm = this.ecAlarm = true;
              }
              if (a.WidgetName == "BatteriesEqualization") {
                this.tempEqualization = this.equalization = true;
              }
              if (a.WidgetName == "ChargersEqualization") {
                this.tempEqualizationCharge = this.equalizationCharge = true;
              }
            } else {
              if (a.WidgetName == "Maintenance") {
                this.tempMaintenance = this.Maintenance = false
              }
            }
          });
          this.doughnutchart(this.maintenanceDatas, null);

          if (this.batteriesEnable) {
            this.loadEqualizat = true;
            this.doughnutchartEqualization(this.previsousDataEqualization, null);
          }
          if (this.chargesEnable) {
            this.loadEqualizationCha = true;
            this.doughnutchartEqualizationCharge(this.previsousDataEqualizationCharges, null);
          }
         
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (apierror) {
        console.log(apierror)
      }

    });
  }
  applyFun() {
    let parent = this;
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to APPLY this Action?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        parent.saveWidget();
      }
    });
  }
  saveWidget() {
    let show = []
    let unsselected = []
    //
    this.widgetList.forEach(a => {
      if (a.WidgetName == 'Productive') {
        if (this.Productive) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      }
      if (a.WidgetName == 'Accident') {
        if (this.Accident) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      } if (a.WidgetName == 'Alarm') {
        if (this.Alarm) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      } if (a.WidgetName == 'Safety') {
        if (this.Safety) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      }
      if (a.WidgetName == 'Maintenance') {
        if (this.Maintenance) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      } if (a.WidgetName == 'Batteries') {
        if (this.Batteries) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      } if (a.WidgetName == 'Communication') {
        if (this.Communication) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      }

      //batteries
      if (a.WidgetName == 'AverageStateBatteries' || a.WidgetName == "AverageOccupiedCharger") {
        if (this.average) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      }
      if (a.WidgetName == 'HottestBatteries') {
        if (this.hottest) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      } if (a.WidgetName == 'BatteriesAlarm' || a.WidgetName == "ChargersFaults") {
        if (this.ecAlarm) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      }
      if (a.WidgetName == 'BatteriesEqualization') {
        if (this.equalization) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      }
      if (a.WidgetName == "ChargersEqualization") {
        if (this.equalizationCharge) {
          unsselected.push(a.ID);
        } else {
          a.IsDeleted = 0
          show.push(a.ID);
        }
      }
    });
    this.spinner.show();
    this.loader = true;
    this.assetprohelperService.PostMethod('Dashboard/UpdateWidgetUserPreference', { "ShowIds": unsselected, "HideIds": show }).subscribe(data => {
      this.loader = false;
      var body = JSON.parse(data['_body']);
      if (body.Status) {
        this.toastr.success(body.Message, 'Success!')
        this.spinner.hide();
      }
      else {
        this.toastr.error(body.Message, 'Error!');
        this.spinner.hide();
        return;
      }
      this.editWidgetFlag = false
      this.doughnutchart(this.maintenanceDatas, null);
      if (this.batteriesEnable) {
        this.loadEqualizat = true;
        this.doughnutchartEqualization(this.previsousDataEqualization, null);
      }
      if (this.chargesEnable) {
        this.loadEqualizationCha = true;
        this.doughnutchartEqualizationCharge(this.previsousDataEqualizationCharges, null);
      }
      this.tempProductive = this.Productive;

      this.tempAccident = this.Accident;

      this.tempAlarm = this.Alarm;

      this.tempSafety = this.Safety;

      this.tempMaintenance = this.Maintenance;

      this.tempBatteries = this.Batteries;

      this.tempCommunication = this.Communication;

      this.tempAverage = this.average;

      this.tempHottest = this.hottest;

      this.tempEcAlarm = this.ecAlarm;

      this.tempEqualization = this.equalization;

      this.tempEqualizationCharge = this.equalizationCharge

    });

  }
  cancelWidget(value) {
    this.loadWidget(value)
    this.editWidgetFlag = false
    // setTimeout(() => {
    //   this.doughnutchart(this.maintenanceDatas, null);
    //   if (this.batteriesEnable) {
    //     this.doughnutchartEqualization(this.previsousDataEqualization, null);
    //   }
    //   if (this.chargesEnable) {
    //     this.doughnutchartEqualizationCharge(this.previsousDataEqualizationCharges, null);
    //   }
    // }, 1000);
  }
  temp = true;
  open(item,element) {
    this.dialog.open(Equipmenttable, {
      width: '80%',
      // height: '80%',
      data: { value: this.stateOverviewDatas, type: this.stateOverview,item,element }
    });
    // const modalRef = this.modalService.open(NgbdModalContent,  { size: 'lg' , centered:true  });
    // modalRef.componentInstance.stateOverviewDatas = this.stateOverviewDatas;
  }
  openPersonIncharge(element){

    let width = '35%'

    if (screen.availWidth <= 863) {
      width = '90%'
    }
    if(element.AdminName=='N/A'){
      this.toastr.warning("No Admin Available", "Warning");
      return
    }
      this.dialog.open(PersonInchargepopupComponent,{
        width: width,
        data: {data:element.ID}
      });
    
}


  openMostProductivityModel() {
    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }

    this.dialog.open(MostProductivityModel, {
      width: width,

      data: { mostProdictiveDatas: this.mostProdictiveDatas, overView: this.overView, prodictivemenu: this.prodictivemenu }
    });
    //const modalRef = this.modalService.open(MostProductivityModel, { centered: true });
    //modalRef.componentInstance.mostProdictiveDatas = this.mostProdictiveDatas;
    //modalRef.componentInstance.overView = this.overView;
    //modalRef.componentInstance.prodictivemenu = this.prodictivemenu;
  }
  openMostAccident() {
    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }
    this.dialog.open(MostAccidentModel, {
      width: width,

      data: { mostAccidentDatas: this.mostAccidentDatas, overView: this.overView }
    });
    //const modalRef = this.modalService.open(MostAccidentModel, { centered: true });
    //modalRef.componentInstance.mostAccidentDatas = this.mostAccidentDatas;
    //modalRef.componentInstance.overView = this.overView;
  }
  openMostAlarms() {
    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }

    this.dialog.open(MostAlarmsModel, {
      width: width,

      data: { mostAlarmDatas: this.mostAlarmDatas, overView: this.overView }
    });
    // const modalRef = this.modalService.open(MostAlarmsModel, { centered: true });
    // modalRef.componentInstance.mostAlarmDatas = this.mostAlarmDatas;
    // modalRef.componentInstance.overView = this.overView;
  }

  showcritical: boolean = false;

  showCritical() {
    this.loader = true;
    if (this.showcritical) {
      this.stateOverviewDatas = this.stateOverviewDatas.filter(d => {
        if (d.UsageTime < 70) return true;
        if (d.IdlingTime > 20) return true;
        if (d.MaintWeightage > 5) return true;
        if (d.AlarmWeightage > 10) return true;
        if (d.ComplianceWeightage > 1) {
          return true;
        }
        
        return false;
      })
      this.dataSource.data=this.stateOverviewDatas.slice(0,5)
      this.loader = false;
      console.log(this.stateOverviewDatas);
    } else {
      this.loadAllSitesStates(this.stateOverview);
    }
  }
  showHiddenWidgets() {
    this.Productive = false;
    this.Accident = false;
    this.Alarm = false;
    this.Safety = false;
    this.Maintenance = false;
    this.Batteries = false;
    this.Communication = false;
    this.equalization = false
    this.equalizationCharge = false
    this.ecAlarm = false
    this.hottest = false
    this.average = false
    if (this.batteriesEnable) {
      this.loadEqualizat = true;
    }
    if (this.chargesEnable) {
      this.loadEqualizationCha = true;
    }
    setTimeout(() => {
      this.doughnutchart(this.maintenanceDatas, null);
      if (this.batteriesEnable) {
        this.doughnutchartEqualization(this.previsousDataEqualization, null);
      }
      if (this.chargesEnable) {
        this.doughnutchartEqualizationCharge(this.previsousDataEqualizationCharges, null);
      }
    }, 1000);
  }



  /** MOST AVERAGE FUNCTION*/
  mostAverageDatas = []
  // filterType = 'WEEK';
  // filterTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  averageType = ['MAX AVG STATE', 'MIN AVG STATE']
  averages = 'MAX AVG STATE';
  averageType2 = ['AVG AH TIME', 'AVG UNOCCUPIED TIME']
  averages2 = 'AVG AH TIME';
  typeAverage = null;
  maxAverage = 0;
  prodictivBatCharType: string = 'batteries'
  loadMostAve:boolean=false;
  loadMostAverage(value, type, value2) {
   
    
    // this.arrowUpAvg=!this.arrowUpAvg
    // this.arrowDownAvg=!this.arrowDownAvg;
    // this.arrowUpAvgAH=!this.arrowUpAvgAH
    // this.arrowDownAvgAH=!this.arrowDownAvgAH

    try {
      let check = this.filterType
      if (value != null) {
        this.filterType = value;
      }
      if (type != null && type != undefined) {
       // if (this.prodictivBatCharType == type && this.filterType == check && value != null && value2 == null) return;
        this.prodictivBatCharType = type
      }
      //  if(this.prodictive==value2){
      //    return;
      //  }
      if (type == null) {
        this.prodictivBatCharType = 'batteries'
      }
      if (value2 != null) {
        // if (this.averages == value2) return;
        // if (this.prodictivBatCharType == 'batteries' && this.averages == value2) return;
        // if (this.prodictivBatCharType == 'charges' && this.averages2 == value2) return;
        if (this.prodictivBatCharType == 'batteries') {
          this.averages = value2;
        }
        if (this.prodictivBatCharType == 'charges') {
          this.averages2 = value2;
        }
        //this.mostAverageDatas.reverse();
        //return;
      }
      if (type != null) {
        this.typeAverage = type;
      }
    
      // if(value2==null &&  type == 'batteries') {
      //   if(this.averages2 == 'AVG AH TIME'){
      //     this.averages = 'MAX AVG STATE'
      //   this.averages2 = 'AVG AH TIME'
      //     }else{
      //       this.averages = 'MIN AVG STATE'
      //       this.averages2 = 'AVG UNOCCUPIED TIME'
      //     }
      // }
      // if(value2==null && type != 'batteries'){
      
      //   if(this.averages == 'MAX AVG STATE'){
      //     this.averages = 'MAX AVG STATE'
      //     this.averages2 = 'AVG AH TIME'
      //   }else{
      //     this.averages = 'MIN AVG STATE'
      //    this.averages2 = 'AVG UNOCCUPIED TIME'
      //   }
      // }
      let product = 'Charges';
      if (type == 'batteries' || type == null) {
        product = 'Batteries';
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let url = 'AllSitesAverageStateBatteries';
      let parameter = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      };

      let parameter2 = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate, "SiteID": this.siteId
      };

      if (type == 'charges') {
        url = 'AllSitesAverageOccupiedCharger';
      }
      if (this.siteId != undefined && this.siteId != '') {
        parameter = parameter2;
        url = 'SingleSiteAverageStateBatteries';
        if (type == 'charges') {
          url = 'SingleSiteAverageOccupiedCharger';
        }
      }
      this.loadMostAve = true;
      this.assetprohelperService.PostMethod('Dashboard/' + url, parameter).subscribe(data => {
        this.loadMostAve = false;
        let body: any = JSON.parse(data['_body']);
        this.mostAverageDatas = body.Data;
        let count = 0;
        this.mostAverageDatas.forEach(a => {
          if (type == 'charges') {
            if (a.StateOfCharge > count) {
              count = a.StateOfCharge;
            }
          } else {
            if (a.StateOfBattery > count) {
              count = a.StateOfBattery;
            }
          }
        });
        this.maxAverage = count;
        this.mostAverageDatas.forEach(a => {
          if (type == 'charges') {
            if (a.StateOfCharge == undefined || a.StateOfCharge == '' || a.StateOfCharge == 0) {
              a.range = 0;
            } else {
              a.range = Math.round((a.StateOfCharge / count) * 100)
            }
          } else {
            if (a.StateOfBattery == undefined || a.StateOfBattery == '' || a.StateOfBattery == 0) {
              a.range = 0;
            } else {
              a.range = Math.round((a.StateOfBattery / count) * 100)
            }
          }
        });
        //  console.log(this.mostAverageDatas);
        if ((this.averages == 'MIN AVG STATE' && this.prodictivBatCharType == 'batteries') || (this.averages2 == 'AVG UNOCCUPIED TIME' && this.prodictivBatCharType == 'charges'))
          this.mostAverageDatas.reverse();
      });
    } catch (exception) {
      console.log(exception);
    }
  }


  /** MOST HOTTEST FUNCTION*/
  mostHottestDatas = []
  // mostHottestType = 'WEEK';
  // mostHottestTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  hottestType = ['MOST HOT BATTERY', 'LEAST HOT BATTERY']
  hottests = 'MOST HOT BATTERY';
  typeHotest = null;
  maxHotest = 0;
  prodictivBatCharHottesType: string = 'batteries'
  loadMostHott:boolean=false;
  loadMostHottest(value, type, value2) {
    // if(!isTabChange){
    //   this.isAscendingOrderTemp = !this.isAscendingOrderTemp;
    // }
    // if(this.isAscendingOrderTemp){
    //  this.hottests='MIN AVG STATE'
    // }
    // else{
    //  this.hottests='MAX AVG STATE'
    // }
    try {
      let check = this.filterType;
      if (value != null) {
        this.filterType = value;
      }
      if (type != null && type != undefined) {
        //if (this.prodictivBatCharHottesType == type && check == this.filterType && value != null && value == null) return;
        this.prodictivBatCharHottesType = type
      }
      if (type == null || this.prodictivBatCharHottesType == null) {
        this.prodictivBatCharHottesType = 'batteries'
      }
      if (value2 != null) {
      // if (this.hottests == value2) return;
        this.hottests = value2;
      //  this.mostHottestDatas.reverse();
      //  return;
      }
      if (type != null) {
        this.typeHotest = type;
      }
      let product = 'Charges';
      if (type == 'batteries' || type == null) {
        product = 'Batteries';
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let url = 'AllSitesHottestBatteries';
      let parameter = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      };

      let parameter2 = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate, "SiteID": this.siteId
      };
      if (type == 'charges') {
        url = 'AllSitesHottestChargers';
      }
      if (this.siteId != undefined && this.siteId != '') {
        url = 'SingleSiteHottestBatteries';
        parameter = parameter2;
      }

      this.loadMostHott = true;
      this.assetprohelperService.PostMethod('Dashboard/' + url, parameter).subscribe(data => {
        this.loadMostHott = false;
        let body: any = JSON.parse(data['_body']);
        this.mostHottestDatas = body.Data;
        let count = 0;
        this.mostHottestDatas.forEach(a => {
          if (a.HottestBattery > count) {
            count = a.HottestBattery;
          }
        });
        this.maxHotest = count;
        this.mostHottestDatas.forEach(a => {
          if (a.HottestBattery == undefined || a.HottestBattery == '' || a.HottestBattery == 0) {
            a.range = 0;
          } else {
            a.range = Math.round((a.HottestBattery / count) * 100)
          }

        });
        //  console.log(this.mostHottestDatas);
        if (this.hottests == 'LEAST HOT BATTERY')
          this.mostHottestDatas.reverse();
      });
    } catch (exception) {
      console.log(exception);
    }
  }

  /** MOST AVERAGE FUNCTION*/
  mostEcAlarmDatas = []
  // filterType = 'WEEK';
  // filterTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  ecAlarmType = ['MOST ALARMS', 'LEAST ALARMS']
  ecAlarms = 'MOST ALARMS';
  ecAlarmType2 = ['MOST FAULT CODES', 'LEAST FAULT CODES']
  ecAlarms2 = 'MOST FAULT CODES';
  typeEcAlarm = null;
  maxEcAlarm = 0;
  prodictivEcAlarmType: string = 'batteries'
  loader3 = false
  loadMostEc:boolean=false;
  loadMostEcAlarm(value, type, value2) {
  
    try {
      let check = this.filterType
      if (value != null) {
        this.filterType = value;
      }
      if (type != null && type != undefined) {
        // if (this.prodictivEcAlarmType == type && check == this.filterType && value != null && value2 == null) return;
        this.prodictivEcAlarmType = type
      }
      if (type == null || this.prodictivEcAlarmType == null) {
        this.prodictivEcAlarmType = 'batteries'
      }
      if (value2 != null) {
        // if (this.prodictivEcAlarmType == 'batteries' && this.ecAlarms == value2) return;
        // if (this.prodictivEcAlarmType == 'charges' && this.ecAlarms2 == value2) return;
        if (this.prodictivEcAlarmType == 'batteries') {
          this.ecAlarms = value2;
        }
        if (this.prodictivEcAlarmType == 'charges') {
          this.ecAlarms2 = value2;
        }
        //this.mostEcAlarmDatas.reverse();
       // return;
      }
      if (type != null) {
        this.typeAverage = type;
      }
      let product = 'Charges';
      if (type == 'batteries' || type == null) {
        product = 'Batteries';
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let url = 'AllSitesBatteriesAlarm';
      let parameter = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      };

      let parameter2 = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate, "SiteID": this.siteId
      };

      if (type == 'charges') {
        url = 'AllSitesChargersFaults';
      }
      // if(value2 == 'MOST ALARMS' || value2 == 'MOST FAULT CODES'){
      //   this.ecAlarms = 'MOST ALARMS' 
      //   this.ecAlarms2 = 'MOST FAULT CODES'
      // }else{
      //   this.ecAlarms = 'LEAST ALARMS' 
      //   this.ecAlarms2 = 'LEAST FAULT CODES'
      // }
      // if(value2==null &&  type == 'batteries') {
      //   if(this.ecAlarms2 == 'MOST FAULT CODES'){
      //     this.ecAlarms = 'MOST ALARMS' 
      //     this.ecAlarms2 = 'MOST FAULT CODES'
      //     }else{
      //     this.ecAlarms = 'LEAST ALARMS' 
      //     this.ecAlarms2 = 'LEAST FAULT CODES'
      //     }
      // }
      // if(value2==null && type != 'batteries'){
      
      //   if(this.ecAlarms == 'MOST ALARMS'){
      //     this.ecAlarms = 'MOST ALARMS' 
      //     this.ecAlarms2 = 'MOST FAULT CODES'
      //   }else{
      //     this.ecAlarms = 'LEAST ALARMS' 
      //     this.ecAlarms2 = 'LEAST FAULT CODES'
      //   }
      // }
      
      if (this.siteId != undefined && this.siteId != '') {
        parameter = parameter2;
        url = 'SingleSiteBatteriesAlarm';
        if (type == 'charges') {
          url = 'SingleSiteChargersFaults';
        }
      }
      this.loadMostEc = true;
      this.assetprohelperService.PostMethod('Dashboard/' + url, parameter).subscribe(data => {
        this.loadMostEc = false;
        let body: any = JSON.parse(data['_body']);
        this.mostEcAlarmDatas = body.Data;
        let count = 0;
        this.mostEcAlarmDatas.forEach(a => {
          if (this.prodictivEcAlarmType == 'charges') {
            if (a.AllFaults == undefined || a.AllFaults == '' || a.AllFaults == 0) {
              a.range = 0;
            } else {
              a.range = Math.round((a.AllFaults / count) * 100)
            }
          } else {
            if (a.AllAlarms > count) {
              count = a.AllAlarms;
            }
          }
        });
        this.maxEcAlarm = count;
        this.mostEcAlarmDatas.forEach(a => {
          if (this.prodictivEcAlarmType == 'charges') {
            if (a.AllFaults == undefined || a.AllFaults == '' || a.AllFaults == 0) {
              a.range = 0;
            } else {
              a.range = Math.round((a.AllFaults / count) * 100)
            }
          } else {
            if (a.AllAlarms == undefined || a.AllAlarms == '' || a.AllAlarms == 0) {
              a.range = 0;
            } else {
              a.range = Math.round((a.AllAlarms / count) * 100)
            }
          }
        });
        //  console.log(this.mostEcAlarmDatas);prodictivEcAlarmType: string = 'batteries'
        if ((this.ecAlarms == 'LEAST ALARMS' && this.prodictivEcAlarmType == 'batteries') || (
          this.ecAlarms2 == 'LEAST FAULT CODES' && this.prodictivEcAlarmType == 'charges'))
          this.mostEcAlarmDatas.reverse();
      });
    } catch (exception) {
      console.log(exception);
    }
  }


  maintenanceDatasEqualization = []
  maintenanceTypeEqualization = 'WEEK';
  maintenanceTypeListEqualization = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  equalizationRecord: boolean = false
  loadEqualizat:boolean=false;
  loadEqualization(value) {
    try {
      if (value != null) {
        this.maintenanceTypeEqualization = value;
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      this.loadEqualizat = true;
      let url = 'AllSitesBatteriesEqualization'
      let body;
      body = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }
      if (this.siteId != undefined && this.siteId != '') {
        url = 'SingleSiteBatteriesEqualization'
        body = {
          "StartDate": startYear + '-' + startMonth + '-' + startDate,
          "EndDate": endYear + '-' + endMonth + '-' + endDate,
          "SiteID": this.siteId
        }
      }
      this.assetprohelperService.PostMethod('Dashboard/' + url, body).subscribe(data => {
        this.loadEqualizat = false;
        let body: any = JSON.parse(data['_body']);
        this.maintenanceDatasEqualization = body.Data;
        let chartDatas = []
        let tempData;
        this.equalizationRecord = false
        if (this.maintenanceDatasEqualization.length > 0) {
          tempData = this.maintenanceDatasEqualization[0];
          chartDatas.push(tempData.OnGoing);
          chartDatas.push(tempData.Pending);
          chartDatas.push(tempData.Completed);
          chartDatas.push(tempData.InCompleted);
          if ((tempData.Completed == null || tempData.Completed == undefined) &&
            (tempData.InCompleted == null || tempData.InCompleted == undefined)
            &&
            (tempData.OnGoing == null || tempData.OnGoing == undefined)
            &&
            (tempData.Pending == null || tempData.Pending == undefined)) {
            this.equalizationRecord = true
          }
          if (tempData.Completed == 0 && tempData.InCompleted == 0 && tempData.Pending == 0 && tempData.OnGoing == 0) {
            this.equalizationRecord = true
          }
        } else {
          this.equalizationRecord = true
        }
        this.maintenanceDatasEqualization = chartDatas;
        this.doughnutchartEqualization(chartDatas, null);

      });
    } catch (exception) {

      console.log(exception);
    }
  }

  previsousDataEqualization = []
  
  doughnutchartEqualization(parameter, device) {
    this.loadEqualizat = false
    let position = 'right';
    let paddingRunTime = 14;
    let labelFont = 12
    if (screen.availWidth >= 1920) {
      paddingRunTime = 26;
      labelFont = 15
    }
    if (device != null) {
      if (device <= 990) {
        paddingRunTime = 10;
        labelFont = 11
        position = 'right'
      }
      else if (device <= 1160) {
        paddingRunTime = 10;
        labelFont = 11
        position = 'bottom'
      }
    }
    if (screen.availWidth <= 990) {
      paddingRunTime = 10;
      labelFont = 11
      position = 'right'
    }
    else if (screen.availWidth <= 1160) {
      paddingRunTime = 10;
      labelFont = 11
      position = 'bottom'
    }

    this.previsousDataEqualization = parameter;
    if (this.doughnutChartEqualization == undefined) return
    if (this.doughnutChartEqualization.nativeElement == undefined) return
    if (this.maintenancedoughnutchartEqualization) this.maintenancedoughnutchartEqualization.destroy();
    this.maintenancedoughnutchartEqualization = new Chart(this.doughnutChartEqualization.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ["OnGoing","Pending","Complete", "InComplete"],
        datasets: [

          {
            label: "Maintenance",
            backgroundColor: ["#169bd7","#ffff73","#90EE90","#EA4256"],
            data: parameter,
            fill: false

          }
        ]
      },
      options: {
        cutoutPercentage: 70,
        plugins: {
          labels: {
            render: 'value',
            fontSize: 12,
            fontColor: '#fff',
            fontStyle: 'normal',
            fontFamily: "robotoregular",
            fontWeight: "bold",
            fontStretch: "condensed"
          }
        },
        legend: {
          display: true,
          position: position,
          labels: {
            fontSize: labelFont,
            fontColor: '#4a4a4a',
            padding: paddingRunTime,  //space between labels
            usePointStyle: true, //Border radius
            boxWidth: 15  //Box width
          }
        },
        layout: {
          padding: 5
        },
        title: {
          fontColor: '#4a4a4a',
          fontSize: 18,
          display: false,
          text: 'Maintenance'
        }
      }
    });

  }
  openMostStateOrAverage() {
    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }
    let titile = this.averages;
    if (this.prodictivBatCharType == 'charges') {
      titile = this.averages2;
    }
    this.dialog.open(MostStateOrAverageModel, {
      width: width,
      data: { mostProdictiveDatas: this.mostAverageDatas, overView: this.overView, titile: titile }
    });
  }
  openMostHottest() {
    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }
    let titile = 'HOTEST'
    this.dialog.open(MostHottestModel, {
      width: width,
      data: { mostProdictiveDatas: this.mostHottestDatas, overView: this.overView, titile: titile }
    });
  }
  openMostAlarmOrCharges() {
    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }
    let titile = 'ALARMS'
    if (this.prodictivEcAlarmType == 'charges') {
      titile = this.ecAlarms2;
    }
    this.dialog.open(MostAlarmOrChargesModel, {
      width: width,
      data: { mostProdictiveDatas: this.mostEcAlarmDatas, overView: this.overView, titile: titile }
    });
  }

  openStateOverviewBattOrCharges(item) {
    this.dialog.open(Batterytable, {
      width: '80%',
      data: {
        equipmentOverviewDatas: this.equipmentOverviewDatas, overView: this.overView, titile: '',
        equipmentOverviewColumn: this.equipmentOverviewColumn, stateOverview: this.stateOverview,
        batteriesEnable: this.batteriesEnable, chargesEnable: this.chargesEnable,item
        
      }
    });
  }
  openStateOverviewBattOrCharges2() {
    this.dialog.open(Chargertable, {
      width: '80%',
      data: {
        equipmentOverviewDatas2: this.equipmentOverviewDatas2, overView: this.overView, titile: '',
        equipmentOverviewColumn2: this.equipmentOverviewColumn2, stateOverview: this.stateOverview,
        batteriesEnable: this.batteriesEnable, chargesEnable: this.chargesEnable
      }
    });
  }

  popupAlarmAllSiteDatas: any;
  openAlarmsAllSite(data) {
    if(!data){
      return;
    }
    let monthType = 'current_month';
    if (this.stateOverview == 'PREVIOUS MONTH') {
      monthType = 'previous_month';
    } else if (this.stateOverview == 'LAST THREE MONTHS') {
      monthType = 'monthTypelast_3_months';
    }
    this.popupAlarmAllSiteDatas = []
    let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(this.stateOverview);
    //this.loader = true;
    let body = {
      "StartDate": startYear + '-' + startMonth + '-' + startDate,
      "EndDate": endYear + '-' + endMonth + '-' + endDate,
      "Month": monthType,
      "SiteID": data.ID
    }
    this.assetprohelperService.PostMethod('Dashboard/AllSiteAlarmByID', body).subscribe(data => {
      //this.loader = false;
      let body: any = JSON.parse(data['_body']);
      this.popupAlarmAllSiteDatas = body.Data;
    });

  }
  popupAlarmDatas: any;
  openAlarms(data) {
    let monthType = 'current_month';
    if (this.stateOverview == 'PREVIOUS MONTH') {
      monthType = 'previous_month';
    } else if (this.stateOverview == 'LAST THREE MONTHS') {
      monthType = 'monthTypelast_3_months';
    }
    this.popupAlarmDatas = []
    let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(this.stateOverview);
    // this.loader = true;
    let body = {
      "StartDate": startYear + '-' + startMonth + '-' + startDate,
      "EndDate": endYear + '-' + endMonth + '-' + endDate,
      "Month": monthType,
      SiteID: data.ID
    }
    this.assetprohelperService.PostMethod('Dashboard/AllSitesBatteriesAlarmByID', body).subscribe(data => {
      // this.loader = false;
      let body: any = JSON.parse(data['_body']);
      this.popupAlarmDatas = body.Data;
    });

  }
  openAlarms2(data) {
    let monthType = 'current_month';
    if (this.stateOverview == 'PREVIOUS MONTH') {
      monthType = 'previous_month';
    } else if (this.stateOverview == 'LAST THREE MONTHS') {
      monthType = 'monthTypelast_3_months';
    }
    this.popupAlarmDatas2 = []
    let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(this.stateOverview);
    // this.loader = true;
    let body = {
      "StartDate": startYear + '-' + startMonth + '-' + startDate,
      "EndDate": endYear + '-' + endMonth + '-' + endDate,
      "Month": monthType,
      SiteID: data.ID
    }
    this.assetprohelperService.PostMethod('Dashboard/AllSitesChargersAlarmByID', body).subscribe(data => {
      // this.loader = false;
      let body: any = JSON.parse(data['_body']);
      this.popupAlarmDatas2 = body.Data;
    });

  }
  maintenanceDatasEqualizationCharge = []
  maintenanceTypeEqualizationCharge = 'WEEK';
  maintenanceTypeListEqualizationCharge = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  equalizationChargRecord: boolean = false
  
  loadEqualizationCha:boolean=false;
  loadEqualizationCharge(value) {
    try {
      if (value != null) {
        this.maintenanceTypeEqualizationCharge = value;
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

      let url = 'AllSitesChargersEqualization'
      let body;
      body = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }
      if (this.siteId != undefined && this.siteId != '') {
        url = 'SingleSiteChargersEqualization'
        body = {
          "StartDate": startYear + '-' + startMonth + '-' + startDate,
          "EndDate": endYear + '-' + endMonth + '-' + endDate,
          "SiteID": this.siteId
        }
      }
      this.loadEqualizationCha = true;
      this.assetprohelperService.PostMethod('Dashboard/' + url, body).subscribe(data => {
        this.loadEqualizationCha = false;
        let body: any = JSON.parse(data['_body']);
        this.maintenanceDatasEqualizationCharge = body.Data;
        let chartDatas = []
        let tempData;
        if (this.maintenanceDatasEqualizationCharge.length > 0) {
          tempData = this.maintenanceDatasEqualizationCharge[0];
          chartDatas.push(tempData.OnGoing);
          chartDatas.push(tempData.Pending);
          chartDatas.push(tempData.Completed);
          chartDatas.push(tempData.InCompleted);
          if ((tempData.Completed == 0 || tempData.Completed == null || tempData.Completed == undefined
            || tempData.Completed == null)
            && (tempData.InCompleted == 0 || tempData.InCompleted == null || tempData.InCompleted == undefined
              || tempData.InCompleted == null)
              &&
            (tempData.OnGoing == 0 ||tempData.OnGoing == null || tempData.OnGoing == undefined)
            &&
            (tempData.Pending == 0 || tempData.Pending == null || tempData.Pending == undefined)) {
            this.equalizationChargRecord = true
          } else {
            this.equalizationChargRecord = false
          }
        } else {
          this.equalizationChargRecord = false
        }
        this.maintenanceDatasEqualizationCharge = chartDatas;
        this.doughnutchartEqualizationCharge(chartDatas, null);

      }, error => {
        this.loadEqualizationCha = false;
      });
    } catch (exception) {
      this.loadEqualizationCha = false;
      console.log(exception);
    }
  }
  previsousDataEqualizationCharges = []
  
  doughnutchartEqualizationCharge(parameter, device) {
    this.loadEqualizationCha = false;
    if (parameter.length == 0) return;
    let position = 'right';
    let paddingRunTime = 14;
    let labelFont = 12
    if (screen.availWidth >= 1920) {
      paddingRunTime = 26;
      labelFont = 15
    }
    if (device != null) {
      if (device <= 990) {
        paddingRunTime = 10;
        labelFont = 11
        position = 'right'
      }
      else if (device <= 1160) {
        paddingRunTime = 10;
        labelFont = 11
        position = 'bottom'
      }
    }
    if (screen.availWidth <= 990) {
      paddingRunTime = 10;
      labelFont = 11
      position = 'right'
    }
    else if (screen.availWidth <= 1160) {
      paddingRunTime = 10;
      labelFont = 11
      position = 'bottom'
    }

    this.previsousDataEqualizationCharges = parameter;
    if (this.doughnutChartEqualizationCharge == undefined) return
    if (this.doughnutChartEqualizationCharge.nativeElement == undefined) return
    if (this.maintenancedoughnutchartEqualizationCharge) this.maintenancedoughnutchartEqualizationCharge.destroy();
    this.maintenancedoughnutchartEqualizationCharge = new Chart(this.doughnutChartEqualizationCharge.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ["OnGoing","Pending","Complete", "InComplete"],
        datasets: [
          {
            label: "Maintenance",
            backgroundColor: ["#169bd7","#ffff73","#90EE90","#EA4256"],
            data: parameter,
            fill: false

          }
        ]
      },
      options: {
        cutoutPercentage: 70,
        plugins: {
          labels: {
            render: 'value',
            fontSize: 12,
            fontColor: '#fff',
            fontStyle: 'normal',
            fontFamily: "robotoregular",
            fontWeight: "bold",
            fontStretch: "condensed"
          }
        },
        legend: {
          display: true,
          position: position,
          labels: {
            fontSize: labelFont,
            fontColor: '#4a4a4a',
            padding: paddingRunTime,  //space between labels
            usePointStyle: true, //Border radius
            boxWidth: 15  //Box width
          }
        },
        layout: {
          padding: 5
        },
        title: {
          fontColor: '#4a4a4a',
          fontSize: 18,
          display: false,
          text: 'Maintenance'
        }
      }
    });

  }
  mapViewEnable: boolean = false
  mapView() {
    this.mapViewEnable = !this.mapViewEnable;
    this.buttonByDefault = !this.buttonByDefault;
    // let parent = this;
    //  let subdialogRef = this.dialog.open(MapViewDailog, {
    //   width:'90%',data:this.equipmentOverviewDatas
    //  });
  }
  mapView_two() {
    this.mapViewEnable = !this.mapViewEnable;
    this.buttonByDefault = !this.buttonByDefault;
  }
}




@Component({
  selector: 'mostProductivity',
  templateUrl: './mostProductivity.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MostProductivityModel {
  mostProdictiveDatas;
  overView; prodictivemenu;

  constructor(public dialogRef: MatDialogRef<MostProductivityModel>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mostProdictiveDatas = data.mostProdictiveDatas
    this.overView = data.overView
    this.prodictivemenu = data.prodictivemenu
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'mostAccident',
  templateUrl: './mostAccident.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MostAccidentModel {
  mostAccidentDatas;
  overView;

  constructor(public dialogRef: MatDialogRef<MostAccidentModel>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mostAccidentDatas = data.mostAccidentDatas
    this.overView = data.overView
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'mostAlarms',
  templateUrl: './mostAlarms.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MostAlarmsModel {
  mostAlarmDatas;
  overView;

  constructor(public dialogRef: MatDialogRef<MostAlarmsModel>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mostAlarmDatas = data.mostAlarmDatas
    this.overView = data.overView
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'mostStateOrAverage',
  templateUrl: './mostStateOrAverage.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MostStateOrAverageModel {
  mostProdictiveDatas;
  overView; prodictivemenu;
  titile;
  constructor(public dialogRef: MatDialogRef<MostStateOrAverageModel>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mostProdictiveDatas = data.mostProdictiveDatas
    this.overView = data.overView
    this.prodictivemenu = data.prodictivemenu
    this.titile = data.titile
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'mostHottestModel',
  templateUrl: './mostHottestModel.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MostHottestModel {
  mostProdictiveDatas;
  overView; prodictivemenu;
  titile;
  constructor(public dialogRef: MatDialogRef<MostHottestModel>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mostProdictiveDatas = data.mostProdictiveDatas
    this.overView = data.overView
    this.prodictivemenu = data.prodictivemenu
    this.titile = data.titile
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'mostAlarmOrCharges',
  templateUrl: './mostAlarmOrCharges.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MostAlarmOrChargesModel {
  mostProdictiveDatas;
  overView; prodictivemenu;
  titile;
  constructor(public dialogRef: MatDialogRef<MostAlarmOrChargesModel>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mostProdictiveDatas = data.mostProdictiveDatas
    this.overView = data.overView
    this.prodictivemenu = data.prodictivemenu
    this.titile = data.titile
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

