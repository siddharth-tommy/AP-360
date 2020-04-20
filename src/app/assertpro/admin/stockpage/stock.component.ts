import { UserMenuService } from './../../../share/services/usermenu.service';
import { Component, OnInit, ViewChild, Inject, OnDestroy } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AssetprohelperService } from "src/app/share/services/assetprohelper.service";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Subscription } from "rxjs";
import { ConfirmationDailog } from "../../usersdirectory/usersdirectory.component";
import { AssignstockComponent } from "./assignstock/assignstock.component";
import { StockImportComponent } from "./stockimport/stockimport.component";
import { SidebarComponent } from "../../assets/sidebar/sidebar.component";

@Component({
  selector: "stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"]
})
export class StockComponent implements OnInit, OnDestroy {
  constructor(
    public toastr: ToastrService,
    public assetprohelperService: AssetprohelperService,
    public dialog: MatDialog, public usermenu: UserMenuService
  ) { }
  @ViewChild('firstTableSort') public firstTableSort: MatSort;
  @ViewChild('stockSort') public stockSort: MatSort;
  showInventory = false;
  showStock = false;
  private menuserviceSubscription: Subscription;
  ngOnInit() {
    this.dataSource.data = [];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.stockSort;
    this.dataSource2.data = [];
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.firstTableSort;
    this.tapType = "stock";

    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(
      () => {
        this.siteName = localStorage.getItem("sitename");
        if (
          localStorage.getItem("selectitemId") != null &&
          localStorage.getItem("selectitemId") != "null"
        ) {
          this.siteId = localStorage.getItem("selectitemId");
          this.loadStockList();
          this.loadInvendory();
        } else {
          this.siteId = "";
          //this.toastr.warning("Single Site is  Mandatory", "Warning");
          return;
        }
      }
    );
    this.menuserviceSubscription = this.usermenu.menuModel$.subscribe(data => {
      this.showStock = false;
      this.showInventory = false;
      if (Object.keys(data).length != 0) {
        data.filter(row => {
          if (row.MenuName == "Admin") {
            if (row.ScreenName == "Stock Page") {
              this.showStock = true;
            }
            else if (row.ScreenName == "Inventory Page") {
              this.showInventory = true;
            }
          }
        });
      }
    });
  }
  siteId: any = "";
  siteName: string;
  loader: boolean = false;
  displayedColumns: string[] = ['select', 'UniqueID', 'AssetName', 'SystemName', 'DeviceModel', 'LastSeenDate', 'DeviceStatus', 'Description'];
  displayedColumns2: string[] = [
    "select",
    "Product",
    "ModelName",
    "Total"
  ];
  accessControlGroupDetatils;
  tapType: string = "stock";
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  dataSource2 = new MatTableDataSource<any>();
  selection2 = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('matpage') paginator: MatPaginator;
  @ViewChild(MatSort) sort2: MatSort;
  @ViewChild(MatPaginator) paginator2: MatPaginator;
  private serviceSubscription: Subscription;
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
    this.menuserviceSubscription.unsubscribe();
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
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isAllSelected2() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle2() {
    this.isAllSelected2()
      ? this.selection2.clear()
      : this.dataSource2.data.forEach(row => this.selection2.select(row));
  }
  loadStockList() {
    try {
      let parent = this;
      this.loader = true;
      this.assetprohelperService.GetMethod("Vendor/StockList").subscribe(data => {
        this.loader = false;
        try {
          let body = data.json();
          this.dataSource.data = body.Data
          this.dataSource.sort = this.stockSort;
          this.dataSource.paginator = this.paginator;
        }
        catch (error) {
          console.log("error")
        }
      }, error => {
        this.loader = false
      })
    }
    catch (error) {
      console.log("error")
    }
  }
  loadInvendory() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService
      .GetMethod("Vendor/InventoryList")
      .subscribe(data => {
        this.loader = false;
        let body = data.json();
        this.dataSource2.data =body.Data;
        this.dataSource2.sort = this.firstTableSort;
        this.dataSource2.paginator = this.paginator2;
      });
  }
  confirmationDialog(value) {
    let parent = this;
    let msg = "Inactive";
    if (value.Status == "Inactive") {
      msg = "Active";
    }
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: "Are you sure you want to " + msg + " ?" }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == "Yes") {
        let s = "Active";
        if (value.Status == "Active") {
          s = "Inactive";
        }
        let index = this.sitesList.indexOf(value);
        if (index >= 0) {
          this.activeInactiveFun(parent.dataSource.data[index], index, s);
        }
      }
    });
  }
  activeInactiveFun(data, index, val) {
    this.loader = true;
    let parent = this;
    this.assetprohelperService
      .PostMethod("Admin/UpdateSiteStatusUsingID", { ID: data.ID, Status: val })
      .subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data["_body"]);
        if (body.Status) {
          parent.toastr.success("Record Updated Successfully", "Success!");
          parent.dataSource.data[index].Status = val;
        } else {
          parent.toastr.warning(body.Message, "Warning");
        }
      });
  }
  swapRecord() {
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    let numSelected2 = this.selection2.selected.length;
    let numRows2 = this.dataSource2.data.length;
    let parent = this;
    if (
      (numSelected == 2 && this.tapType == "stock") ||
      (numSelected2 == 2 && this.tapType != "stock")
    ) {
      this.toastr.success("Record Swaped Successfully", "Success!");
      this.selection.clear();
      this.selection2.clear();
    } else {
      this.toastr.warning("Min/Max 2 Records is Mandatory", "Warning!");
    }
  }
  deleteRecord() {
    //this.tapType == 'stock'
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    let numSelected2 = this.selection2.selected.length;
    let numRows2 = this.dataSource2.data.length;
    let parent = this;
    if (
      (numSelected > 0 && this.tapType == "stock") ||
      (numSelected2 > 0 && this.tapType != "stock")
    ) {
      let subdialogRef = this.dialog.open(ConfirmationDailog, {
        data: { name: "Are you sure you want to Delete the Record ?" }
      });

      subdialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result == "Yes") {
          parent.toastr.success("Record Deleted Successfully", "Success!");
          parent.selection.clear();
        }
      });
    } else {
      this.toastr.warning("No Records Selected", "Warning!");
    }
  }
  data = [
    {
      ID: "D8765U75",
      AssetName: "Asset name #1",
      Product: "Vital",
      DeviceModel: "Model name",
      LastSeen: "07/07/2018 01:08PM",
      Status: "SPARE",
      Description: "Brief description of the problem"
    },
    {
      ID: "D8765U75",
      AssetName: "Asset name #1",
      Product: "Vital",
      DeviceModel: "Model name",
      LastSeen: "07/07/2018 01:08PM",
      Status: "SPARE",
      Description: "Brief description of the problem"
    },
    {
      ID: "D8765U75",
      AssetName: "Asset name #1",
      Product: "Vital",
      DeviceModel: "Model name",
      LastSeen: "07/07/2018 01:08PM",
      Status: "SPARE",
      Description: "Brief description of the problem"
    },
    {
      ID: "D8765U75",
      AssetName: "Asset name #1",
      Product: "Vital",
      DeviceModel: "Model name",
      LastSeen: "07/07/2018 01:08PM",
      Status: "SPARE",
      Description: "Brief description of the problem"
    },
    {
      ID: "D8765U75",
      AssetName: "Asset name #1",
      Product: "Vital",
      DeviceModel: "Model name",
      LastSeen: "07/07/2018 01:08PM",
      Status: "SPARE",
      Description: "Brief description of the problem"
    },
    {
      ID: "D8765U75",
      AssetName: "Asset name #1",
      Product: "Vital",
      DeviceModel: "Model name",
      LastSeen: "07/07/2018 01:08PM",
      Status: "SPARE",
      Description: "Brief description of the problem"
    }
  ];
  assignPopup() {
    let parent = this;
    let title = "ASSIGN STOCK";
    if (this.tapType == "inventory") {
      title = "ASSIGN INVENTORY";
      this.selection.clear();
    }
    let subdialogRef = this.dialog.open(AssignstockComponent, {
      width: "90%",
      data: {
        dataSource1: this.dataSource.data,
        dataSource2: this.dataSource2.data,
        tapType: this.tapType,
        title: title
      }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result.type == "new") {
        this.sidebarComponent.opensideBar([], [], []);
        this.sidebarComponent.editHomeEnabled = true;
        this.sidebarComponent.editEnabled = true;
        this.sidebarComponent.AssetType = result.assetType
      }
    });
  }
  @ViewChild("sidebarComponent") sidebarComponent: SidebarComponent;
  importFile() {
    let subExport = this.dialog.open(ExportTemplate);
    let parent = this;
    subExport.afterClosed().subscribe(result => {
      parent.exportFun();
    });
  }
  exportFun() {
    let width = "30%";
    if (screen.availWidth <= 576) {
      width = "90%";
    } else if (screen.availWidth <= 768) {
      width = "70%";
    } else if (screen.availWidth <= 992) {
      width = "55%";
    } else if (screen.availWidth <= 1200) {
      width = "50%";
    }
    let subdialogRef = this.dialog.open(StockImportComponent, {
      width: width,
      data: {}
    });

    subdialogRef.afterClosed().subscribe(result => { });
  }
  tabchangeEvent(value) {
    this.selection.clear();
    this.selection2.clear();
    this.tapType = value;
    let parent=this;
    setTimeout(() => {
     // parent.dataSource.sort = parent.stockSort;
     // parent.dataSource2.sort = parent.firstTableSort;
      //parent.dataSource.paginator = parent.paginator;
      //parent.dataSource2.paginator = parent.paginator2;
      parent.applyFilter('');
    }, 600);
    //this.applyFilter('');  
  } 
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if(this.tapType=='stock'){
      this.dataSource.sort = this.stockSort;
      this.dataSource.filter = filterValue;
      this.dataSource.paginator = this.paginator;
    }else{
      this.dataSource2.sort = this.firstTableSort;
    this.dataSource2.filter = filterValue;
    this.dataSource2.paginator = this.paginator2;
    }
}

}


@Component({
  selector: "exportTemplate",
  template: `
    <h1 mat-dialog-title>Confirmation!</h1>
    <div mat-dialog-content>
      <p>Do you need to generate a template?</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-button (click)="onYesClick()" cdkFocusInitial>Yes</button>
    </div>
  `
})
export class ExportTemplate {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDailog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick(): void {
    this.exportToCsv("Inventory_template.csv", [
      ["Product", "Model", "Total Units"]
    ]);
    this.dialogRef.close("Yes");
  }
  exportToCsv(filename, rows) {
    var processRow = function (row) {
      var finalVal = "";
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ",";
        finalVal += result;
      }
      return finalVal + "\n";
    };

    var csvFile = "";
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}
