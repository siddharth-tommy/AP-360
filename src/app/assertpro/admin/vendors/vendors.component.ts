import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import { AddVendorComponent } from './addvendor.component';

@Component({
  selector: 'vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {


  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService, public dialog: MatDialog) {
  }
  ngOnInit() {
    this.dataSource.data = []
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
        this.loadVendorTable();
        //  this.loadSiteList();
      } else {
        this.siteId = '';
        //this.toastr.warning("Single Site is  Mandatory", "Warning");
        return;
      }
      this.addvendor.closeSidebar();
    });
  }


  vendorList=[]
  loadVendorTable() {
    try {
      this.dataSource.data = [];
      this.loader = true
      this.assetprohelperService.PostMethod("Vendor/GetVendorList",{"SiteID":this.siteId}).subscribe(response => {
        this.loader = false;
        try {
          let body = response.json();
          if (body.Status) {
            this.vendorList= body.Data
            this.dataSource.data = body.Data
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  siteId: any = ''
  siteName: string;
  loader: boolean = false;
  displayedColumns: string[] = ['select', 'Name', 'Address1', 'Contact', 'Email', 'Phone'];
  accessControlGroupDetatils;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('addvendor') addvendor: AddVendorComponent
  private serviceSubscription: Subscription;
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  sitesList;
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
          this.activeInactiveFun(parent.dataSource.data[index], index, s);
        }

      }
    })
  }
  activeInactiveFun(data, index, val) {
    this.loader = true;
    let parent = this;
    this.assetprohelperService.PostMethod('Admin/UpdateSiteStatusUsingID', { ID: data.ID, Status: val })
      .subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Status) { 
          parent.toastr.success(body.Message, 'Success!')
        this.loadVendorTable()
        }
        else {
          parent.toastr.warning(body.Message, "Warning");
        }
      });
  }
  deleteRecord() {
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    let parent = this;
    if (numSelected > 0) {
      let subdialogRef = this.dialog.open(ConfirmationDailog, {
        data: { name: 'Confirm Before Deleting The Vendor Data, Because it was Already there on Assets.' }
      });

      subdialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result == 'Yes') {
          parent.deleteVendorlist();
        }
      })

    } else {
      this.toastr.warning("No Records Selected", 'Warning!');
    }
  }
  deleteVendorlist() {
    
    let deletedList = [];
    this.selection.selected.forEach(i => {
      deletedList.push(i.ID)
    });
    this.assetprohelperService.PostMethod('Vendor/DeleteVendorUsingIDs', { "Ids": deletedList}).subscribe(data => {
      let body: any = data.json();
      if (body.Status) {
        this.toastr.success(body.Message, "Success");
        this.selection.clear()
        this.loadVendorTable();
      }
      else {
        this.toastr.warning(body.Message, "Warning");
      }
    });
  }
  createVendor(enabled, element) {
    this.addvendor.opentoCreate(enabled, element);
  }
}
