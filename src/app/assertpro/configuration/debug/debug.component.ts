import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonanDepartmentComponent } from '../assettype/commondepartment/commondepartment.component';
import { CommonassetComponent } from '../assettype/commonasset/commonasset.component';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import { CommonCommand } from '../assettype/commoncommand/commoncommand.component';

@Component({
    selector: 'debugcomponent',
    templateUrl: './debug.component.html',
    styleUrls: ['./debug.component.css']
})

export class DebugComponent implements OnInit, OnDestroy {
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('commondepartment') commondepartment: CommonanDepartmentComponent;
    @ViewChild('commonasset') commonasset: CommonassetComponent;
    @ViewChild('command') command: CommonCommand;
    sitesList: any;
    loader: boolean;
    constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService,public dialog:MatDialog) {
    }
    displayedColumns: string[] = ['select', 'MessageID', 'DestinationID', 'SendDate',
        'AckReceived', 'CommandNo', 'CommandData', 'Status'];
    ngOnInit() {
        
        this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
        this.siteName = localStorage.getItem('sitename');
            if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
                this.siteId = localStorage.getItem('selectitemId');
                this.loadCommandHistoryTable()
            }
        });
        
       

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
            this.siteName = localStorage.getItem('sitename');
            if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
                this.siteId = localStorage.getItem('selectitemId');

            } else {
                this.siteId = '';
                // this.toastr.warning("Single Site is  Mandatory", "Warning");
                return;
            }
        });
    }
    loadCommandHistoryTable() {

        try {
            this.dataSource.data = [];
            this.loader = true
            this.assetprohelperService.GetMethod("Configuration/GetSendCommandTable").subscribe(response => {
                this.loader = false;
                try {
                    let body = response.json();
                    if (body.Status) {
                        this.dataSource.data = body.Data
                        // this.dataSource.sort = this.sort;
                        // this.dataSource.paginator = this.paginator;
                    }
                    else {
                        this.toastr.warning(body.Message, "Warning")
                    }
                }
                catch (debugTableApiError) {
                    console.log(debugTableApiError)
                }
            },error=>{
                this.loader=false;
            })
        } catch (debugTableError) {
            console.log(debugTableError)
        }
        
    }
   
    siteName: string;
    siteId: string;
    ngAfterViewInit(){
        this.commonasset.isDeleteEnabled=false
    }

    private serviceSubscription: Subscription;
    ngOnDestroy() {
        this.serviceSubscription.unsubscribe();
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
    
    sentDepartmentList = []
    departmentChange() {
        this.sentDepartmentList = this.commondepartment.bubbles
        if (this.commonasset != undefined) {
            this.commonasset.departmentList = this.commondepartment.bubbles
            this.commonasset.GetAssetsList();
        }
    }
    applyFunction() {
        if (this.commondepartment.bubbles.length == 0) {
            this.toastr.warning("Deparment is Mandatory", "Warning");
            return;
        }
        if (this.commonasset.bubbles.length == 0) {
            this.toastr.warning("Asset is Mandatory", "Warning");
            return;
        }
        if (this.command.bubbles.length == 0) {
            this.toastr.warning("Command is Mandatory", "Warning");
            return;
        }
        this.toastr.success("Sent Successfully", 'Success!');

    }
    clear() {
        this.commondepartment.bubbles = []
        this.commondepartment.searchText = ''
        this.commonasset.bubbles = []
        this.commonasset.searchText = '';
        this.command.searchText=''
        this.command.bubbles=[];
    }
    delete(){
        let numSelected = this.selection.selected.length;
        if (numSelected == 0) {
            this.toastr.warning("Please Select any Records", "Warning");
            return
        }

        let subdialogRef = this.dialog.open(ConfirmationDailog, {
            data: { name: "Are you sure you want to Delete?" }
        });
        let parent = this;
        subdialogRef.afterClosed().subscribe(result => {
            if (result == 'Yes') {
                this.deleteDebugList()
            }
        });
    }
    deleteDebugList() {
        let deletedList = [];
        this.selection.selected.forEach(i => {
            deletedList.push(i.ID)
        });
        this.loader = true;
        this.assetprohelperService.PostMethod('Configuration/DeleteCommandByIDs', { "IDs": deletedList }).subscribe(responce => {
            let body: any = responce.json();
            this.loader = false
            if (body.Status) {
                this.toastr.success(body.Message, "Success");
                this.selection.clear()
                // this.loadDebugTable();
            }
            else {
                this.toastr.warning(body.Message, "Warning");
            }
        });
    }
}