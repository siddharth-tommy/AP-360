import { Component, OnInit, ElementRef, ViewChild, Inject, OnDestroy } from '@angular/core';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material'; import { ToastrService } from 'ngx-toastr';
import { BatteriesSidebarComponent } from './batteries-sidebar/batteries-sidebar.component';
import { Subscription } from 'rxjs';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import * as moment from 'moment';
import { FilterbydepartmentComponent } from 'src/app/batteries/filterbydepartment/filterbydepartment.component';

@Component({
  selector: 'batteries-component',
  templateUrl: './batteries.component.html',
  styleUrls: ['./batteries.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('10ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]

})
export class BatteriesComponent implements OnInit, OnDestroy {

  private serviceSubscription: Subscription;
  commTotal: boolean = false;
  commOnline: boolean = false;
  commOffline: boolean = false;
  commOutofRange: boolean = false;
  filteredViewBy: boolean = false;
  ngOnDestroy() {
    // empty
    this.serviceSubscription.unsubscribe();
  }
  prodictivitylinechart: any;
  maintenancedoughnutchart: any;
  constructor(public assetprohelperService: AssetprohelperService, private toastr: ToastrService, public dialog: MatDialog
  ) {

  }
  siteId: string = ''
  siteName: string = ''

  expandedElement: null;
  loader: boolean = false;
  displayedColumns: string[] = ['select', 'name', 'AssetTypeName', 'LastSeen', 'OperatorName', 'EventName', 'seemore'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('batteriessidebarComponent') batteriessidebarComponent: BatteriesSidebarComponent

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //this.siteId = localStorage.getItem('selectitemId')
    //this.departmentLists()
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.filters = []
      this.departmentList = []
      this.showAlarms = false
      this.tableFilter = ''
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
        this.loadTable();
        this.loadPlugins('WEEK')
        this.loadusageDounut('WEEK', this.siteId);
        this.loadAlarms('WEEK');
        this.overAllFunction();
        this.batteriessidebarComponent.closeHelpcontainer();
      } else {
        this.siteId = '';
      }
      this.dataSource.filter = '';
    })
  }
  communicationFilter(value) {
    this.filters = []
    this.commTotal = false;
    this.commOnline = false;
    this.commOffline = false;
    this.commOutofRange = false;
    if ('TOTAL' == value) {
      this.commTotal = true;
    } else if ('ONLINE' == value) {
      this.commOnline = true;
    }
    else if ('OFFLINE' == value) {
      this.commOffline = true;
    }
    else if ('OUTOFRANGE' == value) {
      this.commOutofRange = true;
    }

    this.loadAllFunction();
  }
  loadAllFunction() {
    this.loadTable();
    this.loadPlugins(this.pluginsOfType);
    this.loadAlarms(this.alarmType);
    this.loadusageDounut(this.maintenanceType, this.siteId)
  }
  filterViewBy(data) {
    this.filters = []
    this.selectedFilter = data
    this.filteredViewBy = true;
    this.loadAllFunction();

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
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
    this.dataSource.filter = ''
    this.tableFilter = '';
    //  }, 1000);
  }
  prodictivitychart(x, y, fromDate, toDate) {
    let chart = "#169bd722";
    let bottomLabel = this.getDates(fromDate, toDate);
    let count = 0
    let stepSize = 10
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
    let maxvalue = 100;
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
    let fontcolor = "#1d3d57"
    if (this.pluginsOfType == 'PAST 2 WEEKS') {
      fontcolor = "#fff";
    }
    if (this.pluginsOfType == 'MONTH') {
      fontcolor = "#fff";
    }
    if (this.prodictivitylinechart) this.prodictivitylinechart.destroy();
    this.prodictivitylinechart = new Chart('batterylineChart1', {
      type: 'line',
      data: {
        "labels": bottomLabel,
        "datasets": [{
          //"label": "Body Weight Lost",
          "data": x,
          "borderColor": "#169bd7",
          "backgroundColor": chart,
          "lineTension": 0,
          "borderWidth": 1,
          "fill": true
        },
        {
          //"label": "Body Weight Lost",
          "data": y,
          "borderColor": "#e8e8e8",
          "backgroundColor": "#e8e8e822",
          "lineTension": 0,
          "borderWidth": 1,
          "fill": true
        }
        ]
      },
      options: {
        onClick: this.pluginsClick,
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
              fontColor: fontcolor,
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
  pluginsClick(a, clickedElement, c) {
    console.log(a);
    console.log(clickedElement);
    console.log(c);
  }


  doughnutchart(x, smallldevice) {
    //this.maintenancedoughnutchart.update();
    let paddingRunTime = 7;
    if (screen.availWidth >= 1920) {
      paddingRunTime = 19;
    } else if (screen.availWidth <= 1280) {
      paddingRunTime = 6;
    }

    if (this.maintenancedoughnutchart) this.maintenancedoughnutchart.destroy();
    this.maintenancedoughnutchart = new Chart('batterydoughnutChart', {

      type: 'doughnut',
      data: {
        labels: ["Charged", "Discharged ", "Idle", "Equalizing", "Cooling"],
        //  radius: "40%",
        //innerRadius: 90,
        //innerRadius: "75%",
        datasets: [
          {
            label: "Maintenance",
            backgroundColor: ["#b3e7ff", "#169bd7", "#ea4256", "#50e3c2", "#b18a8a"],
            data: x,
          }
        ]
      },
      options: {
        onClick: this.usageClick,
        //circumference: 90,
        //rotation: 0.10 * Math.PI,
        //  percentageInnerCutout: '90%',
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
          position: 'right',
          labels: {
            fontColor: '#4a4a4a',
            padding: paddingRunTime,  //space between labels
            usePointStyle: true, //Border radius
            boxWidth: 15  //Box width
          }
        },
        layout: {
          padding: 25
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
  usageClick(a, clickedElement, c) {
    console.log(a);
    console.log(clickedElement);
    console.log(c);
  }
  bargraph: any;
  alarmschart(x, y, label) {
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

    let newlabel = []
    label.forEach(c => { if (newlabel != null) newlabel.push((c.split(' ')[0])); else newlabel.push('') })
    if (document.getElementById("battery-bar-chart-grouped") == null) return;
    if (this.bargraph) this.bargraph.destroy();
    this.bargraph = new Chart(document.getElementById("battery-bar-chart-grouped"), {
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
        onClick: this.alarmsClick,
        plugins: {
          labels: false
        },
        title: {
          display: false,
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
            barThickness: 5,
            ticks: {
              fontSize: 10,
              fontColor: "#1d3d57",
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
  alarmsClick(a, clickedElement, c) {
    console.log(a);
    console.log(clickedElement);
    console.log(c);
  }

  usageDatas = []
  maintenanceType = 'WEEK';
  maintenanceTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  maintenanceDatas = []
  maintenanceRecordEnable: boolean = false

  loadusageDounut(value, actualID) {
    try {
      this.maintenanceDatas = []
      if (value != null) {
        this.maintenanceType = value;
      }
      if (actualID == undefined) {
        actualID = this.siteId;
      }

      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);
      let usageParameters: any = {
        "SiteID": this.siteId,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }
      if (this.commTotal) {
        usageParameters.Communication = 'OVERALL'
      }
      if (this.commOnline) {
        usageParameters.Communication = 'ONLINE'
      }
      if (this.commOffline) {
        usageParameters.Communication = 'OFFLINE'
      }
      if (this.commOutofRange) {
        usageParameters.Communication = 'OUTOFRANGE'
      }
      if (this.filteredViewBy) {
        usageParameters.Filter = this.selectedFilter.id
      }

      this.maintenanceRecordEnable = false
      this.loader = true;
      this.assetprohelperService.PostMethod('Asset/GetAssetBatteryUsageDetails', usageParameters).subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.maintenanceDatas = body.Data;
        let chartDatas = []
        let tempData;
        if (this.maintenanceDatas.length > 0) {
          this.maintenanceDatas = this.maintenanceDatas;
          tempData = this.maintenanceDatas[0];
          chartDatas.push(tempData.Charged);
          chartDatas.push(tempData.Discharged);
          chartDatas.push(tempData.Idle);
          chartDatas.push(tempData.Equalizing);
          chartDatas.push(tempData.Cooling);
          this.doughnutchart(chartDatas, null);
          if ((tempData.Charged == undefined || tempData.Charged == null || tempData.Charged == 0 || tempData.Charged == '')
            && (tempData.Cooling == undefined || tempData.Cooling == null || tempData.Cooling == 0 || tempData.Cooling == '')
            && (tempData.Discharged == undefined || tempData.Discharged == null || tempData.Discharged == 0 || tempData.Discharged == '')
            && (tempData.Equalizing == undefined || tempData.Equalizing == null || tempData.Equalizing == 0 || tempData.Equalizing == '')
            && (tempData.Idle == undefined || tempData.Idle == null || tempData.Idle == 0 || tempData.Idle == '')
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
  pluginsOfDatas = []
  pluginsOfType = 'WEEK';
  pluginsOfTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  pluginsStartDay;
  pluginsStartDate;
  pluginsEndDay;
  pluginsEndDate;
  fromDate1 = '';
  toDate1 = '';

  loadPlugins(value) {
    this.pluginsOfType = value

    let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

    let fromD = startDates.toString().split(' ');
    let endDat = endDates.toString().split(' ');
    this.pluginsStartDate = new Date(startYear + '-' + startMonth + '-' + startDate);
    this.pluginsEndDate = new Date(endYear + '-' + endMonth + '-' + endDate);
    this.pluginsStartDay = startDate
    this.pluginsEndDay = endDate;
    this.fromDate1 = fromD[1] + ',' + startDate
    this.toDate1 = endDat[1] + ',' + endDat[2];
    this.loader = true;

    let plugInParameters: any = {
      "SiteID": this.siteId,
      "StartDate": startYear + '-' + startMonth + '-' + startDate,
      "EndDate": endYear + '-' + endMonth + '-' + endDate
    }
    if (this.commTotal) {
      plugInParameters.Communication = 'OVERALL'
    }
    if (this.commOnline) {
      plugInParameters.Communication = 'ONLINE'
    }
    if (this.commOffline) {
      plugInParameters.Communication = 'OFFLINE'
    }
    if (this.commOutofRange) {
      plugInParameters.Communication = 'OUTOFRANGE'
    }
    if (this.filteredViewBy) {
      plugInParameters.Filter = this.selectedFilter.id
    }
    this.assetprohelperService.PostMethod('Asset/GetAssetBatteryChart', plugInParameters).subscribe(data => {
      this.loader = false;
      let actual = []
      let expectedData = [];
      let body: any = JSON.parse(data['_body']);
      this.pluginsOfDatas = body.Data;

      let tempDatas = body.Data;
      if (this.pluginsOfDatas == undefined || this.pluginsOfDatas == null || body.Data.length == 0) {
        this.prodictivitychart([], [], startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);
      } else {
        actual = tempDatas.Actual
        expectedData = tempDatas.Expected
        this.prodictivitychart(actual, expectedData, startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);
      }
    });
  }
  alarmsList: any = []
  alarmType: string = 'WEEK';
  alarOfTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
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
      let alarmChartParameters: any = {
        "SiteID": this.siteId,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }
      if (this.commTotal) {
        alarmChartParameters.Communication = 'OVERALL'
      }
      if (this.commOnline) {
        alarmChartParameters.Communication = 'ONLINE'
      }
      if (this.commOffline) {
        alarmChartParameters.Communication = 'OFFLINE'
      }
      if (this.commOutofRange) {
        alarmChartParameters.Communication = 'OUTOFRANGE'
      }
      if (this.filteredViewBy) {
        alarmChartParameters.Filter = this.selectedFilter.id
      }
      this.loader = true;
      this.assetprohelperService.PostMethod('Asset/GetAssetBatteryAlarmChart', alarmChartParameters).subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.alarmsList = body.Data[0];
        if (body.Data.length == 0 || this.alarmsList == undefined || this.alarmsList.length == 0) {
          this.alarmschart([], [], []);
        } else {
          this.alarmschart(this.alarmsList.Actioned, this.alarmsList.Unactioned, this.alarmsList.EventName);
        }

      });
    } catch (exception) {
      console.log(exception);
    }
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
    //this.batteriessidebarComponent.opensideBar();
    this.batteriessidebarComponent.opensideBar(data, datas, this.subGridDatas)
    //  this.sidebarComponent.opensideBar()
  }
  tableDatas = []
  tableMainValues = []
  loader2 = false;
  // filtersViewBy(){
  //   this.filterViewBy=true;
  //   this.loadTable();
  //   this.loadPlugins(this.pluginsOfType);
  //   this.loadAlarms(this.alarmType);
  //   this.loadusageDounut(this.maintenanceType, this.siteId);
  // }



  loadTable() {
    this.loader2 = true;
    let paraMeters: any = { "SiteID": this.siteId }
    if (this.commTotal) {
      //paraMeters.Communication= "OVERALL";
    }
    if (this.commOnline) {
      paraMeters.Communication = "ONLINE";
    }
    if (this.commOffline) {
      paraMeters.Communication = "OFFLINE";
    }
    if (this.commOutofRange) {
      paraMeters.Communication = "OUTOFRANGE";
    }
    if (this.filteredViewBy) {
      paraMeters.Filter = this.selectedFilter.id
    }
    if (this.departmentFilter) {
      paraMeters.Dept = this.departmentList.toString()
    }
    this.assetprohelperService.PostMethod('Asset/GetBatteriesAssetTableBySiteID', paraMeters)
      .subscribe(data => {
        this.loader2 = false;
        let body: any = JSON.parse(data['_body']);
        this.tableDatas = body.Data;
        this.dataSource.data
        let newvalue = []
        // for (let n in this.tableDatas) {
        //   let s = {
        //     ID: this.tableDatas[n].UniqueID, LastSeen: this.tableDatas[n].LastSeen, 'assettype': this.tableDatas[n].AssetTypeName,
        //     name: this.tableDatas[n].name, symbol: 'H', Current_operator: this.tableDatas[n].OperatorName,
        //     curren_alarms: this.tableDatas[n].EventName, 'EventDate': this.tableDatas[n].EventDate,
        //     'UniqueID': this.tableDatas[n].ID, 'Status': this.tableDatas[n].Status,LastSeenDate:this.tableDatas[n].LastSeenDate,LastSeenTime:this.tableDatas[n].LastSeenTime,
        //     CurrentStatus:this.tableDatas[n].CurrentStatus,AlarmDate:this.tableDatas[n].AlarmDate
        //   };
        //   newvalue.push(s)
        // }
        this.tableMainValues = this.tableDatas
        this.dataSource.data = this.tableDatas;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    this.tableFilter = '';
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
      this.assetprohelperService.PostMethod('Asset/GetBatteriesAssetTableDetailsByID', { "ID": element.ID })
        .subscribe(data => {
          this.loader = false;
          let body: any = JSON.parse(data['_body']);
          this.subGridDatas = body.Data[0];
          this.expanded = false;
          //var RentalTimerDataJSON = body.Data[0].RentalTimerDataJSON
          //RentalTimerDataJSON = RentalTimerDataJSON.substr(8);
          //RentalTimerDataJSON = RentalTimerDataJSON.substring(0, RentalTimerDataJSON.length - 1);
          //this.subGridDatas.RentalTimerDataJSON = JSON.parse(RentalTimerDataJSON);
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
  availableType = [{ id: 1, value: 'Get F/W Version' }, {
    id: 2, value: 'Update Firmware',
  }, { id: 3, value: 'Reupload Settings' }, { id: 5, value: 'Move to Stock' }, { id: 7, value: 'Swap' },
  { id: 8, value: 'Request Status' }]
  available: string = '';
  openDialog(data) {
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    if (numRows == 0) {
      setTimeout(() => {
        this.available = undefined
      }, 100);

      this.toastr.warning("No Records Found!", "Warning");
      return;
    }
    else if (numSelected == 0) {
      setTimeout(() => {
        this.available = undefined
      }, 100);
      this.toastr.warning("Please select Asset(s)", "Warning");
      return;
    }
    else if ((data.id == 1 || data.id == 2 || data.id == 4 || data.id == 5 || data.id == 6) && numSelected != numRows) {
      setTimeout(() => {
        this.available = undefined
      }, 100);
      this.toastr.warning("Please select All Asset(s)", "Warning");
      return;
    }
    else if (numSelected != 1 && (data.id == '3' || data.id == '8')) {
      setTimeout(() => {
        this.available = undefined
      }, 100);
      this.toastr.warning("Maximum  Asset(s) should one", "Warning");
      return;
    } else if (numSelected != 2 && data.id == '7') {
      setTimeout(() => {
        this.available = undefined
      }, 100);
      this.toastr.warning("Maximum  Asset(s) should two", "Warning");
      return;
    }
    let parent = this;
    let dialogRef = this.dialog.open(SubPopupBatteriesDialog, {
      data: { name: data.value }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.available = undefined
      parent.selection.clear()
    });

  }



  filterTypeList = [
    { id: 1, value: 'Idling' },
    { id: 2, value: 'Charging' },
    { id: 3, value: 'Discharging' },
    { id: 4, value: 'Equalizing' },
    { id: 5, value: 'Cooling' },
    { id: 6, value: 'Low Water' },
    { id: 7, value: 'Pm Due' },
    { id: 8, value: 'Over Voltage' },
    { id: 9, value: 'Low SoC Alert' },
    { id: 10, value: 'Low SoC Alarm' },
    { id: 11, value: 'Low Voltage' },
    { id: 12, value: 'Over Temperature' },
    { id: 13, value: 'Over Cable Temp' },
    { id: 14, value: 'MisPick' },
    { id: 15, value: 'Out Of Range' }
  ]
  // filterTypeList = ['View by', 'Departments']

  selectedFilter: any = '';
  showAlarms: boolean = false;
  departmentList = [];
  departmentFilter = false;
  // DepartmentId = '';

  // departmentLists() {
  //   let id;
  //   var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
  //   if (id != undefined) {
  //     computedID = id;
  //   }
  //   let url = 'TrackingHistory/departmentlistwithsite?id=' + computedID;
  //   this.departmentList = [];
  //   this.Department = ''
  //   this.DepartmentId = ''
  //   this.assetprohelperService.GetMethod(url).subscribe(
  //     data => {
  //       let body: any = JSON.parse(data['_body']);
  //       this.departmentList = body.Data;

  //     })
  // }
  filterByDepartment() {

    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }
    let subdialogRef = this.dialog.open(FilterbydepartmentComponent, {
      width: width,

      data: { departmentList: this.departmentList }
    });
    let parent = this;
    subdialogRef.afterClosed().subscribe(result => {
      debugger
      if (result != undefined) {
        parent.departmentList = result;
        if (parent.departmentList.length != 0) {
          parent.departmentFilter = true;
          parent.loadTable();
        }
      }
    });

  }

  clearAllFilters() {
    this.commTotal = false;
    this.commOnline = false;
    this.commOffline = false;
    this.commOutofRange = false;
    this.departmentFilter = false;
    this.departmentList = []
    // this.filterViewBy=false;
    this.loadAllFunction();
    this.filters = [];
  }
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
  overAllList: any = []
  overAllFunction() {
    this.loader = true;
    try {
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction('WEEK');

      this.assetprohelperService.PostMethod('Asset/GetAssetBatteryCommunication', {
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
export class SubPopupBatteriesDialog {
  constructor(public dialogRef: MatDialogRef<SubPopupBatteriesDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
