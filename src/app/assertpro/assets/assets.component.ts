import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy, HostListener, AfterContentInit } from '@angular/core';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';;
import { SidebarComponent } from './sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { MailComponent } from './mail/mail.component';
import { ConfirmationDailog } from '../usersdirectory/usersdirectory.component';
import { UserMenuService } from 'src/app/share/services/usermenu.service';
import * as moment from 'moment';
export interface PeriodicElement {
  ID: string;
  LastSeen: string
  position: number;
  weight: number;
  symbol: string;
  assettype: string
  Current_operator: string;
  curren_alarms: string;
}
@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
  //  providers:[AssetprohelperService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('10ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]

})
export class AssetsComponent implements OnInit, OnDestroy, AfterContentInit {
  // dataSource = ELEMENT_DATA;
  loader: boolean = false;
  displayedColumns: string[] = ['select',  'name', 'AssetTypeName', 'LastSeen','CurrentStatus', 'OperatorName', 'Status', 'EventName', 'seemore'];
  @ViewChild('sidebarComponent') sidebarComponent: SidebarComponent
  expandedElement: null;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('barchart1') barchart1: ElementRef;
  /** Whether the number of selected elements matches the total number of rows. */
  tabType: string = 'equipment';
  userRole: string;
  showMessageIcon: boolean = true;
  Current_operator: boolean;

