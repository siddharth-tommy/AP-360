import { Component, OnInit, ViewChild } from '@angular/core';
import { AssetprohelperService } from '../../../../share/services/assetprohelper.service';
import { OperatorsPipe } from '../../../../share/pipe/operators.pipe';
import { AssetsPipe } from '../../../../share/pipe/assets.pipe';
import { AssetstypePipe } from '../../../../share/pipe/assetstype.pipe';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css'],
    providers: [DatePipe]
})
export class HistoryComponent implements OnInit {

    public historytype = 'assert';
    public historyassets: any = [];
    public historyoperators: any = [];
    public bubbles = [];
    public SelectAssettype: any = [];
    public SelectAsset: any = [];
    public SelectedOperator: any = [];

    public SelectAssettypeID: any = null;
    public SelectAssetId: any = null;
    public SelectOperator: any = null;
    public geofences: any = [];
    public selectgeofence: any = [];
    public selectgeofenceName = 'Zoom to....';
    hoveredDate: NgbDate;
    fromDate: NgbDate;
    toDate: NgbDate;
    maxDate: NgbDate;
    public isFromChangeEvent: boolean = false;
    @ViewChild('datemodel') datemodel;
    @ViewChild('dp') dateTimePicker;

    public isshowmodel: false;
    constructor(private calendar: NgbCalendar, private toastr: ToastrService, private spinner: NgxSpinnerService, private datePipe: DatePipe, private assetprohelperService: AssetprohelperService, private assetsPipe: AssetsPipe, private assetstypePipe: AssetstypePipe, private operatorsPipe: OperatorsPipe) {

        this.fromDate = calendar.getToday();
        this.maxDate = calendar.getToday();
        this.toDate = calendar.getToday();
    }
    public isAlreadyCalled = false;
    private siteActionSubscription: Subscription;
    private geofenceSubscription: Subscription;
    private dateSubscription: Subscription;
    ngOnInit() {
        // this.assetprohelperService.datemodel$.subscribe((data) => {
        //   if (data) {
        //     this.datemodel.show();
        //   }
        // });
        this.siteActionSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
            this.GetHistorybasedAssetsList();
            this.GetSiteGeofence();
            this.clearAllasset();
            this.historytype = "assert";
        })
       this.geofenceSubscription= this.assetprohelperService.getGeofence$.subscribe((data) => {
            if(data){
                this.GetSiteGeofence();
                this.selectgeofenceName = 'Zoom to....';
            }
        });

        this.customstarttime.setHours(0);
        this.customstarttime.setMinutes(0);
        this.customendtime.setHours(23);
        this.customendtime.setMinutes(59);
        this.customendtime.setSeconds(59);

        this.dateSubscription = this.assetprohelperService.dateObjectValue$.subscribe((data) => {
            if (data != null && data != undefined && data.StartDate != null) {
                this.assetprohelperService.ChangeMapActon(this.cleardata);
                this.datemodel.show();
            }
        });
    }

    ngOnDestroy() {
        try {
            this.siteActionSubscription.unsubscribe();
            this.dateSubscription.unsubscribe();
            this.geofenceSubscription.unsubscribe();
        } catch (e) {
            console.log(e);
        }
    }


    onDateSelection(date: NgbDate) {
        //const isDisabled = (date: NgbDate, current: {month: number}) => date.day > this.maxDate.day;
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    fromModel(date: Date): NgbDateStruct {
        return date ? {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        } : null;
    }


    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) {
        return date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
    }






    GetSiteGeofence() {
        let url = 'TrackingLocation/GetGeoFenceLocation?siteID=' + localStorage.getItem('selectitemId');
        this.spinner.show();
        this.assetprohelperService.GetMethod(url).subscribe(
            data => {
                this.spinner.hide();
                let body: any = JSON.parse(data['_body']);
                this.geofences = body.Data;
            })
    }


    GetHistorybasedAssetsList() {

        this.spinner.show();
        let url = 'TrackingHistory/assetlistwithsite?id=' + localStorage.getItem('selectitemId');
        this.historyassets = [];
        this.assetprohelperService.GetMethod(url).subscribe(
            data => {
                let body: any = JSON.parse(data['_body']);
                if (body.Data.length != 0) {
                    this.historyassets = body.Data;
                }
                this.spinner.hide();
            })
    }


    public searchText = '';

    GetHistorybasedOperatorList() {
        let url = 'TrackingHistory/operatorlistwithsite?id=' + localStorage.getItem('selectitemId');
        this.historyoperators = [];
        this.spinner.show();
        this.assetprohelperService.GetMethod(url).subscribe(
            data => {
                this.spinner.hide();
                let body: any = JSON.parse(data['_body']);
                if (body.Data.length != 0) {
                    this.historyoperators = body.Data;
                }
            })
    }


    SetHistoryType(type) {
        this.searchText = '';
        if (type == "operator") {
            this.GetHistorybasedOperatorList();
        }
        this.TimeStamp = '';
        this.historytype = type;
        this.SelectAsset = [];
        this.SelectedOperator = [];
        this.bubbles = [];
        this.selectgeofenceName = 'Zoom to....';
        this.assetprohelperService.ChangeMapActon(this.cleardata);
    }



    AssetItem(value: string, type, typevalue) {

        if (this.SelectAsset.length < 2) {
            if (value != '') {
                for (var i = 0; i < this.bubbles.length; i++) {
                    if (this.bubbles[i].id == typevalue.ID) {
                        this.bubbles.splice(i, 1);
                    }
                }
                this.bubbles.push({ 'id': typevalue.ID, 'value': value, 'type': type });
            }
            if (type == 'asset') {

                for (var i = 0; i < this.SelectAsset.length; i++) {
                    if (this.SelectAsset[i] == typevalue.ID) {
                        this.SelectAsset.splice(i, 1);
                    }
                }
                this.SelectAsset.push(typevalue.ID);
            }

        }
        else {
            this.toastr.error("we can't add more then two assets", 'Error!');
        }

        //this.AssetResult();

    }

    OperatorItem(value: string, type, typevalue) {
        this.bubbles = [];
        this.SelectedOperator = [];
        if (value != '') {
            for (var i = 0; i < this.bubbles.length; i++) {
                if (this.bubbles[i].id == typevalue.ID) {
                    this.bubbles.splice(i, 1);
                }
            }
            this.bubbles.push({ 'id': typevalue.ID, 'value': value, 'type': type });
        }
        for (var i = 0; i < this.SelectedOperator.length; i++) {
            if (this.SelectedOperator[i] == typevalue.ID) {
                this.SelectedOperator.splice(i, 1);
            }
        }
        this.SelectedOperator.push(typevalue.ID)
        //this.OperatorResult();
    }


    RemoveFilterItem(value) {
        if (value.type == 'asset') {
            for (var i = 0; i < this.SelectAsset.length; i++) {
                if (this.SelectAsset[i] == value.id) {
                    this.SelectAsset.splice(i, 1);
                }
            }
        }
        else if (value.type == 'assettype') {
            for (var j = 0; j < this.SelectAssettype.length; j++) {
                if (this.SelectAssettype[j] == value.id) {
                    this.SelectAssettype.splice(j, 1);
                }
            }
        }

        var index = this.bubbles.indexOf(value);
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }
        this.assetprohelperService.ChangeMapActon(this.cleardata);
    }

    RemoveOperatorFilterItem(value) {
        var index = this.bubbles.indexOf(value);
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }
        for (var j = 0; j < this.SelectedOperator.length; j++) {
            if (this.SelectedOperator[j] == value.id) {
                this.SelectedOperator.splice(j, 1);
            }
        }
        this.assetprohelperService.ChangeMapActon(this.cleardata);
    }


    clearAllasset() {
        this.searchText = '';
        this.bubbles = [];
        this.SelectAsset = [];
        this.SelectAssettype = [];
        if (JSON.stringify(this.selectgeofence) != JSON.stringify({}) && this.selectgeofence.featureid != undefined) {
            var computedData = {
                'featureid': this.selectgeofence.featureid,
                'coordinates': this.selectgeofence.gometry.coordinates
            };
            this.assetprohelperService.RemoveGeoFence(computedData);
        }
        this.selectgeofenceName = 'Zoom to....';
        this.assetprohelperService.ChangeMapActon(this.cleardata);
    }




    public cleardata: any = {
        'prmarymenutype': 'clear',
        'submenutype': null,
        'maptype': null,
        'coordinates': []
    }
    public uniqueOperatorNames: any = '';
    public historyDropValue: any = [];
    public historyDropCoord: any = [];

    notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
        return value !== null && value !== undefined;
    }

    AssetResult() {

        this.assetprohelperService.ChangeMapActon(this.cleardata);

        let url = 'TrackingHistory/AssetHistoryDetails';
        let requestdata = {
            "SiteId": localStorage.getItem('selectitemId'),
            "StartDate": this.startDate.getFullYear() + "-" + (this.startDate.getMonth() + 1) + "-" + this.startDate.getDate() + " " + this.startDate.getHours() + ":" + this.startDate.getMinutes() + ":" + this.startDate.getSeconds(),
            "EndDate": this.endDate.getFullYear() + "-" + (this.endDate.getMonth() + 1) + "-" + this.endDate.getDate() + " " + this.endDate.getHours() + ":" + this.endDate.getMinutes() + ":59" ,
            "Assets": this.SelectAsset,
            "FilterType": this.FilterType
        }

        let historydetails: any = [];

        if (this.SelectAsset.length != 0) {
            this.spinner.show();
            this.assetprohelperService.PostMethod(url, requestdata).subscribe(
                data => {
                    this.spinner.hide();
                    let body: any = JSON.parse(data['_body']);
                    if (body.Data.length != 0) {
                        historydetails = body.Data;
                        if (historydetails.length > 1) {
                            for (let i = 0; i < historydetails.length; i++) {
                                this.historyDropValue = historydetails[i].HistoryDetails;
                                this.historyDropCoord = historydetails[i].coordinates;
                            }
                        } else {
                            this.historyDropValue = historydetails[0].HistoryDetails;
                            this.historyDropCoord = historydetails[0].coordinates;
                        }
                        this.uniqueOperatorNames = Array.from(new Set(historydetails[0].HistoryDetails.map((item) => item.OperatorName)));
                        this.uniqueOperatorNames = this.uniqueOperatorNames.filter(this.notEmpty);
                        this.datemodel.hide();
                        let responsedata = {
                            'prmarymenutype': 'history',
                            'submenutype': 'asset',
                            'maptype': 'markerwithgeofence',
                            'historydetils': this.historyDropValue,
                            'coordinates': this.historyDropCoord,
                            'responsevalue': historydetails,
                            'startdate': this.startDate,
                            'enddate': this.endDate,
                            'uniqueOperatorNames': this.uniqueOperatorNames
                        }
                       
                        let value = {
                            "StartTime":this.startDate,
                            "EndTime": this.endDate, 
                            "HistoryType": this.historytype,
                            "SelectAsset": this.SelectAsset,
                            "SelectOperator": this.SelectedOperator,
                            "FilterType": this.FilterType,
                            "StartDate": body.StartDate,
                            "EndDate": body.EndDate,
                            "UtcStartDate":body.utcStartDate,
                            "UtcEndDate":body.utcEndDate,
                            "UtcStartTime":body.utcStartTime,
                            "UtcEndTime":body.utcEndTime
                            
                        }
                        this.assetprohelperService.changemodel(value);
                        this.assetprohelperService.ChangeMapActon(responsedata);
                    }
                    else {
                        this.toastr.error('There is no history for the select assets and selected timeframe');
                    }

                })
        }
        else {
            this.toastr.error("Kindly select assets !", 'Error!');
        }
    }

    ShowDateModal() {
        if (!this.isFromChangeEvent) {
            var computedErrorMessage = '';
            if (this.SelectAsset.length != 0)
                this.datemodel.show();
            else if (this.historytype != 'operator' && this.SelectAsset.length == 0) {
                computedErrorMessage = "Kindly select assets !";
            }
            else if (this.historytype == 'operator' && this.SelectedOperator.length == 0) {
                computedErrorMessage = "Kindly select operator !"
            }
            else {
                this.datemodel.show();
            }
            if (computedErrorMessage != '')
                this.toastr.error(computedErrorMessage, 'Error!');
        }
        else {
            this.datemodel.show();
        }
    }

    OperatorResult() {
        this.assetprohelperService.ChangeMapActon(this.cleardata);
        let url = 'TrackingHistory/OperatorHistoryDetails';
        let requestdata = {
            "SiteId": localStorage.getItem('selectitemId'),
            "StartDate": this.startDate.getFullYear() + "-" + (this.startDate.getMonth() + 1) + "-" + this.startDate.getDate() + " " + this.startDate.getHours() + ":" + this.startDate.getMinutes() + ":" + this.startDate.getSeconds(),
            "EndDate": this.endDate.getFullYear() + "-" + (this.endDate.getMonth() + 1) + "-" + this.endDate.getDate() + " " + this.endDate.getHours() + ":" + this.endDate.getMinutes() + ":59",
            "Operator": this.SelectedOperator,
            "FilterType": this.FilterType
        }

        let historydetails: any = [];
        if (this.SelectedOperator.length != 0) {
            this.spinner.show();
            this.assetprohelperService.PostMethod(url, requestdata).subscribe(
                data => {
                    this.spinner.hide();
                    let body: any = JSON.parse(data['_body']);
                    historydetails = body.Data;

                    this.datemodel.hide();
                    if (body.Data.length != 0) {
                        let responsedata = {
                            'prmarymenutype': 'history',
                            'submenutype': 'operator',
                            'maptype': 'markerwithgeofence',
                            'historydetils': historydetails[0].HistoryDetails,
                            'coordinates': historydetails[0].coordinates,
                            'responsevalue': historydetails,
                            'startdate': this.startDate,
                            'enddate': this.endDate
                        }
                        
                        let value = {
                            "StartTime": this.startDate,
                            "EndTime":  this.endDate,
                            "HistoryType": this.historytype,
                            "SelectAsset": this.SelectAsset,
                            "SelectOperator": this.SelectedOperator,
                            "FilterType": this.FilterType,
                            "StartDate": body.StartDate,
                            "EndDate": body.EndDate,
                            "UtcStartDate":body.utcStartDate,
                            "UtcEndDate":body.utcEndDate,
                            "UtcStartTime":body.utcStartTime,
                            "UtcEndTime":body.utcEndTime
                        }
                        this.assetprohelperService.changemodel(value);
                        this.assetprohelperService.ChangeMapActon(responsedata);
                    }
                    else {
                        this.toastr.error('There is no history for the select operator and selected timeframe');
                    }
                })

        }
        else {
            this.toastr.error("Kindly select operator !", 'Error!');
        }
    }


    public startDate: any = new Date();
    public endDate: any = new Date();

    public customstartdate: any = new Date();
    public customstarttime: any = new Date();

    public customenddate: any = new Date();
    public customendtime: any = new Date();


    public customend: any = new Date();;
    public customsendmindate: any = new Date();;
    public customendmaxdate: any = new Date();;

    public customsendmintime: any = new Date();;
    public customendmaxtime: any = new Date();;
    public customenddatestatus: any = true;
    public datetype: any = 'lasthour';

    public TimeStamp: any = 'lasthour';
    CustomStartDatePick() {

        if (this.customstartdate != null && this.customstarttime != null) {
            this.customstartdate.setHours(this.customstarttime.getHours());
            this.customstartdate.setMinutes(this.customstarttime.getMinutes());
            this.startDate = this.datePipe.transform(this.customstartdate, 'yyyy-MM-dd HH:mm:ss');
            this.customenddatestatus = false;
            if (this.customstarttime.getHours() >= 1 || this.customstarttime.getMinutes() >= 1) {
                this.customsendmindate = new Date();
                this.customendmaxdate = new Date();
                this.customsendmindate = this.customstartdate;
                var date = this.customstartdate.getDate();
                this.customendmaxdate.setDate(date + 1);
            }
            else {

                this.customsendmindate = this.customstartdate;
                this.customendmaxdate = this.customstartdate;
            }
        }
    }

    CustomEndDatePick() {
        if (this.customstartdate.getDate() == this.customenddate.getDate()) {
            this.customsendmintime = new Date();
            this.customendmaxtime = new Date();
            this.customsendmintime = this.customstarttime;
            this.customendmaxtime.setHours(23);
            this.customendmaxtime.setMinutes(59);
        }
        else {
            this.customendmaxtime = new Date();
            this.customsendmintime = new Date();
            this.customsendmintime.setHours(0);
            this.customsendmintime.setMinutes(0);
            this.customendmaxtime.setHours(this.customstarttime.getHours());
            this.customendmaxtime.setMinutes(this.customstarttime.getMinutes());
        }


    }
    public passStartDay: any;
    public passStartMonth: any;
    public passStartYear: any;
    public passEndDay: any;
    public passEndMonth: any;
    public passEndYear: any;
    public passStartHour: any;
    public passStartMinutes: any;
    public passEndHour: any;
    public passEndMinutes: any;
    public passStartTime: any;
    public passEndTime: any;
    FilterType = 'Custom';
    Datemanupulation(type) {
        if (this.customstarttime == null || this.customstarttime == undefined || this.customstarttime == '') {
            this.toastr.warning("Fill The Start Time Properly", "Warning");
            return
        }
        if (this.customendtime == null || this.customendtime == undefined || this.customendtime == '') {
            this.toastr.warning("Fill The End Time Properly", "Warning");
            return
        }
        this.TimeStamp = type;
        this.assetprohelperService.ChangeMapActon(this.cleardata);
        var startdate = new Date();
        var enddate = new Date();
        if (type == 'lasthour') {
            startdate.setHours(startdate.getHours() - 1);
            //enddate.setHours(new Date().getUTCHours());
            //enddate.setMinutes(new Date().getUTCMinutes());
            //enddate.setSeconds(new Date().getUTCSeconds());
            this.startDate = new Date(this.datePipe.transform(startdate, 'yyyy-MM-dd HH:mm:ss'));
            this.endDate = new Date(this.datePipe.transform(enddate, 'yyyy-MM-dd HH:mm:ss'));
            this.FilterType = 'LastHour'
        }
        else if (type == 'today') {
            startdate.setHours(0);
            startdate.setMinutes(0);
            startdate.setSeconds(0);
            //enddate.setHours(new Date().getUTCHours());
            //enddate.setMinutes(new Date().getUTCMinutes());
            //enddate.setSeconds(new Date().getUTCSeconds());
            this.startDate = new Date(this.datePipe.transform(startdate, 'yyyy-MM-dd HH:mm:ss'));
            this.endDate = new Date(this.datePipe.transform(enddate, 'yyyy-MM-dd HH:mm:ss'));
            this.FilterType = 'Today'
        }
        else if (type == 'yesterday') {
            startdate.setHours(0);
            startdate.setMinutes(0);
            startdate.setSeconds(0);
            startdate.setDate(startdate.getDate() - 1);
            enddate.setHours(23);
            enddate.setMinutes(59);
            enddate.setSeconds(59);
            enddate.setDate(enddate.getDate() - 1);
            this.startDate = new Date(this.datePipe.transform(startdate, 'yyyy-MM-dd HH:mm:ss'));
            this.endDate = new Date(this.datePipe.transform(enddate, 'yyyy-MM-dd HH:mm:ss'));
            this.FilterType = 'Yesterday'
        }
        if (type == 'custom') {
            this.FilterType = 'Custom'
            this.customstartdate.setFullYear(this.fromDate.year);
            this.customstartdate.setMonth(this.fromDate.month - 1);
            this.customstartdate.setDate(this.fromDate.day);
            
            if (this.toDate != null && this.toDate != undefined) {
                this.customenddate.setFullYear(this.toDate.year);
                this.customenddate.setMonth(this.toDate.month - 1);
                this.customenddate.setDate(this.toDate.day);
                
            }
            else {
                this.customenddate.setFullYear(this.fromDate.year);
                this.customenddate.setMonth(this.fromDate.month - 1);
                this.customenddate.setDate(this.fromDate.day);
                
                
            }
            this.customstartdate.setHours(this.customstarttime.getHours());
            this.customstartdate.setMinutes(this.customstarttime.getMinutes());
            this.customstartdate.setSeconds(0);
            this.startDate = new Date(this.datePipe.transform(this.customstartdate, 'yyyy-MM-dd HH:mm:ss'));
            if (this.toDate != null) {
                this.customenddate.setHours(this.customendtime.getHours());
                this.customenddate.setMinutes(this.customendtime.getMinutes());
            }
            else {
                if (this.customendtime.getHours() == 0) {
                    this.customendtime.setHours(23);
                    this.customendtime.setMinutes(59);
                    this.customendtime.setSeconds(59);
                }

            }
            this.customenddate.setSeconds(0);
            this.endDate = new Date(this.datePipe.transform(this.customenddate, 'yyyy-MM-dd HH:mm:ss'));

            this.passStartDay = this.fromDate.day;
            this.passStartMonth = this.fromDate.month;
            this.passStartYear = this.fromDate.year;
            if (this.toDate != null) {
                this.passEndDay = this.toDate.day;
                this.passEndMonth = this.toDate.month;
                this.passEndYear = this.toDate.year;
                this.passEndHour = this.customendtime.getHours();
                this.passEndMinutes = this.customendtime.getMinutes();
            }
            else {
                var computedEndHour = this.customendtime.getHours() < 23 ? this.customendtime.getHours() : 23;
                var computedEndMinutes = this.customendtime.getMinutes() < 59 ? this.customendtime.getMinutes() : 59;
                this.passEndDay = this.fromDate.day;
                this.passEndMonth = this.fromDate.month;
                this.passEndYear = this.fromDate.year;
                this.passEndHour = computedEndHour;
                this.passEndMinutes = computedEndMinutes;
                //enddate = startdate;
                this.customenddate.setHours(computedEndHour);
                this.customenddate.setMinutes(computedEndMinutes);
                this.customenddate.setSeconds(59);
                this.customenddate.setSeconds(0);
                this.endDate = new Date(this.datePipe.transform(this.customenddate, 'yyyy-MM-dd HH:mm:ss'));
            }

            this.passStartHour = this.customstarttime.getHours();
            this.passStartMinutes = this.customstarttime.getMinutes();

            this.passStartTime = this.startDate;
            this.passEndTime = this.endDate;

            var one_day = 1000 * 60 * 60 * 24;

            var date1_ms = this.customstartdate.getTime();
            var date2_ms = this.customenddate.getTime();

            // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms;
            let diffence = difference_ms / one_day;

            if (difference_ms > 86400000) {
                this.toastr.error("Kindly select less than or equal to 24 hours !", 'Error!');
            }
            else {
                if (this.historytype == 'assert') {
                    this.AssetResult();
                }
                else {
                    this.OperatorResult();
                }
            }

        }
        let data = {
            "StartDay": this.passStartDay,
            "StartMonth": this.passStartMonth,
            "StartYear": this.passStartYear,
            "EndDay": this.passEndDay,
            "EndMonth": this.passEndMonth,
            "EndYear": this.passEndYear,
            "StartHour": this.passStartHour,
            "StartMinutes": this.passStartMinutes,
            "EndHour": this.passEndHour,
            "EndMinutes": this.passEndMinutes,
            "StartTime": this.customstarttime,
            "EndTime":  this.customendtime,
            "HistoryType": this.historytype,
            "SelectAsset": this.SelectAsset,
            "SelectOperator": this.SelectedOperator,
            "FilterType": this.FilterType,
            "StartDate": "",
            "EndDate": "",
            "UtcStartDate":"",
            "UtcEndDate":"",
            "UtcStartTime":"",
            "UtcEndTime":""

        }
       // this.assetprohelperService.changemodel(data);
        if (type != 'custom') {
            if (this.historytype == 'assert') {
                this.AssetResult();
            }
            else {
                this.OperatorResult();
            }
        }

    }

    addgeofence() {
        let responsedata = {
            'prmarymenutype': 'geofence',
            'submenutype': 'addgeofence',
            'maptype': 'markerwithgeofence',
            'historydetils': history,
            'IsshowDashboard': false,
            'mode': 'add'
        }
        this.assetprohelperService.ChangeMapActon(responsedata);
    }

    ChangeGeoFence(geofence) {
        this.selectgeofenceName = geofence.Name;
        this.selectgeofence = geofence;
        let temp = [];
        geofence.featureid = "Location." + geofence.ID;
        geofence.name = geofence.Name;
        temp.push(geofence);
        let data = {
            'prmarymenutype': 'location',
            'submenutype': '',
            'IsselectedSite': true,
            'maptype': 'markerwithgeofence',
            'coordinates': temp,
            'sitelat': geofence.SiteLat,
            'sitlng': geofence.SiteLong,
            'type': 'GeoFencestype'
        }
        this.assetprohelperService.ChangeMapActon(data);
    }


}
