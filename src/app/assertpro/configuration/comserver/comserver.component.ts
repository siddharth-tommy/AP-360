import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonanDepartmentComponent } from '../assettype/commondepartment/commondepartment.component';
import { CommonassetComponent } from '../assettype/commonasset/commonasset.component';

@Component({
    selector: 'comservercomponent',
    templateUrl: './comserver.component.html',
    styleUrls: ['./comserver.component.css']
})
export class ComserverComponent implements OnInit, OnDestroy {
    dataSource = new MatTableDataSource<any>();
    dataSource2 = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort2: MatSort;
    @ViewChild(MatPaginator) paginator2: MatPaginator;
    @ViewChild('commonasset') commonasset: CommonassetComponent;
    dialog: any;
    sitesList: any;
    stats: any;
    value: any;
    connectionStates: any[];
    connectionValues: any;
    process: any;
    read: any;

    constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService) {
    }
    displayedColumns: string[] = ['select', 'UnitID', 'IP', 'LastComm', 'CMDs', 'Events', 'Data',];
    displayedColumns2: string[] = ['ID', 'Destination', 'Source', 'Operator', 'Date', 'Event', 'GPS', 'Data'];
    ngOnInit() {
        this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
            if (localStorage.getItem('selectitemId') == undefined || localStorage.getItem('selectitemId') == null ||
                localStorage.getItem('selectitemId') == 'null') {
                //  this.toastr.warning("Single Site Is Mandatory", 'Warning!');
                return;
            }
            this.connectionStats();
            this.loadconnectionTable();
        });

        this.dataSource.data = []
        this.dataSource2.data = [{
            'ID': '0000', 'Destination': '1A2E01F0', 'Source': '1', 'Operator': 0,
            'Date': '06-05-2019 13:30:42', 'Event': '1002', 'GPS': false, 'Data': ""
        }]
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
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
    loadconnectionTable() {
        try {
            this.dataSource.data = [];
            this.loader = true
            this.assetprohelperService.PostMethod("Configuration/GetConnectionTable",{"AssetIDs":[""]}).subscribe(response => {
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
                catch (clientTableApiError) {
                    console.log(clientTableApiError)
                }
            },error=>{
                this.loader=false;
            })
        } catch (clientTableError) {
            console.log(clientTableError)
        }
    }
    connectionStats() {
        try {
            this.loader = true;
            this.connectionStates = undefined
            this.assetprohelperService.PostMethod("Configuration/GetConnectionStats", { "AssetIDs": [""] }).subscribe(response => {
                try {
                    this.loader = false;
                    let body = response.json();
                    if (body.Status) {
                        if (body.Data != null && body.Data != undefined && body.Data.length != 0) {
                            this.connectionValues = body.Data[0]
                        }
                    }
                }
                catch (apiError) {
                    console.log(apiError)
                }
            }, error => {
                this.loader = false;
            })
        }
        catch (apifunctionerror) {
            console.log(apifunctionerror)
        }
    }
    ngAfterViewInit() {
        this.commonasset.isDeleteEnabled = false
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

    applyFunction() {
        if (this.commonasset.bubbles.length == 0) {
            this.toastr.warning("Asset is Mandatory", "Warning");
            return;
        }
        this.toastr.success("Applied Successfully", 'Success!');

    }
    clear() {
        this.commonasset.bubbles = []
        this.commonasset.searchText = '';
    }
}