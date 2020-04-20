import { UserMenuService } from './../../share/services/usermenu.service';
import { Component, OnInit, ViewChild, Input, Inject, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { WebUserSidebarComponent } from './add-webuser/webusersidebar.component';
import { RoleFunctionComponent } from './rolefunction/rolefunction.component';
import { AccesslevelComponent } from './accesslevel/accesslevel.component';
import { AddOperatorComponent } from './addoperator/addoperator.component';
import { EditoperatorName } from './editoperatorname/editoperatorname.component';
//import { FixedmenubarComponent } from 'src/app/share/components/fixedmenubar/fixedmenubar.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonDailog } from '../common/commondailog/commondailog.component';
import { IncidentBarComponent } from '../notification/incidentbar/incidentbar.component';

@Component({
  selector: 'app-usersdirectory',
  templateUrl: './usersdirectory.component.html',
  styleUrls: ['./usersdirectory.component.css']
})
export class UsersdirectoryComponent implements OnInit, OnDestroy {
  loader: boolean = false;
  @ViewChild('webusersidebar') webusersidebar: WebUserSidebarComponent
  @ViewChild('rolefunction') rolefunction: RoleFunctionComponent
  @ViewChild('accesslevel') accesslevel: AccesslevelComponent
  @ViewChild('addoperator') addoperator: AddOperatorComponent
  @ViewChild('editoperatorname') editoperatorname: EditoperatorName
  @ViewChild('createincidentbar') createincidentbar: IncidentBarComponent
 // @ViewChild('fixedmenubarComponent') fixedmenubarComponent: FixedmenubarComponent
  // paginator: MatPaginator;
  @ViewChild('matpage') paginator: MatPaginator;
  //@ViewChild(MatPaginator) paginator2: MatPaginator;
  @ViewChild('matpage2') paginator2: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  editOperatorData;
  openeditoperatornameBar(element) {
    this.editOperatorData = element;
    this.editoperatorname.opensideBar(element)
    this.addoperator.assignData(element);
    this.addoperator.previsousData = this.editOperatorData;
  }
  openIncident(data) {
    this.previousEditData = data;
    this.createincidentbar.opensideBarEditMode(data);
    //this.fixedmenubarComponent.openIncident();
  }
  previousEditData;
  openIncidenHistory(data) {
    this.createincidentbar.closeHelpcontainer();
    this.editoperatorname.opensideBar(this.previousEditData);
  }

  availableActionsList = ['Change Status', 'Delete']
  selectedAvailable: string = '';
  clickAvailableAction(val) {
    this.selectedAvailable = val
    let datas = 'change the status';
    if (val == 'Delete') {
      datas = 'Delete';
    }
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    if (numRows != 0 && numSelected > 0) {
      let availablePopup = this.dialog.open(UserDirectoryAvailableactionDialog, {
        data: { name: datas }
      });
      let parent = this;
      availablePopup.afterClosed().subscribe(a => {
        parent.selection.clear();
      })
    } else {
      this.toastr.warning("Please select Operator(s)", "Warning");
    }
  }
  opensideBar() {
    //this.webusersidebar.opensideBar()
    this.webusersidebar.enableId=[]
    this.webusersidebar.opensideBarAddMode();
    this.webusersidebar.editedOperator = false
  }
  openWebUserEditMode(element) {
    this.webusersidebar.enableId = []
    this.webusersidebar.disableIds = []
    this.webusersidebar.opensideBar(element)
    this.webusersidebar.editedOperator = false
    this.editedData = element
  }
  openAccesslevel() {
    this.accesslevel.opensideBar()
  }
  openAddOperator() {
    this.addoperator.openHelpcontainer(undefined)

  }
  webuserChanged(val) {
    this.rolefunction.opensideBar(val)
  }
  udmenu: any = 'operators';
  performermenu: any = 'productivity';
  troublemakermenu: any = 'impacts';

  dynamicdoughnutchart1 = [];
  dynamicdoughnutchart2: any;

  displayedColumns: string[] = ['select', 'BadgeNo', 'OperatorName', 'AccessLevel', 'Department', 'YTDUsage', 'YTDAlarm', 'YTDIncidents',
    'YTDCompliance', 'Certificate', 'Status', 'addincident'];
  displayedColumns2: string[] = ['select', 'WebUserName', 'Role', 'Phone', 'Email', 'Status'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  dataSource2 = new MatTableDataSource<any>();
  selection2 = new SelectionModel<any>(true, []);
  performersList = []
  private menuserviceSubscription: Subscription;
  constructor(private modalService: NgbModal, private assetprohelperService: AssetprohelperService,
    private toastr: ToastrService, public dialog: MatDialog, public usermenu: UserMenuService, private _router: Router, ) { }
  private serviceSubscription: Subscription;
  ngOnDestroy() {
    // empty
    this.serviceSubscription.unsubscribe();
    this.menuserviceSubscription.unsubscribe();
  }
  maxScreen: boolean = false;
  siteName: string = '';
  ngOnInit() {
    this.dataSource.data = []
    this.dataSource2.data = []
    this.dataSource.sort = this.sort;
    this.dataSource2.sort = this.sort2;
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator2;

    if (screen.availWidth >= 1920) {
      this.maxScreen = true;
    }
    this.siteId = localStorage.getItem('selectitemId')
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');

        this.loadPerformer('WEEK');
        this.operatorTable();
        this.loadTrobleMaker('WEEK');
        this.webuserMain_table();
        //this.doughnutchart1([23, 7, 7, 3]);
        this.saftyComplaince();
        //this.doughnutchart2([20, 9, 9, 2]);
      } else {
        this.siteId = '';
        this.toastr.warning("Single Site is  Mandatory", "warning");
        return
      }
      this.dataSource.filter = '';
      this.dataSource2.filter = '';
      this.tableFilter2 = ''
      this.tableFilter = ''
      this.addoperator.editMode = false
      this.addoperator.closeHelpcontainer();
      this.editoperatorname.closeHelpcontainer()
      this.webusersidebar.close();
      this.createincidentbar.closeHelpcontainer();
      this.rolefunction.close();
      this.accesslevel.closeHelpcontainer();
    });
    this.menuserviceSubscription = this.usermenu.menuModel$.subscribe(data => {
      this.operatorEnable = false
      this.webUserEnable = false
      if (Object.keys(data).length != 0) {
        data.filter(row => {
          if (row.MenuName == "User Directory") {
            if (row.ScreenName == "Operators") {
              this.operatorEnable = true

              this.dataSource.sort = this.sort;
            } else if (row.ScreenName == "WebUser") {
              this.webUserEnable = true
            }
          }
        });
        if (!this.operatorEnable && !this.webUserEnable) {
          this._router.navigate(['/home/pagemap']);
          return;
        }
        if (!this.operatorEnable && this.webUserEnable) {
          this.udmenu = 'webuser'
        }
      } else {
        this._router.navigate(['/home/pagemap']);
      }
    });
  }
  tableFilter2 = ''
  tableFilter = ''
  operatorEnable = false;
  webUserEnable = false;
  saftyComplaince() {
    let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction('WEEK');
    this.assetprohelperService.PostMethod('UsersDirectory/GetUsersDirectorySafetyDetails',
      {
        SiteID: this.siteId,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate,
      }).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            if (body.Data == undefined || body.Data == null && body.Data.length == 0) {
              this.doughnutchart1([]);
              this.doughnutchart2([]);
            } else {
              let week = [body.Data[0].CWeekCompleted, body.Data[0].CWeekLogout,
              body.Data[0].CWeekMaintenanceLockout, body.Data[0].CWeekSkipped]
              let previousweek = [body.Data[0].PWeekCompleted, body.Data[0].PWeekLogout,
              body.Data[0].PWeekMaintenanceLockout, body.Data[0].PWeekSkipped]
              this.doughnutchart1(week);
              this.doughnutchart2(previousweek);
            }
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (apierror) {
          console.log(apierror)
        }
      });
  }
  editOperatorSidebar() {
    this.addoperator.assignData(this.editOperatorData);
    this.addoperator.previsousData = this.editOperatorData;
    this.addoperator.opensideBar();
    this.addoperator.editMode = true;
  }
  afterOpeatorEdit() {
    this.editoperatorname.opensideBar(this.editOperatorData);
  }
  @ViewChild('firstTableSort') public firstTableSort: MatSort;
  operatorTable() {
    //  this.dataSource.data = [];
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.loader = true;
    this.assetprohelperService.PostMethod('UsersDirectory/GetUsersDirectoryOperatorTableBySiteID',
      { SiteID: localStorage.getItem('selectitemId') }).subscribe(data => {

        try {
          let body: any = data.json(); this.loader = false
          if (body.Status) {
            this.dataSource.data = body.Data
            this.dataSource.sort = this.firstTableSort;
            this.dataSource.paginator = this.paginator;
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (apierror) {
          console.log(apierror)
        }
      }, error => {
        this.loader = false
      });
  }
  webuserMain_table() {
    this.dataSource2.data = [];
    //this.dataSource2.paginator = this.paginator;
    this.loader = true;
    this.assetprohelperService.PostMethod('UsersDirectory/GetWebUsersTableBySiteID',
      { SiteID: localStorage.getItem('selectitemId') }).subscribe(data => {
        try {
          let body: any = data.json();
          this.loader = false;
          if (body.Status) {
            this.dataSource2.data = body.Data
            this.dataSource2.sort = this.sort2;
            this.dataSource2.paginator = this.paginator2;
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (apierror) {
          console.log(apierror)
        }
      });
  }
  performerType = 'WEEK';
  trobleMakerType = 'WEEK'
  performerTypeList = ['WEEK', 'PAST 2 WEEKS', 'MONTH']
  siteId;
  loadPerformer(type) {
    if (type != null) {
      this.performerType = type;
    }
    let product = 'Productivity';
    if (this.performermenu == 'costEffective') {
      product = 'CostEffective';
    }
    let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(type);
    let url = 'PerformersCostEffective';
    let parameter = {
      "Product": product,
      "StartDate": startYear + '-' + startMonth + '-' + startDate,
      "EndDate": endYear + '-' + endMonth + '-' + endDate,
      "SiteID": this.siteId,
    };
    this.performersList = []
    this.loader = true;
    this.assetprohelperService.PostMethod('UsersDirectory/' + url, parameter).subscribe(data => {
      this.loader = false;
      let body: any = JSON.parse(data['_body']);
      this.performersList = body.Data;
      let count = 0;
      this.performersList.forEach(a => {
        if (this.performermenu == 'productivity') {
          if (a.Productivity > count) {
            count = a.Productivity;
          }
        }
        else {
          if (a.CostEffective > count) {
            count = a.CostEffective;
          }
        }
      });
      this.performersList.forEach(a => {
        if (this.performermenu == 'productivity') {
          if (a.Productivity == undefined || a.Productivity == '' || a.Productivity == 0) {
            a.range = 0;
          } else {
            a.range = Math.round((a.Productivity / count) * 100)
          }
        } else {
          if (a.CostEffective == undefined || a.CostEffective == '' || a.CostEffective == 0) {
            a.range = 0;
          } else {
            a.range = Math.round((a.CostEffective / count) * 100)
          }
        }
      });
      //  console.log(this.mostProdictiveDatas);
    });
  }
  mostTrobleMakerList;
  mostTrobleMakerCount;
  loadTrobleMaker(type) {
    try {
      if (type != null) {
        this.trobleMakerType = type;
      } let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(type);

      let url = 'TroubleMakersImpactsAlarms';
      let product = "Impacts"
      if (this.troublemakermenu != 'impacts') {
        product = "Alarms"
      }
      let parameter = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate, "SiteID": localStorage.getItem('selectitemId'),
        "Product": product
      };

      this.mostTrobleMakerList = []
      this.loader = true;
      this.assetprohelperService.PostMethod('UsersDirectory/' + url, parameter).subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.mostTrobleMakerList = body.Data;
        let count = 0;
        this.mostTrobleMakerList.forEach(a => {
          if (this.troublemakermenu != 'impacts') {
            if (a.HighAlarms > count) {
              count = a.HighAlarms;
            }
          } else {
            if (a.TotalAlarms > count) {
              count = a.TotalAlarms;
            }
          }
        });
        this.mostTrobleMakerCount = count;
        this.mostTrobleMakerList.forEach(a => {
          if (this.troublemakermenu != 'impacts') {
            if (a.HighAlarms == undefined || a.HighAlarms == '' || a.HighAlarms == 0 || a.TotalAlarms == undefined || a.TotalAlarms == '' || a.TotalAlarms == 0) {
              a.range = 0;
            } else {
              let totalImpact = a.TotalAlarms + a.HighAlarms
              a.range = Math.round((a.HighAlarms / totalImpact) * 100)
            }
          }
        });
        this.mostTrobleMakerList.forEach(a => {
          if (this.troublemakermenu == 'impacts') {
            if (a.HighImpact == undefined || a.HighImpact == '' || a.HighImpact == 0 || a.Impact == undefined || a.Impact == '' || a.Impact == 0) {
              a.range = 0;
            } else {
              let totalImpact_tabOne = a.Impact == 0 ? 1 : (a.Impact + a.HighImpact)
              a.range = Math.round((a.HighImpact / totalImpact_tabOne) * 100)
            }
          }
        });
        // if(this.trobleMakerType=='LEAST ACCIDENTS')
        //this.mostTrobleMakerList.reverse();
      });
    } catch (exception) {
      console.log(exception);
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isAllSelected2() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle2() {
    this.isAllSelected2() ?
      this.selection2.clear() :
      this.dataSource2.data.forEach(row => this.selection2.select(row));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }




  udmenuactive(menu) {
    this.udmenu = menu;
    this.editoperatorname.closeHelpcontainer();
    this.addoperator.editMode = false
    this.addoperator.closeHelpcontainer();
    this.accesslevel.closeHelpcontainer();
    this.rolefunction.closeHelpcontainer(null);
    this.webusersidebar.editedOperator = false;
    this.webusersidebar.closeHelpcontainer();
    this.createincidentbar.closeHelpcontainer();
    this.selection.clear()
    this.selection2.clear();
    this.tableFilter2=''
    this.tableFilter=''
    this.dataSource.filter=''
    this.dataSource2.filter=''
  }

  performerdiv(menu) {
    if (this.performermenu == menu) return;
    this.performermenu = menu;
    this.loadPerformer(this.performerType);
  }

  troublemakerdiv(menu) {
    if (this.troublemakermenu == menu) return;
    this.troublemakermenu = menu;
    this.loadTrobleMaker(this.trobleMakerType);
  }

  // Doughnut Chart - 1
  doughnutchart1(values) {
    let titleFont = 11;
    let bodyFont = 11;
    if (screen.availWidth >= 1920) {
      titleFont = 13;
      bodyFont = 13;
    }
    if (screen.availWidth == 1280) {
      titleFont = 10;
      bodyFont = 10;
    }
    if (screen.availWidth <= 1280) {
      titleFont = 6;
      bodyFont = 6;
    }

    this.dynamicdoughnutchart1 = new Chart('chart1', {
      type: 'doughnut',
      data: {
        labels: ["Completed", "Skipped", "Logout", "Maint. lockout"],
        datasets: [
          {
            label: "Maintenance",
            backgroundColor: ["#b3e7ff", "#169bd7", "#ea4256", "#50e3c2"],
            data: values,
          }
        ]
      },
      options: {
        cutoutPercentage: 60,
        tooltips: {
          titleFontSize: titleFont,
          bodyFontSize: bodyFont
        },
        plugins: {
          labels: {
            render: 'value',
            fontSize: 0,
            fontColor: '#fff',
            fontStyle: 'normal',
            fontFamily: "robotoregular",
            fontWeight: "bold",
            fontStretch: "condensed"
          }
        },
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            fontColor: '#4a4a4a',
            padding: 15,  //space between labels
            usePointStyle: true, //Border radius
            boxWidth: 15  //Box width
          }
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

  // Doughnut Chart - 2
  doughnutchart2(values) {

    let titleFont = 11
    let bodyFont = 11;
    if (screen.availWidth >= 1920) {
      titleFont = 13;
      bodyFont = 13
    }
    if (screen.availWidth == 1280) {
      titleFont = 10;
      bodyFont = 10;
    }
    if (screen.availWidth <= 1280) {
      titleFont = 6;
      bodyFont = 6;
    }
    this.dynamicdoughnutchart2 = new Chart('chart2', {
      type: 'doughnut',
      data: {
        labels: ["Completed", "Skipped", "Logout", "Maint. lockout"],
        datasets: [
          {
            label: "Maintenance",
            backgroundColor: ["#b3e7ff", "#169bd7", "#ea4256", "#50e3c2"],
            data: values,
          }
        ]
      },
      options: {
        tooltips: {
          titleFontSize: titleFont,
          bodyFontSize: bodyFont
        },
        cutoutPercentage: 60,
        plugins: {
          labels: {
            render: 'value',
            fontSize: 0,
            fontColor: '#fff',
            fontStyle: 'normal',
            fontFamily: "robotoregular",
            fontWeight: "bold",
            fontStretch: "condensed"
          }
        },
        legend: {
          display: false,
          position: 'right',
          labels: {
            fontColor: '#4a4a4a',
            padding: 15,  //space between labels
            usePointStyle: true, //Border radius
            boxWidth: 15  //Box width
          }
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
  openPerformer() {

    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }

    this.dialog.open(UserDirectoryPerformerModel, {
      width: width,
      // width: '35%',
      // height: '77%',


      data: { mostProdictiveDatas: this.performersList, overView: '', prodictivemenu: '' }
    });
  }

  openTrouble() {
    let width = '35%'
    if (screen.availWidth <= 863) {
      width = '90%'
    }

    this.dialog.open(TroubleMakerModel, {
      width: width,
      // width: '35%',
      // height: '77%',
      data: { mostProdictiveDatas: this.mostTrobleMakerList, overView: '', prodictivemenu: '' }
    });
  }
  deleteRecord() {
    let numSelected = this.selection2.selected.length;
    let numRows = this.dataSource2.data.length;
    let parent = this;
    if (numSelected > 0) {
      let subdialogRef = this.dialog.open(CommonDailog, {
        data: { name: 'Are you sure you want to Delete the Record ?' }
      });

      subdialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result == 'Yes') {
          // parent.toastr.success("Record Deleted Successfully", 'Success!');
          //parent.selection2.clear();
          parent.deleteWebUser();
        }
      })

    } else {
      this.toastr.warning("No Records Selected", 'Warning!');
    }
  }
  deleteWebUser() {

    let deletedList = [];
    this.selection2.selected.forEach(i => {
      deletedList.push(i.ID)
    });
    this.tableFilter2=''
    this.assetprohelperService.PostMethod('UsersDirectory/WebUserByIDs', { "IDs": deletedList }).subscribe(data => {
      let body: any = data.json();
      if (body.Status) {
        this.toastr.success(body.Message, "Success");
        this.selection2.clear()
        this.webuserMain_table();
      }
      else {
        this.toastr.warning(body.Message, "Warning");
      }
    });
  }
  confirmationDialog1(value, i) {
    let parent = this;
    let msg = 'Inactive';
    if (value.Status == 'Inactive') {
      msg = 'Active';
    }
    let subdialogRef = this.dialog.open(CommonDailog, {
      data: { name: 'Are you sure you want to ' + msg + ' ?' }
    });

    subdialogRef.afterClosed().subscribe(result => {

      if (result != undefined && result == 'Yes') {
        let s = 'Active'
        if (value.Status == 'Active') {
          s = 'Inactive'
        }
        parent.activeInactiveFun(value.ID, s);
      }
    })
  }
  activeInactiveFun(data, val) {
    this.loader = true;
    let parent = this;
    this.assetprohelperService.PostMethod('UsersDirectory/UpdateOperatorStatusUsingID', { ID: data, Status: val == 'Active' ? 'Y' : 'N' })
      .subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Status) {
          parent.toastr.success(body.Message, 'Success!')
          this.operatorTable();
        }
        else {
          parent.toastr.warning(body.Message, "Warning");
        }
      }, error => {
        this.loader = false
      });
  }
  activeInactiveFunWebUser(data, val) {
    this.loader = true;
    let parent = this;
    this.assetprohelperService.PostMethod('UsersDirectory/UpdateWebUserStatusUsingID', { ID: data, Status: val == 'Active' ? 'Y' : 'N' })
      .subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Status) {
          parent.toastr.success(body.Message, 'Success!')
          this.webuserMain_table();
        }
        else {
          parent.toastr.warning(body.Message, "Warning");
        }
      }, error => {
        this.loader = false
      });
  }
  confirmationDialog(value, i) {
    let parent = this;
    let msg = 'Inactive';
    if (value.Status == 'Inactive') {
      msg = 'Active';
    }
    let subdialogRef = this.dialog.open(CommonDailog, {
      data: { name: 'Are you sure you want to ' + msg + ' ?' }
    });

    subdialogRef.afterClosed().subscribe(result => {

      if (result != undefined && result == 'Yes') {
        let s = 'Active'
        if (value.Status == 'Active') {
          s = 'Inactive'
        }
        parent.activeInactiveFunWebUser(value.ID, s);
      }
    })
  }
  editedData;
  openWebUserSideBar() {
    this.webusersidebar.opensideBar(undefined);
    this.webusersidebar.editedOperator = true;
  }
  aftercloseRoleFunction(val) {
    if (val != null) {
      if (val.enableId != undefined) {
        this.webusersidebar.enableId = val.enableId
        this.webusersidebar.disableIds = val.diableId

      } else {
      //  this.webusersidebar.enableId = []
       // this.webusersidebar.disableIds = []
      }
      if (val.createMode) {
        this.webusersidebar.opensideBar(undefined);
      } else {
        this.webusersidebar.openAfterRole();
      }
    }
  }
  openPrevios(val) {
    if (this.webusersidebar.editedOperator) {
      this.editoperatorname.opensideBar(undefined);
    }
  }
}


