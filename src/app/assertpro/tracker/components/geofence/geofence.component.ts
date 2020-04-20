import { Component, OnInit } from '@angular/core';
import { AssetprohelperService } from '../../../../share/services/assetprohelper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.component.html',
  styleUrls: ['./geofence.component.css']
})
export class GeofenceComponent implements OnInit {

  constructor(private assetprohelperService: AssetprohelperService, private spinner: NgxSpinnerService) { }


  public cleardata: any = {
    'prmarymenutype': 'clear',
    'submenutype': null,
    'maptype': null,
    'coordinates': []
  }
  private changeMapSubscription: Subscription;
  private refreshSubscription: Subscription;
  private geofenceSubscription:Subscription;
  ngOnInit() {
    this.getSiteGeofenceEnable=false;
    this.assetprohelperService.ChangeMapActon(this.cleardata);
    this.changeMapSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.RemoveFilterItem();
      this.GetSiteGeofence();
    })

    this.refreshSubscription = this.assetprohelperService.refreshgeofence$.subscribe((data) => {
      this.assetprohelperService.ChangeMapActon(this.cleardata);
      this.GetSiteGeofence();
    })
    this.geofenceSubscription= this.assetprohelperService.getGeofence$.subscribe((data) => {
      if(data){
          this.GetSiteGeofence();
          this.searchText=''
          this.bubbles=[]
      }
  });
  }
  ngOnDestroy() {
    try {
      this.changeMapSubscription.unsubscribe();
      this.refreshSubscription.unsubscribe();
      this.geofenceSubscription.unsubscribe();
    } catch (e) {
      console.log(e);
    }
  }
  public geofences: any = [];
  public searchText: any = '';

  addgeofence() {

    let responsedata = {
      'prmarymenutype': 'geofence',
      'submenutype': 'addgeofence',
      'maptype': 'markerwithgeofence',
      'historydetils': history,
      'IsshowDashboard': false,
      'mode':'add'
    }
    this.assetprohelperService.ChangeMapActon(responsedata);
  }
  getSiteGeofenceEnable:boolean=false
  GetSiteGeofence() {
    if(this.getSiteGeofenceEnable){
      return;
    }
    this.getSiteGeofenceEnable=true;
    this.spinner.show()
    let url = 'TrackingGeofence/GetGeoFence?siteID=' + localStorage.getItem('selectitemId');
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        this.spinner.hide();
        this.getSiteGeofenceEnable=false
        let body: any = JSON.parse(data['_body']);
        this.geofences = body.Data;
        
      })
  }

  public bubbles: any = [];
  public SelectAsset: any = [];
  public selectedgeofence: any = [];
  AssetItem(value: string, typevalue, lat, lng, uniqueid, typename) {
    if (value != '') {
      for (var i = 0; i < this.bubbles.length; i++) {
        if (this.bubbles[i].id == typevalue.SiteUniqueID) {
          this.bubbles.splice(i, 1);
        }
      }
      this.bubbles.push({ 'id': typevalue.SiteUniqueID, 'value': value, 'uniqueid': uniqueid, 'typename': typename });

    }
    if (typename == 'GeoFencestype') {
      var bubblesassettype = this.bubbles.filter(p => p.uniqueid == uniqueid);
      var assetsparent = this.geofences.filter(p => p.UniqueID == uniqueid);


      if (bubblesassettype.length > 1) {

        for (var i = 0; i < this.bubbles.length; i++) {
          for (var j = 0; j < bubblesassettype.length; j++) {
            if (this.bubbles[i].id == bubblesassettype[j].id) {
              this.bubbles.splice(i, 1);
            }
          }
        }

        for (var i = 0; i < this.SelectAsset.length; i++) {
          for (var j = 0; j < assetsparent[0].GeoFences.length; j++) {
            if (this.SelectAsset[i] == assetsparent[0].GeoFences[j].SiteUniqueID) {
              this.SelectAsset.splice(i, 1);
            }
          }
        }

        this.bubbles.push({ 'id': typevalue.UniqueID, 'value': value, 'typename': typename });
        this.SelectAsset.push(typevalue.UniqueID);
      }
    }
    // if (typename == 'GeoFences') {
    //   var bubblesassettype = this.bubbles.filter(p => p.uniqueid == uniqueid);
    //   var assetsparent = this.geofences.filter(p => p.UniqueID == uniqueid);

    //   if (bubblesassettype.length == assetsparent[0].GeoFences.length) {

    //     for (var i = 0; i < this.bubbles.length; i++) {
    //       for (var j = 0; j < bubblesassettype.length; j++) {
    //         if (this.bubbles[i].id == bubblesassettype[j].id) {
    //           this.bubbles.splice(i, 1);
    //         }
    //       }
    //     }
    //     this.bubbles.push({ 'id': typevalue.SiteUniqueID, 'value': assetsparent[0].name + '/' + 'All', 'typename': typename });
    //   }
    // }

    this.selectedgeofence = typevalue;
    let data = {
      'prmarymenutype': 'geofence',
      'submenutype': '',
      'IsselectedSite': true,
      'maptype': 'markerwithgeofence',
      'coordinates': this.selectedgeofence,
      'type': typename,
      'sitelat': lat,
      'sitlng': lng
    }
    this.assetprohelperService.ChangeMapActon(data);
  }

  RemoveFilterItem() {
    this.bubbles = [];
    this.SelectAsset = [];
    let computedData = [];
    if (this.selectedgeofence.length != 0) {
      if (this.selectedgeofence.length > 1) {
        for (var geofenceIndex = 0; geofenceIndex < this.selectedgeofence.length; geofenceIndex++) {
          computedData.push({
            'featureid': this.selectedgeofence[geofenceIndex].featureid,
            'coordinates': this.selectedgeofence[geofenceIndex].gometry.coordinates
          });
        }
      }
      else {
        computedData.push({
          'featureid': this.selectedgeofence.featureid,
          'coordinates': this.selectedgeofence.gometry.coordinates
        });
      }
    }
    this.assetprohelperService.RemoveGeoFence(computedData);
  }
}