  constructor(public assetprohelperService: AssetprohelperService, private _router: Router, private toastr: ToastrService,
    public dialog: MatDialog, public usermenu: UserMenuService) {
      this.menuserviceSubscription = this.usermenu.menuModel$.subscribe(data => {
        this.equipmentEnable = false
        this.batteriesEnable = false
        this.chargesEnable = false
        this.gateways = false;
        if (Object.keys(data).length != 0) {
          data.filter(row => {
            if (row.MenuName == "Asset") {
              if (row.ScreenName == "Equipment") {
                this.equipmentEnable = true
              }
              else if (row.ScreenName == "Batteries") {
                this.batteriesEnable = true
              }
              else if (row.ScreenName == "Chargers") {
              this.chargesEnable = true
              }
              else if (row.ScreenName == "Gateways") {
                this.gateways = true;
              }
            }
          });
          if (!this.equipmentEnable && !this.batteriesEnable && !this.chargesEnable && !this.gateways) {
            this._router.navigate(['/home/pagemap']);
            return;
          }
          if (!this.equipmentEnable && this.batteriesEnable) {
            this.tabType == 'batteries'
          } else if (!this.batteriesEnable && this.chargesEnable) {
            this.tabType == 'charges'
          }
          else if (!this.chargesEnable && this.gateways) {
            this.tabType == 'head'
          }
  
        } else {
          this._router.navigate(['/home/pagemap']);
        }
      });
  }
  private serviceSubscription: Subscription;
  ngOnInit() {
    this.siteName = localStorage.getItem('sitename');
    this.siteId = localStorage.getItem('selectitemId')
    // this.userRole=localStorage.getItem('role');
    // if(){

    // }
    // else{

    // }
    this.loader = true;
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe((data) => {
      if (!data) {
        return;
      }
      
      this.loader = false;
      this.filters = []
      this.showAlarms = false
      this.tableFilter = ''
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
        this.tableFilter = ''
      }

      else {
        this.siteId = '';
        //this.toastr.warning("Single Site is  Mandatory", "Warning");
        // this._router.navigate(['/home/pagemap']);
        return;
      }
      this.equipmentEnable2 = false
      this.batteriesEnable2 = false
      this.chargesEnable2 = false
      this.gateways2=false;
      if (data && data.ServiceAndProduct.length > 0) {
        for (let i = 0; i < data.ServiceAndProduct.length; i++) {
          if (data.ServiceAndProduct[i].Status == 'Y') {
            if (data.ServiceAndProduct[i].UniqueKey == 'ULTIMATE' ||
              data.ServiceAndProduct[i].UniqueKey == 'ADVANCED' ||
              data.ServiceAndProduct[i].UniqueKey == 'VITAL') {
              this.equipmentEnable2 = true;
            }
            if (data.ServiceAndProduct[i].UniqueKey == 'CELLTRAC') {
            this.batteriesEnable2 = true;
            }
            if (data.ServiceAndProduct[i].UniqueKey == 'MOMENTUS' ||
              data.ServiceAndProduct[i].UniqueKey == 'ATLUS' ||
              data.ServiceAndProduct[i].UniqueKey == 'ATLUSPLUS') {
                this.chargesEnable2 = true;
            }
            if(data.ServiceAndProduct[i].UniqueKey == 'GATEWAY'){
              this.gateways2=true;
            }
          }
        }

        if (this.equipmentEnable && this.equipmentEnable2) {
          this.tabType = 'equipment'
          this.tabTypeChanged(this.tabType);
        }
        else if (this.batteriesEnable && this.batteriesEnable2) {
          this.tabType = 'batteries'
          this.tabTypeChanged(this.tabType);
        } else if (this.chargesEnable &&  this.chargesEnable2) {
          this.tabType = 'charges'
          this.tabTypeChanged(this.tabType);
        }
        else if (this.gateways  && this.gateways2) {
          this.tabType = 'head'
          this.tabTypeChanged(this.tabType);
        }
      }
      this.dataSource.filter = '';
      if(this.sidebarComponent!=undefined){
        this.sidebarComponent.closeHelpcontainer()
      }
      this.LoadUsageOf('WEEK', this.siteId);
      this.loadMaintenance('WEEK', this.siteId);
      this.overAllFunction();
      this.loadAlarms('WEEK');
      this.loadTable();
    });
  
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngAfterContentInit() {

  }
  ngOnDestroy() {
    // empty
    if (this.serviceSubscription != undefined)
      this.serviceSubscription.unsubscribe();
    if (this.menuserviceSubscription != undefined)
      this.menuserviceSubscription.unsubscribe();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  @ViewChild('lineChart1') lineChart1: ElementRef;
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  filters: any = []
  tableFilter: string = '';
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  filterEnter(event) {
    if (event.keyCode == 13) {
      let value = event.target.value;
      if (value.trim() != '') {
        value.trim().toLowerCase()
        this.filters.push(value);
      }
      var filteredData = this.dataSource.filteredData;
      this.dataSource.data = filteredData;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.tableFilter = '';
    }
  }
  RemoveFilterItem(index) {
    this.filters.splice(index, 1);
    //  setTimeout(() => {
    this.dataSource.data = this.tableMainValues
    this.filters.forEach(a => {
      this.dataSource.filter = a.trim().toLowerCase();
      var filteredData = this.dataSource.filteredData;
      this.dataSource.data = filteredData;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filter = '';
    this.tableFilter = '';
    //  }, 1000);

  }
  private menuserviceSubscription: Subscription;
  showEquipmentTab: boolean;
 

  equipmentEnable = false;
  batteriesEnable = false;
  chargesEnable = false;
  gateways = false;
  equipmentEnable2 = false;
  batteriesEnable2 = false;
  chargesEnable2 = false;
  gateways2 = false;

  siteId: string = ''
  siteName: string = ''
  prodictivitylinechart: any;
  maintenancedoughnutchart: any;
  udmenu: any = 'operators';
  performermenu: any = 'productivity';
  troublemakermenu: any = 'impacts';
  udmenuactive(menu) {
    this.udmenu = menu;
  }

  performerdiv(menu) {
    this.performermenu = menu;
  }

  troublemakerdiv(menu) {
    this.troublemakermenu = menu;
  }


  prodictivitychart() {
    let chart = "#169bd722";
    // gradientStroke = chart.createLinearGradient(500, 0, 100, 0);
    // gradientStroke.addColorStop(0, "#80b6f4");
    // gradientStroke.addColorStop(1, "#f49080");
    if (this.prodictivitylinechart)
      this.prodictivitylinechart.destroy();
    this.prodictivitylinechart = new Chart('lineChart1', {
      type: 'line',
      data: {
        "labels": ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        "datasets": [{
          // "label": "Body Weight Lost",
          "data": [60, 70, 60, 60],
          "borderColor": "#169bd7",
          "backgroundColor": chart,
          "lineTension": 0,
          "borderWidth": 1,
          "fill": true
        },
        {
          // "label": "Body Weight Lost",
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
        responsive: true,
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
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //event.target.innerWidth;
    if (this.maintenancedoughnutchart) {
      if (this.previsousData != undefined && this.previsousData.length != 0) {
        if (event.target.outerWidth <= 450) {
          this.doughnutchart(this.previsousData, 'xl');
        }
        else if (event.target.outerWidth <= 1300) {
          this.doughnutchart(this.previsousData, 'sm');
        } else {
          this.doughnutchart(this.previsousData, null);
        }
      }
    }
  }
  @HostListener('window:onload', ['$event'])
  onLoad(event) {
    //event.target.innerWidth;

    if (this.maintenancedoughnutchart) {
      if (this.previsousData != undefined && this.previsousData.length != 0) {
        if (event.target.outerWidth <= 450) {
          this.doughnutchart(this.previsousData, 'xl');
        } if (event.target.outerWidth <= 1300) {
          this.doughnutchart(this.previsousData, 'sm');
        } else {
          this.doughnutchart(this.previsousData, null);
        }
      }
    }
  }

  // Doughnut Chart - 
  previsousData = []
  doughnutchart(x, smallldevice) {
    this.previsousData = x;
    let paddingRunTime = 10;
    let cutout = 70;
    let padding = 25;
    let position = 'right'
    if (screen.availWidth <= 1300 || smallldevice != null) {
      position = 'bottom'
      paddingRunTime = 1;
      padding = 1;
    }
    //this.maintenancedoughnutchart.update();

    if (screen.availWidth >= 1920) {
      paddingRunTime = 24;
    }
    else if (screen.availWidth >= 1550) {
      paddingRunTime = 17;
    }
    else if (screen.availWidth <= 1280) {
      paddingRunTime = 8;
    }
    if (this.maintenancedoughnutchart)
      this.maintenancedoughnutchart.destroy();
    this.maintenancedoughnutchart = new Chart('doughnutChart', {
      type: 'doughnut',
      data: {
        labels: ["Upcoming", "In Maintenance ", "Overdue", "Completed"],
        // radius: "20%",
        datasets: [
          {
            label: "Maintenance",
            backgroundColor: ["#b3e7ff", "#169bd7", "#ea4256", "#50e3c2"],
            data: x,
          }
        ]
      },
      options: {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        cutoutPercentage: cutout,
        plugins: {
          labels: {
            render: 'value',
            fontSize: '12%',
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
            fontColor: '#4a4a4a',
            fontSize: 10,
            padding: paddingRunTime,  //space between labels
            usePointStyle: true, //Border radius
            // boxWidth: 15  //Box width
          }
        },
        layout: {
          padding: padding
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
  overAllList = []
  overAllFunction() {
    this.loader = true;
    try {
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction('WEEK');

      this.assetprohelperService.PostMethod('Asset/GetAssetEquipmentDetails', {
        "SiteID": this.siteId,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }).subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.overAllList = body.Data[0];
      });
    } catch (exception) {
      console.log(exception);
    }
  }
  alarmsList: any = []
  alarmType: string = 'WEEK';
  fromDate2 = '';
  toDate2 = '';
  loadAlarms(value) {
    try {
      if (value != null) {
        this.alarmType = value;
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      let fromD = startDates.toString().split(' ');
      let endDat = endDates.toString().split(' ');
      this.fromDate2 = fromD[1] + ',' + startDate
      this.toDate2 = endDat[1] + ',' + endDat[2];
      this.loader = true;
      this.assetprohelperService.PostMethod('Asset/GetAssetAlarmChart', {
        "SiteID": this.siteId,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }).subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.alarmsList = body.Data[0];
        if (this.alarmsList == undefined) {
          this.accidentschart([], [], []);
        } else {
          this.accidentschart(this.alarmsList.Actioned, this.alarmsList.Unactioned, this.alarmsList.EventName);
        }
      });
    } catch (exception) {
      console.log(exception);
    }
  }
  equipmentList = []
  equipmentType: string = 'WEEK';
  equpimentStartDay;
  equpimentStartDate;
  equpimentEndDay;
  equpimentEndDate;
  fromDate1 = ''
  toDate1 = ''
  LoadUsageOf(value, actualID) {
    try {
      if (value != null) {
        this.equipmentType = value;
      }
      if (actualID == undefined) {
        actualID = this.siteId;
      }
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      this.equpimentEndDay = endDate;
      this.equpimentStartDay = startDate;
      this.equpimentStartDate = new Date(startYear + '-' + startMonth + '-' + startDate);
      this.equpimentEndDate = new Date(endYear + '-' + endMonth + '-' + endDate);
      let fromD = startDates.toString().split(' ');
      let endDat = endDates.toString().split(' ');
      this.fromDate1 = fromD[1] + ',' + startDate
      this.toDate1 = endDat[1] + ',' + endDat[2];
      this.loader = true;
      this.assetprohelperService.PostMethod('Asset/GetAssetEquipmentChart', {
        "SiteID": actualID,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }).subscribe(data => {
        this.loader = false;
        let actual = []
        let expectedData = [];
        let body: any = JSON.parse(data['_body']);
        this.equipmentList = body.Data;
        let tempDatas = body.Data;
        let count = 0;
        let stepSize = 10
        let maxvalue = 40;
        if (body.Data.length != 0) {
          actual = tempDatas.Actual
          expectedData = tempDatas.Expected
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
            stepSize = 100
            maxvalue = count + 100;
          }

          if (maxvalue == 100) {
            stepSize = 20
          }
        }
        let chart = "#169bd722";

        let bottomLabel = this.getDates(startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);

        let fontBackground = "#1d3d57";
        if (this.equipmentType == 'PAST 2 WEEKS') {
          fontBackground = "#fff";
        }
        if (this.equipmentType == 'MONTH') {
          fontBackground = "#fff";
        }
        if (this.prodictivitylinechart)
          this.prodictivitylinechart.destroy();
        this.prodictivitylinechart = new Chart('lineChart1', {
          type: 'line',
          data: {
            "labels": bottomLabel,
            "datasets": [{
              // "label": "Body Weight Lost",
              "data": actual,
              "borderColor": "#169bd7",
              "backgroundColor": chart,
              "lineTension": 0,
              "borderWidth": 1,
              "fill": true
            },
            {
              // "label": "Body Weight Lost",
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
                  fontColor: fontBackground,
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
      });
    } catch (exception) {
      console.log(exception);
    }
  }
  maintenanceDatas = []
  maintenanceType = 'WEEK';
  maintenanceTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  maintenanceRecordEnable: boolean = false
  loadMaintenance(value, actualID) {
    try {
      this.maintenanceDatas = []
      if (value != null) {
        this.maintenanceType = value;
      }
      if (actualID == undefined) {
        actualID = this.siteId;
      }

      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      this.loader = true;
      this.assetprohelperService.PostMethod('Asset/GetAssetMaintenanceDetails', {
        "SiteID": actualID,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }).subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.maintenanceDatas = body.Data;
        let chartDatas = []
        let tempData;
        if (this.maintenanceDatas.length > 0) {
          this.maintenanceDatas = this.maintenanceDatas;
          tempData = this.maintenanceDatas[0];
          chartDatas.push(tempData.Upcoming);
          chartDatas.push(tempData.InMaintenance);
          chartDatas.push(tempData.Overdue);
          chartDatas.push(tempData.Completed);



          this.doughnutchart(chartDatas, null);
          if ((tempData.Completed == undefined || tempData.Completed == null || tempData.Completed == 0 || tempData.Completed == '')
            && (tempData.InMaintenance == undefined || tempData.InMaintenance == null || tempData.InMaintenance == 0 || tempData.InMaintenance == '')
            && (tempData.Overdue == undefined || tempData.Overdue == null || tempData.Overdue == 0 || tempData.Overdue == '')
            && (tempData.Upcoming == undefined || tempData.Upcoming == null || tempData.Upcoming == 0 || tempData.Upcoming == '')
          ) {
            this.maintenanceRecordEnable = true
          } else {
            this.maintenanceRecordEnable = false
          }
        } else {
          this.maintenanceRecordEnable = true
        }

      });
    } catch (exception) {
      console.log(exception);
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
    if (value == null || value == 'WEEK') {
      startDates.setDate(startDates.getDate() + 1)
      startMonth = '' + (startDates.getMonth() + 1);
      startDate = '' + startDates.getDate()
    }
    else if (value == 'PAST 2 WEEKS') {
      startDates = new Date();
      startDates.setDate(startDates.getDate() - 13);
      startDate = '' + startDates.getDate();
      startMonth = '' + (startDates.getMonth() + 1);
      startYear = '' + startDates.getFullYear();
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
      startDates = new Date();
      startDate = '1';
      startMonth = '' + (startDates.getMonth());
      startYear = endYear;
      endDate = '' + new Date(startDates.getFullYear(), startDates.getMonth(), 0).getDate();
      endMonth = '' + (startDates.getMonth());
      endYear = endYear
    }
    else if (value == 'LAST THREE MONTHS') {
      startDate = '1';
      startMonth = '' + (new Date().getMonth() - 1);
      startYear = endYear;
      endOldMonth = new Date().getMonth() - 3;
      endMonths = new Date();
      endMonths.setMonth(endOldMonth);
      endDate = '' + endMonths.getDate();
      endMonth = '' + (new Date().getMonth() + 1);
      endYear = '' + endMonths.getFullYear();
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
  barchart: any;
  accidentschart(x, y, label) {
    let count = 0;
    let stepSize = 10
    let maxvalue = 40;
    x.forEach(a => {
      if (a > count) {
        count = a;
      }
    });
    y.forEach(a => {
      if (a > count) {
        count = a;
      }
    });
    if (count <= 10) {
      maxvalue = 20;
    }
    else if (count <= 30) {
      maxvalue = 40;
    }

    else if (count <= 40) {
      maxvalue = 50
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
    let newlabel = []
    label.forEach(c => { if (newlabel != null) newlabel.push((c.split(' ')[0])); else newlabel.push('') })
    //console.log(this.barchart1.nativeElement.innerHTML);
    if (document.getElementById("bar-chart-grouped") == null) return;
    if (this.barchart) this.barchart.destroy();
    this.barchart = new Chart(document.getElementById("bar-chart-grouped"), {
      type: 'bar',
      data: {
        labels: newlabel,
        datasets: [
          {
            backgroundColor: "rgba(167,167,180,0.33)",
            data: x
          }, {
            backgroundColor: "#3e95cd",
            data: y
          }
        ]
      },
      options: {
        plugins: {
          labels: false
        },
        title: {
          display: true,
          fontSize: 0,
        },
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
              beginAtZero: false,
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
            barThickness: 5,
            ticks: {
              fontSize: 10,

              fontFamily: "robotolight",
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
  dataset: any[] = [
    { id: 1, name: 'Ted Right', address: 'Wall Street' },
    { id: 2, name: 'Frank Honest', address: 'Pennsylvania Avenue' },
    { id: 3, name: 'Joan Well', address: 'Broadway' },
    { id: 4, name: 'Gail Polite', address: 'Bourbon Street' },
    { id: 5, name: 'Michael Fair', address: 'Lombard Street' },
    { id: 6, name: 'Mia Fair', address: 'Rodeo Drive' },
    { id: 7, name: 'Cora Fair', address: 'Sunset Boulevard' },
    { id: 8, name: 'Jack Right', address: 'Michigan Avenue' },
  ];
  opensideBar(data, datas) {

    this.sidebarComponent.opensideBar(data, datas, this.subGridDatas)
  }
  tableDatas = []
  tableMainValues = []
  loader2 = false
  loadTable() {
    this.loader2 = true;
    this.assetprohelperService.PostMethod('Asset/GetAssetTableBySiteID', { "SiteID": this.siteId })
      .subscribe(data => {
        this.loader2 = false;
        let body: any = JSON.parse(data['_body']);
        if (body.OperatorName == "N/A") {
          this.showMessageIcon = false;
        }
        this.tableDatas = body.Data;
        // this.dataSource.data
        let newvalue = []
        for (let n in this.tableDatas) {
          let s = {
            ID: this.tableDatas[n].UniqueID, LastSeen: this.tableDatas[n].LastSeen, 'assettype': this.tableDatas[n].AssetTypeName,
            name: this.tableDatas[n].name, symbol: 'H', Current_operator: this.tableDatas[n].OperatorName,
            curren_alarms: this.tableDatas[n].EventName, 'EventDate': this.tableDatas[n].EventDate,
            'UniqueID': this.tableDatas[n].ID, Status: this.tableDatas[n].Status, LastSeenDate: this.tableDatas[n].LastSeenDate, LastSeenTime: this.tableDatas[n].LastSeenTime,
            CurrentStatus: this.tableDatas[n].CurrentStatus, AlarmDate: this.tableDatas[n].AlarmDate
          };
          // newvalue.push(s)
        }
        this.tableMainValues = this.tableDatas
        this.dataSource.data = this.tableDatas;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.tableFilter = '';
      });
  }

  confirmationDialog(value, i) {
    let parent = this;
    let msg = 'Inactive';
    if (value.Status == 'Inactive') {
      msg = 'Active';
    }
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to ' + msg + ' ?' }
    });

    subdialogRef.afterClosed().subscribe(result => {

      if (result != undefined && result == 'Yes') {
        let s = 'Active'
        if (value.Status == 'Active') {
          s = 'Inactive'
        }
        let index = this.tableMainValues.indexOf(value);
        if (index >= 0) {

          parent.activeInactiveFun(value, index, s);
        }

      }
    })
  }
  activeInactiveFun(data, index, val) {
    this.loader = true;
    let parent = this;
    this.assetprohelperService.PostMethod('Asset/UpdateAssetStatusUsingID', { ID: data.ID, Status: val })
      .subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Status) {
          parent.toastr.success(body.Message, 'Success!')
          //parent.dataSource.data[index].Status = val;
          this.loadTable()
        }
        else {
          parent.toastr.warning(body.Message, "Warning");
        }
      });
  }

  subGridDatas;
  expanded: boolean = false;
  loadExpandGrid(element) {
    this.expanded = false;
    this.subGridDatas = undefined;


    this.expandedElement = this.expandedElement === element ? null : element
    if (this.expandedElement) {
      this.expanded = true;
      // this.spinner.show();
      this.loader = true;
      this.assetprohelperService.PostMethod('Asset/GetAssetTableDetailsByID', { "ID": element.ID})
        .subscribe(data => {
          this.loader = false;

          let body: any = JSON.parse(data['_body']);

          this.subGridDatas = body.Data[0];
          this.expanded = false;
          var RentalTimerDataJSON = body.Data[0].RentalTimerDataJSON
          RentalTimerDataJSON = RentalTimerDataJSON.substr(8);
          RentalTimerDataJSON = RentalTimerDataJSON.substring(0, RentalTimerDataJSON.length - 1);
          this.subGridDatas.RentalTimerDataJSON = JSON.parse(RentalTimerDataJSON);

          //  this.spinner.hide();
        });
    }
  }


  updateHmr(element) {
    this.loader = true;
    this.assetprohelperService.PostMethod('Asset/GetAssetUpdateHMRByID', { "ID": element.ID })
      .subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body'])
        if (body.Status) {
          this.toastr.success(body.Message, 'Success!')
        }
        else {
          this.toastr.error(body.Message, 'Error!');

        }
      });
  }

  tabTypeChanged(value) {
    this.showAlarms = false
    this.tabType = value
    if (value == 'equipment') {
      this.LoadUsageOf('WEEK', this.siteId);
      this.loadMaintenance('WEEK', this.siteId);
      this.loadAlarms('WEEK');
      this.loadTable();
    }
    this.tableFilter = ''
    if(this.sidebarComponent!=undefined){
      this.sidebarComponent.closeHelpcontainer()
    }
    this.selection.clear()
    this.filters = []
    this.dataSource.filter = ''
  }
  availableType = [{
    id: 2, value: 'Update Firmware',
  }, { id: 3, value: 'Read Firmware Version' }, { id: 4, value: 'Move to Stock' }
    , { id: 6, value: 'Swap' }, { id: 7, value: 'Send Message' }, { id: 8, value: 'Get HMR' }
    , { id: 9, value: 'Support' }, { id: 10, value: 'Change State' }, { id: 11, value: 'Re-Upload Settings' }]
  available: string = '';
  clearAvailable() {
    setTimeout(() => {
      this.available = undefined
    }, 100);
  }
  openDialog(data) {
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    if (numRows == 0) {
      this.clearAvailable();
      this.toastr.warning("No Records Found!", "Warning");
      return;
    } if (numSelected == 0) {
      this.clearAvailable();
      this.toastr.warning("Please select Asset(s)", "Warning");
      return;
    }
    if ((data.id == 7 || data.id == 10 || data.id == 11) && numSelected != 1) {
      this.clearAvailable();
      this.toastr.warning("Asset(s) should one", "Warning");
      return;
    }
    if (data.id == 6 && numSelected != 2) {
      this.clearAvailable();
      this.toastr.warning("Asset(s) should two", "Warning");
      return;
    }
    if (data.id == 8 && numSelected != numRows) {
      this.clearAvailable();
      this.toastr.warning("All Asset(s) should select", "Warning");
      return;
    }
    if ((data.id == 1 || data.id == 2 ||
      data.id == 3 || data.id == 4 || data.id == 5)
      && (numSelected != 1 && numSelected != numRows)) {
      this.clearAvailable();
      this.toastr.warning("Asset(s) should one or All", "Warning");
      return;
    }
    let parent = this
    if (data.id == 10) {
      let dialogRef = this.dialog.open(SubPopupDialog, {
        data: { name: data.value }

      });

      dialogRef.afterClosed().subscribe(result => {

        let value = dialogRef.componentInstance.selected
        if (value != undefined && value != '') {
          let subdialogRef = this.dialog.open(DialogDataExampleDialog, {
            data: { name: value }
          });
          subdialogRef.afterClosed().subscribe(result => {
            parent.available = undefined
            parent.selection.clear()
          })
        } else {
          parent.selection.clear();
        }
      });
    } else {
      let dialogRef2 = this.dialog.open(DialogDataExampleDialog, {
        data: { name: data.value }
      });
      dialogRef2.afterClosed().subscribe(result => {
        parent.available = undefined
        parent.selection.clear()
      });
    }
  }
  filterTypeList = ['Maintenance Lockout', 'ByPass Mode', 'In Use', 'Not In Use', 'Lease Expired', 'Warranty Expired',
    'Impact Alarm', 'Checklist Alarm', 'PM Approching', 'PM Due', 'Low Fuel', 'Overweight']
  selectedFilter: string = '';
  showAlarms: boolean = false;
  showAlarm() {
    if (this.showAlarms) {
      this.dataSource.data = this.dataSource.data.filter(d => {
        return d.EventName == undefined || d.EventName != 'No Alarms';
      })
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      this.loadTable();
    }

  }
  mailFun(name) {
    let popupHeight = '60%'
    if (screen.availWidth > 1800) {
      popupHeight = '36%'
    }
    let parent = this;
    let dialogRef = this.dialog.open(MailComponent, {

      data: { name: name },
      height: popupHeight,
      width: '35%',

    });
    dialogRef.afterClosed().subscribe(a => {
      if (a != undefined && a == 'Yes') {
        parent.toastr.success("Message Sent Successfully", 'Success!');
      }
    });
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
}

@Component({
  selector: 'dialog-popup',
  templateUrl: 'dialog-popup.html',
})
export class DialogDataExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'sub-popup',
  template: `
  <span style="color:red">{{msg}}</span><br/>
  <mat-radio-group [(ngModel)]="selected">
  <mat-radio-button value="Change to Normal Mode">Change to Normal Mode</mat-radio-button><br>
  <mat-radio-button value="Change to Maintenance Mode">Change to Maintenance Mode</mat-radio-button><br>
  <mat-radio-button value="Change to By-Pass Mode">Change to By-Pass Mode</mat-radio-button><br>
  <mat-radio-button value="Change Impact Learning State">Change Impact Learning State</mat-radio-button><br>
  </mat-radio-group>
  <div mat-dialog-actions  align="end">
  <button mat-button (click)="onNoClick()">Cancel</button>
  <button mat-button (click)="onSubmit()" cdkFocusInitial>Send</button>
</div>
  `,
})
export class SubPopupDialog {
  constructor(public dialogRef: MatDialogRef<SubPopupDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  selected: string = '';
  onNoClick(): void {
    this.selected = '';
    this.dialogRef.close();
  }
  msg = '';
  onSubmit() {
    if (this.selected != undefined && this.selected != '') {
      this.dialogRef.close();
    } else {
      this.msg = 'Please Choose any option'
    }
  }

}