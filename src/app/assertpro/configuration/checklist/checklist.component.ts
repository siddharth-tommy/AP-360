import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import { ChecklistsidebarComponent } from './checklistsidebar/checklistsidebar.component';

@Component({
    selector: 'checklistcomponent',
    templateUrl: './checklist.component.html',
    styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit, OnDestroy {
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('checklistsidebarcomponent') checklistsidebarComponent: ChecklistsidebarComponent

    sitesList: any;
    createchecklist_sidebar: any;
    oneditView: any;

    constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService,
        public dialog: MatDialog) {
    }
    displayedColumns: string[] = ['select', 'Name', 'Language', 'TotalQuestions',
        'Description','SystemName', 'AssetTypeName'];
    ngOnInit() {
        this.dataSource.data = []
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
            this.siteName = localStorage.getItem('sitename');
            if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
                this.siteId = localStorage.getItem('selectitemId');
                this.loadCheckList();
            } else {
                this.siteId = '';
                // this.toastr.warning("Single Site is  Mandatory", "Warning");
                return;
            }
            this.checklistsidebarComponent.closeSidebar();
        });
    }
    loadCheckList() {
        try {
            this.dataSource.data = [];
            this.loader = true
            this.assetprohelperService.PostMethod("Configuration/GetAllCheckListBySiteID", { "SiteID": this.siteId }).subscribe(response => {
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
                catch (apiChecklist_tableError) {
                    console.log(apiChecklist_tableError)
                }
            })
        } catch (checklistTableError) {
            console.log(checklistTableError)
        }
    }
    siteName: string;
    siteId: string;
    loader: boolean = false;


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

    deleteChecklist() {
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
                this.deleteChecklistdata()
            }
        });

    }
    deleteChecklistdata() {
        let deletedList = [];
        this.selection.selected.forEach(i => {
            deletedList.push(i.ID)
        });
        this.assetprohelperService.PostMethod('Configuration/CheckListByIDs', { "IDs": deletedList }).subscribe(data => {
            let body: any = data.json();
            if (body.Status) {
                this.toastr.success(body.Message, "Success");
                this.selection.clear()
                this.loadCheckList();
            }
            else {
                this.toastr.warning(body.Message, "Warning");
            }
        });
    }
    createChecklist(checklistEnabled, checklist) {
        this.checklistsidebarComponent.opensideBar(checklistEnabled, checklist)
    }
}