import { Component, OnInit, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';

@Component({
  selector: 'assignstock',
  templateUrl: './assignstock.component.html',
  styleUrls: ['./assignstock.component.css'],
})


export class AssignstockComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'UniqueID', 'AssetName', 'SystemName', 'DeviceModel', 'LastSeenDate', 'DeviceStatus', 'Description'];
  displayedColumns2: string[] = ['select', "Product",    "ModelName",    "Total"];

  title: string;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection2 = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort2: MatSort;
  @ViewChild(MatPaginator) paginator2: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  tapType: string = ''

  constructor(public dialogRef: MatDialogRef<AssignstockComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService,
    public assetprohelperService: AssetprohelperService, ) {
    this.title = data.title
    this.tapType = data.tapType
    //this.dataSource.data=data.dataSource1
    //this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }
  asset: any = '';
  selected: string = '';
  assetType;
  assetTypeList = [
  ];
  assetList = []
  onNoClick(): void {
    this.selected = '';
    this.dialogRef.close();
  }
  ngOnInit() {

    this.dataSource.data = []
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource2.data = []
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort2;
    this.loadStockList();
    this.GetAssetsList();
    this.loadInvendory();
  }
  loader = false
  loadInvendory() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService
      .GetMethod("Vendor/InventoryList")
      .subscribe(data => {
        this.loader = false;
        let body = data.json();
        this.dataSource2.data = body.Data;
        this.dataSource2.sort = this.sort2;
        this.dataSource2.paginator = this.paginator2;
      });
  }
  datas = [{
    'ID': 'D8765U75', 'AssetName': 'Asset name #1', 'Product': 'Vital', 'DeviceModel': 'Model name',
    'LastSeen': '07/07/2018 01:08PM', 'Status': 'SPARE', 'Description': 'Brief description of the problem'
  },
  {
    'ID': 'D8765U75', 'AssetName': 'Bsset name #1', 'Product': 'Vital', 'DeviceModel': 'Model name',
    'LastSeen': '07/07/2018 01:08PM', 'Status': 'SPARE', 'Description': 'Brief description of the problem'
  },
  {
    'ID': 'D8765U75', 'AssetName': 'Asset name #1', 'Product': 'Vital', 'DeviceModel': 'Model name',
    'LastSeen': '07/07/2018 01:08PM', 'Status': 'SPARE', 'Description': 'Brief description of the problem'
  },
  {
    'ID': 'D8765U75', 'AssetName': 'Asset name #1', 'Product': 'Vital', 'DeviceModel': 'Model name',
    'LastSeen': '07/07/2018 01:08PM', 'Status': 'SPARE', 'Description': 'Brief description of the problem'
  },
  {
    'ID': 'D8765U75', 'AssetName': 'Asset name #1', 'Product': 'Vital', 'DeviceModel': 'Model name',
    'LastSeen': '07/07/2018 01:08PM', 'Status': 'SPARE', 'Description': 'Brief description of the problem'
  },
  {
    'ID': 'D8765U75', 'AssetName': 'Asset name #1', 'Product': 'Vital', 'DeviceModel': 'Model name',
    'LastSeen': '07/07/2018 01:08PM', 'Status': 'SPARE', 'Description': 'Brief description of the problem'
  },]
  ngAfterViewInit() {

  }
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
  msg = '';
  onSubmit() {
    if (this.assetType == undefined || this.assetType == null || this.assetType == '') {
      this.toastr.warning("AssetType is Mandatory", 'Warning!');
      return;
    }
    if (this.asset == undefined || this.asset == null || this.asset == '') {
      this.toastr.warning("Asset is Mandatory", 'Warning!');
      return;
    }
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    let numSelected2 = this.selection2.selected.length;
    let numRows2 = this.dataSource2.data.length;

    let parent = this;

    if (this.asset.name == 'New Asset') {
      if ((this.tapType == 'stock' && numSelected != 1) || (this.tapType != 'stock' && numSelected2 != 1)) {
        this.toastr.warning("Please select Max/Min one Record", 'Warning!');
        return;
      }
      this.selected = '';
      this.dialogRef.close({ 'type': 'new', assetType: this.assetType.assetstype })
      return;
    }
    if ((this.tapType == 'stock' && numSelected > 0) || (this.tapType != 'stock' && numSelected2 > 0)) {
      parent.toastr.success("Record Assigned Successfully", 'Success!');
      parent.selection.clear();
    } else {
      this.toastr.warning("No Records Selected", 'Warning!');
      return;
    }

    this.dialogRef.close('Yes');

    // } else {
    //     if (this.message == undefined || this.message == '')
    //     this.toastr.warning("Message is Empty", "Warning");
    //    else if (this.answer1 == undefined || this.answer1 == '')
    //     this.toastr.warning("Answer1 is Empty", "Warning");

    //     this.msg = 'Please Choose any option'
    // }
  }

  index = "";
  loadStockList() {
    let parent = this;
    this.assetprohelperService.GetMethod("Vendor/StockList").subscribe(data => {
      let body = data.json();
      this.dataSource.data = body.Data
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }
  GetAssetsList() {

    var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    let url = 'TrackingHistory/assetlistwithsite?id=' + computedID;
    this.assetList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.assetTypeList = body.Data;

      })
  }
  assetChange() {
    this.assetList = []
    let data = this.assetType.assets
    this.assetList.push({ name: 'New Asset' });
    data.forEach(b => { this.assetList.push(b); });
  }
  assetc() {

    // if(this.asset.name=='New Asset'){
    //   this.selected = '';
    //   this.dialogRef.close('new')
    // }

  }
}
