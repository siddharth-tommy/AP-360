import { Component, Inject, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { PersonInchargepopupComponent } from './personIncharge.component ';
import { Router } from '@angular/router';

@Component({
    selector: 'batterytable',
    templateUrl: './batterytable.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class Batterytable {
    equipmentOverviewDatas;
    overView; prodictivemenu;
    titile;
    equipmentOverviewColumn;
    stateOverview;
    batteriesEnable = false;
    chargesEnable = false;
    popupAlarmDatas2: any;
    item: any;
    dataSource2 = new MatTableDataSource<any>();
    displayedColumns2=['SiteName','Units','Usage','Idle','Alarms','Equalizations','Plugins','Personincharge']
    constructor(private toastr: ToastrService,public dialog: MatDialog, public dialogRef: MatDialogRef<Batterytable>, @Inject(MAT_DIALOG_DATA) public data: any, private assetprohelperService: AssetprohelperService,
    private _router: Router) {
      this.equipmentOverviewDatas = data.equipmentOverviewDatas
      this.overView = data.overView
      this.prodictivemenu = data.prodictivemenu
      this.titile = data.titile
      this.equipmentOverviewColumn = data.equipmentOverviewColumn
      this.stateOverview = data.stateOverview
      this.batteriesEnable = data.batteriesEnable
      this.chargesEnable = data.chargesEnable;
      this.item=data.item
      this.dataSource2.data=data.equipmentOverviewDatas.TableRecords
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
    popupAlarmDatas: any;
    openAlarms(data) {
      let monthType = 'current_month';
      if (this.stateOverview == 'PREVIOUS MONTH') {
        monthType = 'previous_month';
      } else if (this.stateOverview == 'LAST THREE MONTHS') {
        monthType = 'monthTypelast_3_months';
      }
      this.popupAlarmDatas = []
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(this.stateOverview);
      //this.loader = true;
      let body = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate,
        "Month": monthType,
        SiteID: data.ID
      }
      this.assetprohelperService.PostMethod('Dashboard/AllSitesBatteriesAlarmByID', body).subscribe(data => {
        ///this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.popupAlarmDatas = body.Data;
      });
  
    }
    openAlarms2(data) {
      let monthType = 'current_month';
      if (this.stateOverview == 'PREVIOUS MONTH') {
        monthType = 'previous_month';
      } else if (this.stateOverview == 'LAST THREE MONTHS') {
        monthType = 'monthTypelast_3_months';
      }
      this.popupAlarmDatas2 = []
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction(this.stateOverview);
      //this.loader = true;
      let body = {
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate,
        "Month": monthType,
        SiteID: data.ID
      }
      this.assetprohelperService.PostMethod('Dashboard/AllSitesBatteriesAndOrChargersAlarmByID', body).subscribe(data => {
        ///this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.popupAlarmDatas2 = body.Data;
      });
  
    }
    alarmNavigation(data){
  
        localStorage.setItem('selectitemId', data.ID);
        //localStorage.setItem('siteLat', site.SiteLat);
        //localStorage.setItem('siteLng', site.SiteLong);
        localStorage.setItem('sitename', data.SiteName);
        //localStorage.setItem('siteUnique',site.UniqueID)
        this._router.navigate(['/home/notification']);
        
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
        // if (value == null || value == 'WEEK') {
        //   startDates.setDate(startDates.getDate() + 1)
        //   startMonth = '' + (startDates.getMonth() + 1);
        //   if(new Date().getDate()-7<0){
        //     startDate = '1';
        //   }
        //     else{
        //       startDate = '' + startDates.getDate();
        //     }
        // }
        // else if (value == 'PAST 2 WEEKS') {
        //   startDates = new Date();
        //   startDates.setDate(startDates.getDate() - 13);
        //   startMonth = '' + (startDates.getMonth() + 1);
        //   startYear = '' + startDates.getFullYear();
        //   if(startDates.getDate()-13<=0){
        //     startDate = '1';
        //   }
        //   else{
        //     startDate = '' + startDates.getDate();
        //   }
        // }
        if (value==null ||value == 'WEEK') {
          startDates.setDate(startDates.getDate()+1)
          startMonth = '' + (new Date().getMonth() + 1);
          if(new Date().getDate()-7<0){
            startDate='1';
            
          }
          else{
            startDate = '' +startDates.getDate()
          }
          startYear = '' + new Date().getFullYear();
       }
       else if (value == 'PAST 2 WEEKS') {
         startDates = new Date();
         startDates.setDate(startDates.getDate() - 13);
         if(new Date().getDate()-13<=0){
          startDate='1';
        }
        else{
          startDate = '' +startDates.getDate()
        }
        startMonth = '' + (new Date().getMonth() + 1);
        startYear = '' + new Date().getFullYear();
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
          // startDates = new Date();
          startDate = '1';
          startMonth = '' + (startDates.getMonth());
          startYear = endYear;
          endDate = '' + new Date(startDates.getFullYear(), startDates.getMonth(), 0).getDate();
          endMonth = '' + (startDates.getMonth());
          endYear = endYear
        }
        else if (value == 'LAST THREE MONTHS') {
          startDate = '1';
          startMonth = '' + (startDates.getMonth());
          startYear = '' + endMonths.getFullYear();
          endOldMonth = new Date().getMonth() - 2;
          endMonths = new Date();
          endMonths.setMonth(endOldMonth);
          endDate = '' + endMonths.getDate();
          endMonth = '' + (new Date().getMonth() + 1);
          endYear = endYear;
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