import { Component, OnInit, ViewChild, OnDestroy, } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { MessagebarComponent } from './messagebar/messagebar.component';
import { FilterbarComponent } from './filterbar/filterbar.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDailog } from '../usersdirectory/usersdirectory.component';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['select', 'EventTime', 'AssetName', 'OperatorName', 'Message', 'Status', 'Answer'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('messagebarComponent') messagebarComponent: MessagebarComponent
  @ViewChild('filterbarComponent') filterbarComponent: FilterbarComponent
  siteName: string;
  siteId: string = '';
  loader: boolean;
  opensideBar() {
    if (localStorage.getItem('selectitemId') == undefined || localStorage.getItem('selectitemId') == null ||
      localStorage.getItem('selectitemId') == 'null') {
      this.toastr.warning("Single Site Is Mandatory", 'Warning!');
      return;
    }
    this.messagebarComponent.opensideBar()
  }
  opensideBar1() {

    if (localStorage.getItem('selectitemId') == undefined || localStorage.getItem('selectitemId') == null ||
      localStorage.getItem('selectitemId') == 'null') {
      this.toastr.warning("Single Site Is Mandatory", 'Warning!');
      return;
    }
    this.filterbarComponent.opensideBar1()
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
  constructor(public toastr: ToastrService, public dialog: MatDialog, public assetprohelperService: AssetprohelperService, ) { }
  private serviceSubscription: Subscription
  ngOnInit() {

    //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.siteId = localStorage.getItem('selectitemId')
    if (this.siteId == undefined || this.siteId == null || this.siteId == 'null') {
    }
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {

      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
        this.messageTable([],[],null,null)
        this.messagebarComponent.closeHelpcontainer();
        this.filterbarComponent.closeHelpcontainer();
        this.filterbarComponent.clearDatas();
      } else {
        this.siteId = '';
        this.toastr.warning("Single Site Is Mandatory", 'Warning!');
      }
    });
  }
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  resendMessage(data) {
    this.assetprohelperService.PostMethod('Message/ResendMessageByID',
      { "ID": data.ID })
      .subscribe(response => {
        let body: any = response.json();
        if (body.Status) {
          this.messageTable([],[],null,null)
        }
        else {
          this.toastr.warning(body.Message, "Warning");
        }
      });
  }
  deleteMessage() {
    let deletedList = [];
    this.selection.selected.forEach(i => {
      deletedList.push(i.ID)
    });
    this.loader=true;
    this.assetprohelperService.PostMethod('Message/MessageByIDs', { "IDs": deletedList }).subscribe(data => {
      let body: any = data.json();
      this.loader=false;
      if (body.Status) {
        this.toastr.success(body.Message, "Success");
        this.selection.clear()
        this.messageTable([],[],null,null)
      }
      else {
        this.toastr.warning(body.Message, "Warning");
      }
    });
  }
  filter(data){
    this.messageTable(data.opeator,data.asset,data.assetFromDate,data.assetToDate);
  }
  messageTable(opeator,assets,startDate,EndDate) {
    this.dataSource.data = []
    this.loader=true;
    this.selection.clear()
    this.assetprohelperService.PostMethod('Message/GetMessageTableBySiteID',
      {
        SiteID: localStorage.getItem('selectitemId'),
        "Operator_Ids": opeator,
        "Asset_IDs": assets,
        "StartDate": startDate,
        "EndDate": EndDate
      }).subscribe(data => {
        try {
          let body: any = data.json();
          this.loader=false;
          if (body.Status) {
            this.dataSource.data = body.Data
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
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
  deleteRecord() {
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    let parent = this;
    if (numSelected > 0) {
      let subdialogRef = this.dialog.open(ConfirmationDailog, {
        data: { name: 'Are you sure you want to Delete the Record ?' }
      });
      subdialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result == 'Yes') {
          parent.deleteMessage();

        }
      })

    } else {
      this.toastr.warning("No Records Selected", 'Warning!');
    }
  }
 
}


export interface PeriodicElement {
  Asset: string;
  Timestamp: string;
  Timestamp1: string;
  Operator: string;
  Operator1: string;
  Operator2: string;
  Message: string;
  Message1: string;
  Message2: string;
  Status: string;
  Status1: string;
  Status2: string;
  Answer: string;
  StatusType: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

