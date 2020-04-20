import { Component, OnInit, ElementRef, ViewChild, Inject, OnDestroy } from '@angular/core';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material'; import { ToastrService } from 'ngx-toastr';
import { ChargesSidebarComponent } from './charges-sidebar/charges-sidebar.component';
import { Subscription } from 'rxjs';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as moment from 'moment';

const ELEMENT_DATA: any[] = [
    { ID: 1, LastSeen: '', weight: 1.0079, symbol: 'H', Current_operator: '', assettype: '', curren_alarms: '' }
]

@Component({
    selector: 'charges-component',
    templateUrl: './charges.component.html',
    styleUrls: ['./charges.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('10ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class ChargesComponent implements OnInit, OnDestroy {

    private serviceSubscription: Subscription;
    ngOnDestroy() {
        // empty
        this.serviceSubscription.unsubscribe();
    }
    prodictivitylinechart: any;
    maintenancedoughnutchart: any;
    constructor(public assetprohelperService: AssetprohelperService, private toastr: ToastrService, public dialog: MatDialog, breakpointObserver: BreakpointObserver) {

    }
    siteId: string = ''
    siteName: string = ''
    type: string = '';
    expandedElement: null;
    loader: boolean = false;
    displayedColumns: string[] = ['expand', 'select', 'ID', 'LastSeen', 'symbol', 'Status', 'curren_alarms', 'assettype', 'seemore'];
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('chargesSidebarComponent') chargesSidebarComponent: ChargesSidebarComponent
    maxScreen: boolean = false;
    ngOnInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.siteId = localStorage.getItem('selectitemId')

        //this.alarmschart([11, 20, 12], [15, 9, 17]);
        if (screen.availWidth >= 1920) {
            this.maxScreen = true;
        }
        this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
            this.siteName = localStorage.getItem('sitename');
            this.filters = []
            this.tableFilter = ''
            if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
                this.siteId = localStorage.getItem('selectitemId');
                this.loadTable()
                this.loadPlugins('WEEK');
                this.loadAlarms('WEEK');
                this.loadMaintenance('WEEK', this.siteId);
                this.overAllFunction();
            } else {
                this.siteId = '';
            }
            this.dataSource.filter = '';
        })
    }
    showAlarm() { }
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
        this.tableFilter = ''
        //  }, 1000);
    }
    prodictivitychart(x, y,fromDate,toDate) {
        let chart = "#169bd722";
        let bottomLabel =this.getDates(fromDate,toDate);
        let maxvalue = 100;
        let count = 0
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
        let stepSize = 10
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
        this.prodictivitylinechart = new Chart('pluginchart', {
            type: 'line',
            data: {
                "labels": bottomLabel,
                "datasets": [{
                    // "label": "Body Weight Lost",
                    "data": x,
                    "borderColor": "#169bd7",
                    "backgroundColor": chart,
                    "lineTension": 0,
                    "borderWidth": 1,
                    "fill": true
                },
                {
                    // "label": "Body Weight Lost",
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
                            stepSize: stepSize,
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



    doughnutchart(x, smallldevice) {
        //this.maintenancedoughnutchart.update();
        let paddingRunTime = 18;
        if (screen.availWidth >= 1920) {
            paddingRunTime = 30;
        } else if (screen.availWidth >= 1550) {
            paddingRunTime = 20;
        }
        else if (screen.availWidth <= 1280) {
            paddingRunTime = 12;
        }
        if (this.maintenancedoughnutchart) this.maintenancedoughnutchart.destroy();
        this.maintenancedoughnutchart = new Chart('chargesdoughnutChart', {
            type: 'doughnut',
            data: {
                labels: ["Total Used Hours", "Total Idle Hours"],
                //  radius: "40%",
                //innerRadius: 90,
                //innerRadius: "75%",
                datasets: [
                    {
                        label: "Maintenance",
                        backgroundColor: ["#b3e7ff", "#169bd7"],
                        data: x,
                    }
                ]
            },
            options: {
                responsive: true,
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
    alarmgraph: any;
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
        if (document.getElementById("alarmscharts") == null) return;
        if (this.alarmgraph) this.alarmgraph.destroy();
        this.alarmgraph = new Chart(document.getElementById("alarmscharts"), {
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
                            stepSize: stepSize,
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
    maintenanceDatas = []
    maintenanceType = 'WEEK';
    maintenanceTypeList = ['WEEK', 'PAST 2 WEEKSS', 'MONTH']
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
            this.assetprohelperService.PostMethod('Asset/GetAssetChargerUsageDetails', {
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
                    chartDatas.push(tempData.UsagePercentage);
                    chartDatas.push(tempData.IdlePercentage);
                    this.doughnutchart(chartDatas, null);
                    if ((tempData.UsagePercentage == undefined || tempData.UsagePercentage == null || tempData.UsagePercentage == 0 || tempData.UsagePercentage == '')
                        && (tempData.IdlePercentage == undefined || tempData.IdlePercentage == null || tempData.IdlePercentage == 0 || tempData.IdlePercentage == '')
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
    fromDate2: string = '';
    toDate2: string = '';
    loadPlugins(value) {
        this.pluginsOfType = value
        let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(value);

        let fromD = startDates.toString().split(' ');
        let endDat = endDates.toString().split(' ');
        this.pluginsStartDate = new Date(startYear + '-' + startMonth + '-' + startDate);
        this.pluginsEndDate = new Date(endYear + '-' + endMonth + '-' + endDate);
        this.pluginsStartDay = startDate
        this.pluginsEndDay = endDate;
        this.fromDate2 = fromD[1] + ',' + startDate
        this.toDate2 = endDat[1] + ',' + endDat[2];
        this.loader = true;
        this.assetprohelperService.PostMethod('Asset/GetAssetChargerChart', {
            "SiteID": this.siteId,
            "StartDate": startYear + '-' + startMonth + '-' + startDate,
            "EndDate": endYear + '-' + endMonth + '-' + endDate
        }).subscribe(data => {
            this.loader = false;
            let actual = []
            let expectedData = [];
            let body: any = JSON.parse(data['_body']);
            this.pluginsOfDatas = body.Data;
            let tempDatas = body.Data;
            actual = tempDatas.Actual
            expectedData = tempDatas.Expected
            this.prodictivitychart(actual, expectedData,startYear + '-' + startMonth + '-' + startDate,endYear + '-' + endMonth + '-' + endDate);
        });
    }
    alarmsList: any = []
    alarmType: string = 'WEEK';
    alarOfTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
    fromDate3: string = ''
    toDate3: string = ''
    loadAlarms(value) {
        try {
            if (value != null) {
                this.alarmType = value;
            }
            let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(this.alarmType);
            let fromD = startDates.toString().split(' ');
            let endDat = endDates.toString().split(' ');
            this.fromDate3 = fromD[1] + ',' + startDate
            this.toDate3 = endDat[1] + ',' + endDat[2];
            this.loader = true;
            this.assetprohelperService.PostMethod('Asset/GetAssetChargerFaultChart', {
                "SiteID": this.siteId,
                "StartDate": startYear + '-' + startMonth + '-' + startDate,
                "EndDate": endYear + '-' + endMonth + '-' + endDate
            }).subscribe(data => {
                this.loader = false;
                let body: any = JSON.parse(data['_body']);
                this.alarmsList = body.Data[0];
                if (body.Data.length == 0 || this.alarmsList == undefined) {
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
    opensideBar(data, index) {
        //this.chargesSidebarComponent.opensideBar()
        this.chargesSidebarComponent.opensideBar(data, this.tableDatas[index], this.subGridDatas)
    }
    tableDatas = []
    tableMainValues = []
    loader2=false;
    loadTable() {
        this.loader2 = true;
        this.assetprohelperService.PostMethod('Asset/GetChargerAssetTableBySiteID', { "SiteID": this.siteId })
            .subscribe(data => {
                this.loader2 = false;
                let body: any = JSON.parse(data['_body']);
                this.tableDatas = body.Data;
                let newvalue = []
                let type = 'Port A'
                for (let n in this.tableDatas) {
                    let s = {

                        'expand': 'true', ID: this.tableDatas[n].PortID, LastSeen: this.tableDatas[n].LogOn, 'assettype': this.tableDatas[n].AssetTypeName,
                        name: this.tableDatas[n].name, symbol: 'H', Current_operator: '',
                        curren_alarms: '', 'EventDate': '',
                        'UniqueID': this.tableDatas[n].ID, 'Status': this.tableDatas[n].Status
                    };
                    newvalue.push(s)
                    if (type == 'Port A') {
                        type = 'Port B'
                    } else {
                        type = 'Port A'
                    }
                }
                this.tableMainValues = newvalue
                this.dataSource.data = newvalue;
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
        this.assetprohelperService.PostMethod('Asset/UpdateAssetStatusUsingID', { ID: data.UniqueID, Status: val })
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
            this.assetprohelperService.PostMethod('Asset/GetChargerAssetTableDetailsByID', { "ID": element.ID })
                .subscribe(data => {
                    this.loader = false;
                    let body: any = JSON.parse(data['_body']);
                    this.subGridDatas = body.Data[0];
                    this.expanded = false;
                    //var RentalTimerDataJSON = body.Data[0].RentalTimerDataJSON
                    //RentalTimerDataJSON = RentalTimerDataJSON.substr(8);
                    //RentalTimerDataJSON = RentalTimerDataJSON.substring(0, RentalTimerDataJSON.length - 1);
                    //this.subGridDatas.RentalTimerDataJSON = JSON.parse(RentalTimerDataJSON);
                    if (this.subGridDatas.Warranty != null && this.subGridDatas.Warranty != '')
                        this.subGridDatas.Warranty2 = new Date(this.subGridDatas.Warranty).toLocaleString().substring(0, 10)
                    if (this.subGridDatas.InstallDate != null && this.subGridDatas.InstallDate != '')
                        this.subGridDatas.InstallDate2 = new Date(this.subGridDatas.InstallDate).toLocaleString().substring(0, 10)
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
    extend: boolean = false;
    showExtend() {
        this.extend = !this.extend
    }
    availableType = [{ id: 1, value: 'Update Firmware' }, {
        id: 2, value: 'Get Firmware',
    }, { id: 4, value: 'Reupload-Settings' }
        , { id: 5, value: 'Move to Stock' }, { id: 7, value: 'Swap' }]

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
        } if (numSelected == 0) {
            setTimeout(() => {
                this.available = undefined
            }, 100);
            this.toastr.warning("Please select Asset(s)", "Warning");
            return;
        }
        if (numSelected != numRows && (data.id == 1 || data.id == 2 || data.id == 3 || data.id == 5 || data.id == 6)) {
            setTimeout(() => {
                this.available = undefined
            }, 100);
            this.toastr.warning("Please select All Asset(s)", "Warning");
            return;
        }
        if (numSelected != 1 && data.id == '4') {
            setTimeout(() => {
                this.available = undefined
            }, 100);
            this.toastr.warning("Maximum  Asset(s) should one", "Warning");
            return;
        }
        if (numSelected != 2 && data.id == '7') {
            setTimeout(() => {
                this.available = undefined
            }, 100);
            this.toastr.warning("Maximum  Asset(s) should two", "Warning");
            return;
        }
        let parent = this;
        let dialogRef = this.dialog.open(SubPopupChargesDialog, {
            data: { name: data.value }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.available = undefined
            parent.selection.clear()
        });

    }
    filterTypeList = ['Available/Idling', 'Charging', 'Equalizing', 'Present Alerts', 'Out of Range', 'Faulted']
    selectedFilter: string = '';
    overAllList: any = []
    overAllFunction() {
        this.loader = true;
        try {
            let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction('WEEK');

            this.assetprohelperService.PostMethod('Asset/GetAssetChargerCommunication', {
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
export class SubPopupChargesDialog {
    constructor(public dialogRef: MatDialogRef<SubPopupChargesDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
