import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { CreateCompanyComponent } from './createcompany/createcompany.component';
import { CreateSiteComponent } from './createsite/createsite.component';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import { Router } from '@angular/router';
import { debug } from 'util';


@Component({
  selector: 'company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy {

  constructor(public toastr: ToastrService,private _router: Router, public assetprohelperService: AssetprohelperService, public dialog: MatDialog) {
  }
  ngOnInit() {
    this.dataSource.data = []
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
        this.loadAccessControlGroup();
        this.loadSiteList();
        this.createcompany.close();
        this.createsite.close();
      } else {
        this.siteId = '';
        //this.toastr.warning("Single Site is  Mandatory", "Warning");
        return;
      }
    });
  }
  private serviceSubscription: Subscription;
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  siteName: string;
  siteId: string;
  sitesList: any = [];
  view: string = 'list';
  loader: boolean = false;
  displayedColumns: string[] = ['select', 'Name', 'Address1', 'AdminName', 'AdminEmail', 'AdminPhone', 'Status'];
  accessControlGroupDetatils;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('createcompany') createcompany: CreateCompanyComponent;
  @ViewChild('createsite') createsite: CreateSiteComponent;
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
  viewType(val) {
    this.view = val;
    this.selection.clear();
    this.dataSource.data = this.sitesList;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loadSiteList();
  }

  loadAccessControlGroup() {
    this.loader = true;
    this.assetprohelperService.PostMethod('Admin//GetAdminCompanyDetailsBySiteID', { "SiteID": this.siteId }).subscribe(response => {
      this.loader = false;
      let body = response.json();
      this.accessControlGroupDetatils = body.Data[0];
    });
  }
  openCompany(type) {
    this.createcompany.openSidebar(this.accessControlGroupDetatils, type);
  }
  openSite(data, type) {
    this.createsite.openSidebar(data, type, null);
  }
  createSite(type) {
    this.createsite.openSidebar(null, type, true);
  }
  unset(){
    this.sitesList=[]
    this.dataSource.data = []
  }
  loadSiteList() {
    let parent = this;
    this.loader2 = true;
    this.assetprohelperService.GetMethod("Admin/GetAdminSiteList").subscribe(data => {
      this.loader2 = false;
      let body = data.json();
      this.sitesList = body.Data;
      this.dataSource.data = this.sitesList;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteSite(type) {

    let msg = 'Are you sure you want to Delete?'
    if (this.view == 'list') {
      msg = 'Are you sure you want to Delete All the Records?'
      if (type != undefined) {
        msg = 'Are you sure you want to Delete the Record?'
      }
    } else {
      let numSelected = this.selection.selected.length;
      if (numSelected == 0) {
        this.toastr.warning("Please Select any Records", "Warning");
        return
      }
    }
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: msg }
    });
    let parent = this;
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        let deletedList = [];
        if (this.view != 'list') {
          this.selection.selected.forEach(i => {
            deletedList.push(i.ID)
          });
        }
        else {
          if (type == undefined) {
            this.sitesList.forEach(i => {
              deletedList.push(i.ID)
            });

          }
          else {
            deletedList.push(type.ID)
          }

        }

        this.deleteTheSite(deletedList,type)

      }
    });

  }
  deleteTheSite(ids,site) {
    this.assetprohelperService.PostMethod('Admin/SiteUsingIDs', { "IDs": ids }).subscribe(data => {

      let body: any = data.json();

      if (body.Status) {
        this.toastr.success(body.Message, "Success");
        if (this.view != 'list') {
          this.selection.clear()
        }
       // this.loadSiteList()
       this.unset();
       this.loader=true;
       if(ids.length==1 && localStorage.getItem('sitename')==site.Name){
        this.assetprohelperService.siteDefault(true);
        this.assetprohelperService.siteDefault(false);
      }else{
        this.assetprohelperService.updateSite(true);
      }
      }
      else {
        this.toastr.warning(body.Message, "Warning");
      }
    });
  }
  confirmationDialog(value) {
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
        let index = this.sitesList.indexOf(value);
        if (index >= 0) {
          this.activeInactiveFun(value, index, s);
        }

      }
    })
  }
  loader2=false
  activeInactiveFun(data2, index, val) {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.PostMethod('Admin/UpdateSiteStatusUsingID', { ID: data2.ID, Status: val == 'Active' ? 'Y' : 'N' })
      .subscribe(data => {
        let body: any = JSON.parse(data['_body']);
        //this.loader = false;
        if (body.Status) {
          parent.toastr.success(body.Message, 'Success!')
          // parent.dataSource.data[index].Status = val;
          //this.loadSiteList();
          if(localStorage.getItem('sitename')==data2.Name){
            this.assetprohelperService.siteDefault(true);
            this.assetprohelperService.siteDefault(false);
          }else{
          this.assetprohelperService.updateSite(true);
          }
        }
        else {
          parent.toastr.warning(body.Message, "Warning");
        }
      });
  }
}
const ELEMENT_DATA: any[] = [{
  sitename: 'Lake Jonathonchester', address: '73 Riley Hill Apt .620', name: 'Garrett Miles',
  email: 'garrett.miles@chevy.com', phone: '811-046-5166', Active: 'Active'
},
{
  sitename: 'New Jacinthestad', address: '73 Riley Hill Apt .620', name: 'Garrett Miles',
  email: 'garrett.miles@chevy.com', phone: '811-046-5166', Active: 'Active'
}]