export interface PeriodicElement {
  Name: string;
  Role: string;
  Phone: number;
  Email: string;
  Status: string;
  Alarms: string;
}

const ELEMENT_DATA: any[] = [];
const ELEMENT_DATA2: any[] = [
  { Name: 'Jon Parsons', Role: 'ACG admin', Phone: 1972344911, Email: 'aglae.boyle@yahoo.com', Status: 'Active', },
  { Name: 'Philip Tyler', Role: 'ACG admin', Phone: 9245277039, Email: 'kuhlman.boris@lesch.co.uk', Status: 'Inactive', },
  { Name: 'Rachel Frank', Role: 'company admin', Phone: 5481419270, Email: 'antwon_rosenbaum@donnelly.name', Status: 'Active', },
  { Name: 'Garret Becker', Role: 'ACG admin', Phone: 4716785408, Email: 'anissa_schaden@hotmail.com', Status: 'Inactive', },
  { Name: 'Belle Wade', Role: 'ACG admin', Phone: 5756297758, Email: 'janick.streich@armstrong.biz', Status: 'Active', },
  { Name: 'Lenora Kelley', Role: 'ACG admin', Phone: 7121203863, Email: 'adah.homenick@yahoo.com', Status: 'Inactive', },
  { Name: 'Herbert Leonard', Role: 'ACG admin', Phone: 328749364, Email: 'charles_carroll@gmail.com', Status: 'Active', },
  { Name: 'Lora Lindsey', Role: 'ACG admin', Phone: 6116872013, Email: 'hilll_emmy@hotmail.com', Status: 'Inactive', },
];
@Component({
  selector: 'userdirectoryPerformer',
  templateUrl: './performer.component.html',
  styleUrls: ['./performer.component.css']
})
export class UserDirectoryPerformerModel {
  mostProdictiveDatas;
  overView; prodictivemenu;

