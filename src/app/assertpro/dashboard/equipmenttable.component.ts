import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { ToastrService } from 'ngx-toastr';
import { PersonInchargepopupComponent } from './personIncharge.component ';
import { Router } from '@angular/router';

@Component({
    selector: 'equipmenttable',
    templateUrl: './equipmenttable.html',
    styleUrls: ['./dashboard.component.css']
})
export class Equipmenttable {
    @Input() stateOverviewDatas;
    stateOverview: string = '';
    item: any;
    element: any
    displayedColumns = ['SiteName', 'Units', 'UsageTime', 'IdlingTime', 'MaintWeightage', 'AlarmWeightage', 'ComplianceWeightage', 'AdminName'];
    dataSource = new MatTableDataSource<any>();
    constructor(public dialogRef: MatDialogRef<Equipmenttable>, @Inject(MAT_DIALOG_DATA) public data: any,
        private assetprohelperService: AssetprohelperService, private toastr: ToastrService, public dialog: MatDialog,
        private _router: Router) {
        this.stateOverviewDatas = data.value
        this.stateOverview = data.type;
        this.item = data.item;
        this.element = data.element
        this.dataSource.data = data.value
    }
    assetNavigation(data){
  
        localStorage.setItem('selectitemId', data.ID);
        //localStorage.setItem('siteLat', site.SiteLat);
        //localStorage.setItem('siteLng', site.SiteLong);
        localStorage.setItem('sitename', data.SiteName);
        //localStorage.setItem('siteUnique',site.UniqueID)
        this._router.navigate(['/home/asset']);
        this.dialogRef.close();
      }
      alarmNavigation(data){
  
        localStorage.setItem('selectitemId', data.ID);
        //localStorage.setItem('siteLat', site.SiteLat);
        //localStorage.setItem('siteLng', site.SiteLong);
        localStorage.setItem('sitename', data.SiteName);
        //localStorage.setItem('siteUnique',site.UniqueID)
        this._router.navigate(['/home/notification']);
        this.dialogRef.close();
      }
      complainceNavigation(data){
  
        localStorage.setItem('selectitemId', data.ID);
        //localStorage.setItem('siteLat', site.SiteLat);
        //localStorage.setItem('siteLng', site.SiteLong);
        localStorage.setItem('sitename', data.SiteName);
        //localStorage.setItem('siteUnique',site.UniqueID)
        this._router.navigate(['/home/reports']);
        this.dialogRef.close();
        
      }
    onNoClick(): void {
        this.dialogRef.close();
    }
    popupAlarmAllSiteDatas
    loader = false;
    openAlarmsAllSite(data) {
        if (!data) {
            return;
        }
        let monthType = 'current_month';
        if (this.stateOverview == 'PREVIOUS MONTH') {
            monthType = 'previous_month';
        } else if (this.stateOverview == 'LAST THREE MONTHS') {
            monthType = 'monthTypelast_3_months';
        }
        this.popupAlarmAllSiteDatas = []
        let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(this.stateOverview);
        //this.loader = true;
        let body = {
            "StartDate": startYear + '-' + startMonth + '-' + startDate,
            "EndDate": endYear + '-' + endMonth + '-' + endDate,
            "Month": monthType,
            SiteID: data.ID
        }
        this.assetprohelperService.PostMethod('Dashboard/AllSiteAlarmByID', body).subscribe(data => {
            //this.loader = false;
            let body: any = JSON.parse(data['_body']);
            this.popupAlarmAllSiteDatas = body.Data;
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
            startMonth = '' + (new Date().getMonth() + 1);
            if (new Date().getDate() - 7 < 0) {
                startDate = '1';

            }
            else {
                startDate = '' + startDates.getDate()
            }

        }
        else if (value == 'PAST 2 WEEKS') {
            startDates = new Date();
            startDates.setDate(startDates.getDate() - 13);
            if (new Date().getDate() - 13 <= 0) {
                startDate = '1';
            }
            else {
                startDate = '' + startDates.getDate()
            }
            startMonth = '' + (new Date().getMonth() + 1);
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
    openPersonIncharge(element) {

        let width = '35%'

        if (screen.availWidth <= 863) {
            width = '90%'
        }
        if (element.AdminName == 'N/A') {
            this.toastr.warning("No Admin Available", "Warning");
            return
        }
        this.dialog.open(PersonInchargepopupComponent, {
            width: width,
            data: {data:element.ID }
        });

    }
}