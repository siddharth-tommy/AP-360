import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class AssetprohelperService {
    constructor(private http: Http) {

    }
    private _SiteAction = new BehaviorSubject<any>(false);
    SiteAction$ = this._SiteAction.asObservable();

    private mapvalue = new BehaviorSubject<any>({});
    mapvalue$ = this.mapvalue.asObservable();


    private getGeofence = new BehaviorSubject<any>(false);
    getGeofence$ = this.getGeofence.asObservable();

    private datemodel = new BehaviorSubject<any>(false);
    datemodel$ = this.datemodel.asObservable();


    private fullscreen = new BehaviorSubject<any>(false);
    fullscreen$ = this.fullscreen.asObservable();

    private refreshgeofence = new BehaviorSubject<any>(false);
    refreshgeofence$ = this.refreshgeofence.asObservable();

    private dateObjectValue = new BehaviorSubject<any>({});
    dateObjectValue$ = this.dateObjectValue.asObservable();

    private geofenceObjectValue = new BehaviorSubject<any>({});
    geofenceObjectValue$ = this.geofenceObjectValue.asObservable();

    private showallTab = new BehaviorSubject<any>({});
    showallTab$ = this.showallTab.asObservable();

    private _SiteUpdate = new BehaviorSubject<any>(false);
    SiteUpdate$ = this._SiteUpdate.asObservable();

    private _SiteDefault = new BehaviorSubject<any>(false);
    SiteDefault$ = this._SiteDefault.asObservable();

    private _SiteCall = new BehaviorSubject<any>(false);
    SiteCall$ = this._SiteCall.asObservable();

    private _menuHide = new BehaviorSubject<any>(false);
    menuHide$ = this._menuHide.asObservable();
    
    menuHide(data){
        this._menuHide.next(data);
    }
    callAgain(data){
        this._SiteCall.next(data);
    }

    updateSite(data) {
        this._SiteUpdate.next(data);
    }
    siteDefault(data){
        this._SiteDefault.next(data);
    }
    ChangeActiongeofence(data) {
        this.refreshgeofence.next(data);
    }
    ChanageScreen(data) {
        this.fullscreen.next(data);
    }

    changemodel(data) {
        this.datemodel.next(data);
    }
    ChangeMapActon(data) {
        this.mapvalue.next(data);
    }

    ChangeDateObject(data) {
        this.dateObjectValue.next(data);
    }

    ChangeDefaultSite(data) {
        this._SiteAction.next(data);
        let url = 'Account/VisitedUserSite?id=' + data.SiteID;
        this.GetMethod(url).subscribe(
            data => {

            })
    }

    RemoveGeoFence(data) {
        this.geofenceObjectValue.next(data);
    }


    logout() {
        localStorage.removeItem('assetprotoken');
        localStorage.setItem('sitename', 'All Sites');
        localStorage.setItem('selectitemId', null);
    }

    GetMethod(url) {

        return this.http.get(url);
    }

    PostMethod(url, data) {
        return this.http.post(url, data);
    }

    DeleteMethod(url) {
        return this.http.delete(url);
    }
    ChangeShowDashboard(data) {
        this.showallTab.next(data);
    }
    geofenceSave(data){
        this.getGeofence.next(data);
    }
}