  constructor(public dialogRef: MatDialogRef<ConfirmationDailog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mostProdictiveDatas = data.mostProdictiveDatas
    this.overView = data.overView
    this.prodictivemenu = data.prodictivemenu
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'troblemakerComponent',
  templateUrl: './troublemaker.component.html',
  styleUrls: ['./troublemaker.component.css']
})
export class TroubleMakerModel {
  @Input() mostProdictiveDatas;
  @Input() overView; @Input() prodictivemenu;

  constructor(public dialogRef: MatDialogRef<ConfirmationDailog>, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.mostProdictiveDatas = data.mostProdictiveDatas
    this.overView = data.overView
    this.prodictivemenu = data.prodictivemenu
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'ConfirmationDailog',
  template: `<h1 mat-dialog-title>Confirmation! </h1>
            <div mat-dialog-content>
              <p>{{data.name}}</p>
            </div>
            <div mat-dialog-actions  align="end">
            <button mat-button (click)="onYesClick()" cdkFocusInitial>Yes</button>
              <button mat-button (click)="onNoClick()">No</button>
            </div>`,
})
export class ConfirmationDailog {
  constructor(public dialogRef: MatDialogRef<ConfirmationDailog>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick(): void {
    this.dialogRef.close('Yes');
  }
}

@Component({
  selector: 'userdirectory-availableaction',
  template: `<h1 mat-dialog-title>Confirmation! </h1>
            <div mat-dialog-content>
              <p>Are you sure you want to {{data.name}} of the Selected operator(s)?
              <br/>
               If you change them their ability to utilize equipment will get affected.</p>
            </div>
            <div mat-dialog-actions  align="end">
              <button mat-button (click)="onNoClick()">Cancel</button>
              <button mat-button [mat-dialog-close]="data.animal" cdkFocusInitial>Send</button>
            </div>`,
})
export class UserDirectoryAvailableactionDialog {
  constructor(public dialogRef: MatDialogRef<UserDirectoryAvailableactionDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}