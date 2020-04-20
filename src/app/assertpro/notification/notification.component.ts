import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { DeliveryComponent } from './delivery/delivery.component';
import { IncidentBarComponent } from './incidentbar/incidentbar.component';
import { AdddeliveryComponent } from './add-delivery/adddelivery.component';
import { Subscription } from 'rxjs';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { ConfirmationDailog } from '../usersdirectory/usersdirectory.component';
import { MatDialog, DateAdapter } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { EditoperatorName } from '../usersdirectory/editoperatorname/editoperatorname.component';
import * as moment from 'moment';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  prodictivitylinechart: any;

  @ViewChild('IncidentBarComponent') incidentbar: IncidentBarComponent
  @ViewChild('lineChart1') lineChart1: ElementRef;
  prodictivitylinechart1: any;
  @ViewChild('lineChart2') lineChart2: ElementRef;

  @ViewChild('deliveryComponent') deliveryComponent: DeliveryComponent
  @ViewChild('adddeliveryComponent') adddeliveryComponent: AdddeliveryComponent
  @ViewChild('incidentHistory') incidentHistory: EditoperatorName;


  items = [{ 'sitename': 'Tampa', 'operatorName': 'Billy Richardson', 'assetType': 'Forklift/Asset name #01', type: 'Ignore', remind: false, reportType: '' },
  { 'sitename': 'Boganbury', 'operatorName': 'Gavin Brown', 'assetType': 'Forklift/Asset name #01', type: 'Ignore', remind: false, reportType: '' }
    , { 'sitename': 'New Reannastad', 'operatorName': 'Dennis Moody', 'assetType': 'Forklift/Asset name #01', type: 'Ignore', remind: false, reportType: '' }]
  // items2 = [{ 'adminname': 'Billy Richardson', 'sitename': 'Tampa', 'operatorName': 'Billy Richardson', 'assetType': 'Forklift/Asset name #01', type: 'Ignore', remind: false, reportType: '' },
  // { 'adminname': 'Boganbury', 'sitename': 'Boganbury', 'operatorName': 'Gavin Brown', 'assetType': 'Forklift/Asset name #01', type: 'Ignore', remind: false, reportType: '' }
  //   , { 'adminname': 'New Reannastad', 'sitename': 'New Reannastad', 'operatorName': 'Dennis Moody', 'assetType': 'Forklift/Asset name #01', type: 'Ignore', remind: false, reportType: '' }]
  remindList = ['30 mins', '1 Hour', '2 Hour'];
  items2 = []
  private serviceSubscription: Subscription;
  alartsType = 'WEEK';
  alarmsType = 'WEEK'
  filterTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  fromDateBatter: string = '';
  toDateBatter: string = '';
  fromDateBatter2: string = '';
  toDateBatter2: string = '';
  equipmentType: string;
  constructor(public assetprohelperService: AssetprohelperService, public dialog: MatDialog, public toastr: ToastrService) {

  }
  siteName: string = '';
  maxDate: Date;
  minDate: Date;
  ngAfterViewInit() {
    // this.prodictivitychart();

  }
  // notificationList = ['ALL NOTIFICATIONS', 'Max Skipped Checklist (Alarm)', 'Skipped Checklist (Alarm)', 'Checklist (Alarm)', 'High Impact (Alarm)',
  //   'PM Due (Alarm)', 'Low Fuel (Alarm)', 'Speed (Alarm)', 'GeoFence (Alarm)', 'Overweight (Alarm)', 'Battery High Cable Temperature (Alarm)',
  //   'Battery High Current (Alarm)', 'Battery High Temperature (Alarm)', 'Battery High Voltage (Alarm)', 'Battery Low Soc (Alarm)',
  //   'Battery Low Voltage (Alarm)', 'Battery Low Water (Alarm)', 'Battery Mispick (Alarm)', 'Impact (Alert)', 'Short Checklist (Alert)', 'Inputs Checklist (Alert)',
  //   'Jump Start Attempted (Alert)', 'PM Due Update (Alert)', 'PM Approching (Alert)', 'PM Approching Update (Alert)', 'Operator Idling (Alert)',
  //   'Low Fuel (Alert)', 'Sharp Turning (Alert)', 'Under PM', 'Over PM (Alert)', 'Equalization Due Alert (Alert)', 'High Cable Temperature (Alert)',
  //   'Low Soc (Alert)', 'Mispick (Alert)', 'Installation (Alert)', 'Certification Expiry Approching (Alert)']
  notificationList = []
  selectedNotification = 'ALL NOTIFICATIONS';
  ngOnInit() {
    //this.prodictivitychart([30, 10, 30, 30], [10, 20, 20, 30, 30, 28, 30]);
    //this.prodictivitychart1([30, 10, 30, 30], [10, 20, 20, 30, 30, 28, 30]);

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 7);
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 2);
    this.minDate.setDate(1);
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.selectedNotification = 'ALL NOTIFICATIONS';
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
      }
      else {
        this.siteId = '';
      }
      this.showAlarm = false
      this.alartsType = 'WEEK';
      this.alarmsType = 'WEEK'
      this.loadAlarts('WEEK');
      this.loadAlarms('WEEK');
      this.siteName = localStorage.getItem('sitename');
      this.loadNotificationRecent();
      this.loadNotificationArchived();
      this.tableFilter = ''
      this.incidentbar.closeHelpcontainer()
      this.deliveryComponent.closeHelpcontainer();
      this.adddeliveryComponent.closeHelpcontainer()
      this.incidentHistory.closeHelpcontainer();
    });

  }
 
  siteId = '';
  tableFilter;
  notificationSelection(val) {
    this.selectedNotification = val;
    if (this.selectedNotification != 'ALL NOTIFICATIONS') {
      this.showAlarm = false
    }
   
    this.items = []
    this.items2 = []
    if (this.selectedNotification == 'ALL NOTIFICATIONS') {
      this.items = this.mainListRecent
      this.items2 = this.mainListArchived
    } else {
      if (this.mainListRecent.length > 0)
        this.items = this.mainListRecent.filter(a => {
          return a.EventName == this.selectedNotification
        });
      this.items2 = this.mainListArchived.filter(a => {
        return a.EventName == this.selectedNotification
      });
      //this.items.push(this.mainListRecent[0])
      //this.items2.push(this.mainListArchived[0]);
    }
  }
  alartFromDate: Date;
  alartToDate: Date;
  alartChoose(val) {
    this.alartFromDate = val.value;
    this.alartToDate = new Date(val.value);
    this.alartToDate.setDate(this.alartToDate.getDate() + 6);
    let fromDat = this.alartFromDate.toString().split(' ');
    this.fromDateBatter = fromDat[1] + ',' + fromDat[2]
    let endDat = this.alartToDate.toString().split(' ');
    this.toDateBatter = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.alartFromDate, this.alartToDate)
    this.alartResponce(fromDate, toDate);
  }
  alartArrow(type) {
    if (type == 'left') {
      let to = new Date();
      to.setMonth(to.getMonth() - 3);
      if (this.alartFromDate.toDateString() == to.toDateString()) {
        return;
      }
      this.alartFromDate.setDate(this.alartFromDate.getDate() - 1);
      this.alartToDate.setDate(this.alartToDate.getDate() - 1);
    } else {
      if (this.alartToDate.toDateString() == new Date().toDateString()) {
        return;
      }
      this.alartFromDate.setDate(this.alartFromDate.getDate() + 1);
      this.alartToDate.setDate(this.alartToDate.getDate() + 1);
    }
    let fromDat = this.alartFromDate.toString().split(' ');
    this.fromDateBatter = fromDat[1] + ',' + fromDat[2]
    let endDat = this.alartToDate.toString().split(' ');
    this.toDateBatter = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.alartFromDate, this.alartToDate)
    this.alartResponce(fromDate, toDate);
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
  loadAlarts(value) {
    this.alartsType = value;
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
    this.alartFromDate = new Date(startYear + '-' + startMonth + '-' + startDate)
    this.alartToDate = new Date(endYear + '-' + endMonth + '-' + endDate);
    this.alartResponce(startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);
  }
  alartResponce(fromDate, toDate) {
    let url = 'GetNotificationAlertChart'
    this.loader = true;
    let body: any = {
      "StartDate": fromDate,
      "EndDate": toDate
    }
    if (this.siteId != '') {
      url = 'GetNotificationAlertChartBySiteID'
      body = {
        "SiteID": this.siteId,
        "StartDate": fromDate,
        "EndDate": toDate
      } 
    }
    this.assetprohelperService.PostMethod('Notification/' + url, body).subscribe(data => {
      this.loader = false;
      let actual = []
      let expectedData = [];
      let body: any = JSON.parse(data['_body']);
      //this.equipmentList = body.Data;
      if (body.Data == undefined || body.Data == null && body.Data.length == 0
        || body.Data.Actual.length == 0
        || body.Data.Expected.length == 0) {

        this.prodictivitychart([], [],fromDate,toDate);
      } else {
        let tempDatas = body.Data;
        actual = tempDatas.Actual
        expectedData = tempDatas.Expected
        this.prodictivitychart(actual, expectedData,fromDate,toDate);
      }
    });
  }
  alarmFromDate: Date;
  alarmToDate: Date;
  alarmsChoose(val) {
    this.alarmFromDate = val.value;
    this.alarmToDate = new Date(val.value);
    this.alarmToDate.setDate(this.alarmToDate.getDate() + 6);
    let fromDat = this.alarmFromDate.toString().split(' ');
    this.fromDateBatter2 = fromDat[1] + ',' + fromDat[2]
    let endDat = this.alarmToDate.toString().split(' ');
    this.toDateBatter2 = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.alarmFromDate, this.alarmToDate)

    this.alarmResponce(fromDate, toDate);
  }
  alartsArrow(type) {
    if (type == 'left') {
      let to = new Date();
      to.setMonth(to.getMonth() - 3);
      if (this.alarmFromDate.toDateString() == to.toDateString()) {
        return;
      }
      this.alarmFromDate.setDate(this.alarmFromDate.getDate() - 1);
      this.alarmToDate.setDate(this.alarmToDate.getDate() - 1);
    } else {
      if (this.alarmToDate.toDateString() == new Date().toDateString()) {
        return;
      }
      this.alarmFromDate.setDate(this.alarmFromDate.getDate() + 1);
      this.alarmToDate.setDate(this.alarmToDate.getDate() + 1);
    }
    let fromDat = this.alarmFromDate.toString().split(' ');
    this.fromDateBatter2 = fromDat[1] + ',' + fromDat[2]
    let endDat = this.alarmToDate.toString().split(' ');
    this.toDateBatter2 = endDat[1] + ',' + endDat[2];
    let { fromDate, toDate } = this.getDateFormat(this.alarmFromDate, this.alarmToDate)
    this.alarmResponce(fromDate, toDate);
  }

  loadAlarms(value) {
    this.alarmsType = value;
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

    this.fromDateBatter2 = fromD[1] + ',' + startDate
    this.toDateBatter2 = endDat[1] + ',' + endDat[2];
    this.alarmFromDate = new Date(startYear + '-' + startMonth + '-' + startDate)
    this.alarmToDate = new Date(endYear + '-' + endMonth + '-' + endDate);
    this.alarmResponce(startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate)
  }
  loader = false;
  alarmResponce(fromDate, toDate) {
    this.loader = true;
    let url = 'GetNotificationAlarmChart'
    let body: any = {
      "StartDate": fromDate,
      "EndDate": toDate
    }
    if (this.siteId != '') {
      url = 'GetNotificationAlarmChartBySiteID'
      body = {
        "SiteID": this.siteId,
        "StartDate": fromDate,
        "EndDate": toDate
      }
    }
    this.assetprohelperService.PostMethod('Notification/' + url, body).subscribe(data => {
      this.loader = false;
      let body: any = JSON.parse(data['_body']);
      //this.singleSideAccidentDatas = body.Data;
      let tempDatas = body.Data;
      if (body.Data == undefined || body.Data == null && body.Data.length == 0
        || body.Data.Actual.length == 0
        || body.Data.Expected.length == 0) {
        this.prodictivitychart1([], [],fromDate,toDate);
      } else {
        let actual = tempDatas.Actual
        let expectedData = tempDatas.Expected
        this.prodictivitychart1(actual, expectedData,fromDate,toDate);

      }
    });
  }
  mainListRecent = []
  recentfilter = []
  loadNotificationRecent() {
    this.items = []
    this.notificationList = []
    let siteId = localStorage.getItem('selectitemId')
    this.loader = true
    if (siteId == undefined || siteId == null || siteId == 'null') {
      this.assetprohelperService.GetMethod('Notification/GetNotificationTable').subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Data == null || body.Data == undefined || body.Data.length == 0 || body.Data[0].result == undefined) return;
        this.items = body.Data[0].result
        this.items.forEach(a => {
          a.type = 'Ignore'
          a.remind = false
          a.reportType = ''
          // a.operatorName='Billy Richardson'
          // a.assetType='Forklift/Asset name #01'
          //  a.sitename= 'Tampa'
        });
        this.mainListRecent = this.items
        //this.notificationList = []
        this.recentfilter = []
        let filterslist = body.Data[0].filter
        filterslist.forEach(a => { this.recentfilter.push(a); });
        if (this.tabIndex == 0) {
          this.notificationList = this.recentfilter;
        }
        //  this.items = [{ 'sitename': 'Tampa', 'operatorName': 'Billy Richardson', 'assetType': 'Forklift/Asset name #01',
        //   type: 'Ignore', remind: false, reportType: '' }]
      })
    } else {
      this.assetprohelperService.PostMethod('Notification/GetNotificationTableBySiteID', { SiteID: siteId }).subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Data == null || body.Data == undefined || body.Data.length == 0 || body.Data[0].result == undefined) return;
        this.items = body.Data[0].result
        this.items.forEach(a => {
          a.type = 'Ignore'
          a.remind = false
          a.reportType = ''
          a.operatorName = 'Billy Richardson'
          a.assetType = 'Forklift/Asset name #01'
          //  a.sitename= 'Tampa'
        });
        this.recentfilter = []
        let filterslist = body.Data[0].filter
        filterslist.forEach(a => { this.recentfilter.push(a); });
        if (this.tabIndex == 0) {
          this.notificationList = this.recentfilter;
        }
        this.mainListRecent = this.items
      });
    }
  }
  tabIndex = 0;
  mainListArchived = []
  archivedFilter = []
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
  loadNotificationArchived() {
    this.items2 = []
    this.notificationList = []
    let siteId = localStorage.getItem('selectitemId')
    if (siteId == undefined || siteId == null || siteId == 'null') {
      this.assetprohelperService.GetMethod('Notification/GetNotificationArchivedTable').subscribe(data => {

        let body: any = JSON.parse(data['_body']);
        if (body.Data != null && body.Data != undefined && body.Data.length != 0) {
          this.items2 = body.Data[0].result
          this.mainListArchived = body.Data[0].result
          // this.notificationList = []
          this.archivedFilter = []
          let filterslist = body.Data[0].filter
          filterslist.forEach(a => { this.archivedFilter.push(a); });
          if (this.tabIndex == 1) {
            this.notificationList = this.archivedFilter;
          }
        }
      })
    }
    else {
      this.assetprohelperService.PostMethod('Notification/GetNotificationArchivedTableBySiteID', { SiteID: siteId }).subscribe(data => {

        let body: any = JSON.parse(data['_body']);
        if (body.Data != null && body.Data != undefined && body.Data.length != 0) {
          this.items2 = body.Data[0].result
          this.mainListArchived = body.Data[0].result
          // this.notificationList = []
          this.archivedFilter = []
          let filterslist = body.Data[0].filter
          filterslist.forEach(a => { this.archivedFilter.push(a); });
          if (this.tabIndex == 1) {
            this.notificationList = this.archivedFilter;
          }
        }
      });
    }
  }
  ignorebtn(data) {
    try {
      let body = {
        "ID": data.UniqueID,
      }
      this.assetprohelperService.PostMethod('Notification/Ignore', body).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            this.toastr.success(body.Message, "Success!");
            this.loadNotificationRecent();
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (error) {
          console.log(error)
        }
      });
    }
    catch (saveError) {
      console.log(saveError)
    }
  }
  remindBtn(data) {
    try {
      let body = {
        "ID": data.UniqueID,
        "SnoozeAfter": "30Mintues"
      }
      this.assetprohelperService.PostMethod('Notification/Remind', body).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            this.toastr.success(body.Message, "Success!");
            this.loadNotificationRecent();
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (error) {
          console.log(error)
        }
      });
    }
    catch (saveError) {
      console.log(saveError)
    }
  }
  tabChange(event) {

    //this.tabIndex=event.index;
    if (event.index == 1) {
      this.notificationList = this.archivedFilter;
      this.items2 = this.mainListArchived
    } else {
      this.notificationList = this.recentfilter;
      this.items = this.mainListRecent
    }
    this.selectedNotification = 'ALL NOTIFICATIONS';
  }
  showAlarm = false
  showalarmChange() {
    if(this.showAlarm == true){
      this.selectedNotification = 'ALL NOTIFICATIONS'
    }
    if (this.showAlarm) {
      this.items = this.mainListRecent.filter(a => { return a.Type == 'Alarm' })
      this.items2 = this.mainListArchived.filter(a => { return a.Type == 'Alarm' })
    } else {
      this.items = this.mainListRecent
      this.items2 = this.mainListArchived
    }

  }
  ngOnDestroy() {
    // empty+
    this.serviceSubscription.unsubscribe();
  }
  opensideBar() {

    this.deliveryComponent.opensideBar()
  }

  opensideBar2() {
    this.incidentbar.opensideBar();
  }
  prodictivitychart(actual, Expected,startDate,stopDate) {
    let chart = "#169bd722";
    let bottomLabel=this.getDates(startDate, stopDate) 
    let count = 0;
    let stepSize = 10
    let maxvalue = 40;
    actual.forEach(a => {
      if (a > count) {
        count = a;
      }
    });
    Expected.forEach(a => {
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
    let fontBackgound = "#1d3d57";
    if (this.alartsType == 'PAST 2 WEEKS' || this.alartsType == 'MONTH') {
      fontBackgound = "#fff";
    }
    if (this.prodictivitylinechart) this.prodictivitylinechart.destroy();
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
          "data": Expected,
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
              fontColor: fontBackgound,
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

  prodictivitychart1(actual, Expected,startDate,stopDate) {
    let chart = "#ff1c0022";
    let bottomLabel=this.getDates(startDate, stopDate) 
    let count = 0;
    let stepSize = 10
    let maxvalue = 40;
    actual.forEach(a => {
      if (a > count) {
        count = a;
      }
    });
    Expected.forEach(a => {
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
    let fontBackgound = "#1d3d57";
    if (this.alarmsType == "PAST 2 WEEKS" || this.alarmsType == "MONTH") {
      fontBackgound = "#fff"
    }
    if (this.prodictivitylinechart1) this.prodictivitylinechart1.destroy();
    this.prodictivitylinechart1 = new Chart('lineChart2', {
      type: 'line',
      data: {
        "labels": bottomLabel,
        "datasets": [{
          //"label": "Body Weight Lost",
          "data": actual,
          "borderColor": "#ff1c00",
          "backgroundColor": chart,
          "lineTension": 0,
          "borderWidth": 1,
          "fill": true
        },
        {
          //"label": "Body Weight Lost",
          "data": Expected,
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
              fontColor: fontBackgound,
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
  openRole(val) {

    this.adddeliveryComponent.opensideBar1(val);
  }
  addedAdvance(val) {
    if (this.deliveryComponent.tabIndex == 0)
      this.deliveryComponent.items.push({ value: this.adddeliveryComponent.name, type: true });
    if (this.deliveryComponent.tabIndex == 1)
      this.deliveryComponent.items2.push({ value: this.adddeliveryComponent.name, type: true });
    if (this.deliveryComponent.tabIndex == 2)
      this.deliveryComponent.items3.push({ value: this.adddeliveryComponent.name, type: true });
    this.adddeliveryComponent.name = '';
  }

  reportList = ['Create Incident', 'Report compliance']
  reportType = '';
  reportSelected(val, index) {

    //this.reportType = val;
    // this.items[index].reportType = val;
    if (val == 'Create Incident') {
      this.incidentbar.opensideBar();
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
  remind(type, value) {
    //this.items[index].remind = true
    this.remindBtn(value)
  }
  ignoreReopen(index, value, items) {
    let parent = this;
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to ' + value + ' the Record ?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        let type = 'Ignore'
        if (value == 'Ignore') {
          type = 'Reopen';
        }
        parent.ignorebtn(items)
        // this.items[index].type = type
        //    parent.toastr.success("Record Deleted Successfully", 'Success!');
        //parent.selection.clear();
      }
    })
  }
  openIncidenHistory(val) {
    this.incidentHistory.opensideBar(undefined);
  }
}
