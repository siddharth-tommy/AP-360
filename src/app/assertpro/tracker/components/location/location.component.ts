import { Component, OnInit } from '@angular/core';
import { AssetprohelperService } from '../../../../share/services/assetprohelper.service';
import { OperatorsPipe } from '../../../../share/pipe/operators.pipe';
import { AssetsPipe } from '../../../../share/pipe/assets.pipe';
import { AssetstypePipe } from '../../../../share/pipe/assetstype.pipe';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  public locationtype: any = 'assert';
  public filtermode: any = [
    { 'id': '1282', 'api': 'LogOn', 'name': 'Log on', 'status': false },
    { 'id': '1283', 'api': 'LogOff', 'name': 'Log off', 'status': false },
    { 'id': '3587', 'api': 'MaintainanceLockout', 'name': 'Maintenance', 'status': false },
    { 'id': '3588', 'api': 'BypassCode', 'name': 'ByPass', 'status': false }
  ]

  public filteralarms: any = [
    { 'id': '261', 'api': 'ImpactAlarm', 'name': 'Impact', 'status': false },
    { 'id': '259', 'api': 'CheckListAlarm', 'name': 'Checklist', 'status': false },
    { 'id': '264', 'api': 'PMDueAlarm', 'name': 'PM due', 'status': false },
    { 'id': '265', 'api': 'LowFuel', 'name': 'Low fuel', 'status': false },
    { 'id': '1284', 'api': 'Assetfault', 'name': 'Asset fault', 'status': false }
  ]

  public geofences: any = [];
  public bubbles: any = [];
  public bubblevalue;
  public assets: any = [];
  public assetparent: any = [];
  public operators: any = [];
  public operators2: any = [];
  public selectgeofence = 'Zoom to....';
  public mode = false;
  public alarm = false;
  public EventCodes: any = [];
  public markar: any;
  public SelectAssettype: any = [];
  public SelectAsset: any = [];
  public SelectedOperator: any = [];
  public SelectAssettypeID: any = null;
  public SelectAssetId: any = null;
  public SelectOperator: any = null;
  public map: any;




  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private assetprohelperService: AssetprohelperService, private assetsPipe: AssetsPipe, private assetstypePipe: AssetstypePipe, private operatorsPipe: OperatorsPipe) { }
  private siteActionSubscription: Subscription;
  private geofenceSubscription:Subscription
  ngOnInit() {
    //this.GetSiteGeofence();
    this.siteActionSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.clearAllasset2();
      this.GetAssetsList();
      this.GetSiteGeofence();
      this.clearFilters();
      this.locationtype = "assert";
    })
    this.geofenceSubscription= this.assetprohelperService.getGeofence$.subscribe((data) => {
      if(data){
          this.GetSiteGeofence();
          this.selectgeofence = 'Zoom to....';
      }
  });
  }
  ngOnDestroy() {
    try {
      this.siteActionSubscription.unsubscribe();
      this.geofenceSubscription.unsubscribe();
    } catch (e) {
      console.log(e);
    }
  }


  GetSiteGeofence() {
    let url = 'TrackingLocation/GetGeoFenceLocation?siteID=' + localStorage.getItem('selectitemId');
    this.spinner.show();
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        this.spinner.hide()
        let body: any = JSON.parse(data['_body']);
        this.geofences = body.Data;
      })
  }
  GetAssetsList() {
    var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    let url = 'TrackingLocation/assetwithsite?id=' + computedID;
    this.assets = [];
    this.spinner.show();
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        this.spinner.hide()
        let body: any = JSON.parse(data['_body']);
        this.assets = body.Data;
        this.AssetResult();
      })
  }


  GetOperatorList() {
    let url = 'TrackingLocation/operatorwithsite?id=' + localStorage.getItem('selectitemId');
    this.operators = [];
    this.operators2 = [];
    this.spinner.show();
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        this.spinner.hide()
        let body: any = JSON.parse(data['_body']);
        this.operators = body.Data;
        let obj = {};
        obj = Object.keys(this.operators.reduce((prev, next) => {
          if (!obj[next['OperatorName']]) obj[next['OperatorName']] = next;
          return obj;
        }, obj)).map((i) => obj[i]);
        this.operators2 = obj;
        this.OperatorResult();
        
      })
  }


  singlefilter(type, value) {
    this.isDeleteGeofence=false;
    if (localStorage.getItem('sitename') != 'All Sites') {
      this.EventCodes = [];
      if (type == 'mode') {
        value.status = !value.status;
        this.mode = true;
        for (var i = 0; i < this.filtermode.length; i++) {
          if (!this.filtermode[i].status) {
            this.mode = false;
          }
        }
      }
      else {
        value.status = !value.status;
        this.alarm = true
        for (var j = 0; j < this.filteralarms.length; j++) {
          if (!this.filteralarms[j].status) {
            this.alarm = false;
          }

        }
      }

      for (var i = 0; i < this.filtermode.length; i++) {
        if (this.filtermode[i].status) {
          this.EventCodes.push(this.filtermode[i].api);
        }
      }

      for (var j = 0; j < this.filteralarms.length; j++) {
        if (this.filteralarms[j].status) {
          this.EventCodes.push(this.filteralarms[j].api);
        }
      }
      if (this.locationtype == 'assert') {
        this.AssetResult();
      }
      else {
        this.OperatorResult();
      }
    }
    else {
      this.toastr.error("Kindly select the site", 'Error!');
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




  selectfilter(type) {
    this.isDeleteGeofence=false;
    if (localStorage.getItem('sitename') != 'All Sites') {
      this.EventCodes = [];
      if (type == 'mode') {
        this.mode = !this.mode;
        if (this.mode) {
          for (var i = 0; i < this.filtermode.length; i++) {
            this.filtermode[i].status = true;
          }
        }
        else {
          for (var i = 0; i < this.filtermode.length; i++) {
            this.filtermode[i].status = false;
          }
        }

      }
      else {
        this.alarm = !this.alarm;
        if (this.alarm) {
          for (var j = 0; j < this.filteralarms.length; j++) {
            this.filteralarms[j].status = true;
          }
        }
        else {
          for (var j = 0; j < this.filteralarms.length; j++) {
            this.filteralarms[j].status = false;
          }
        }
      }

      for (var i = 0; i < this.filtermode.length; i++) {
        if (this.filtermode[i].status) {
          this.EventCodes.push(this.filtermode[i].api);
        }
      }

      for (var j = 0; j < this.filteralarms.length; j++) {
        if (this.filteralarms[j].status) {
          this.EventCodes.push(this.filteralarms[j].api);
        }
      }

      if (this.locationtype == 'assert') {
        this.AssetResult();
      }
      else {
        this.OperatorResult();
      }
    }
    else {
      this.toastr.error("Kindly select the site", 'Error!');
    }
  }


  selectallitem() {
    if (localStorage.getItem('sitename') != 'All Sites') {
      this.mode = true;
      this.alarm = true;
      this.EventCodes = [];
      for (var i = 0; i < this.filtermode.length; i++) {
        this.filtermode[i].status = true;
      }
      for (var j = 0; j < this.filteralarms.length; j++) {
        this.filteralarms[j].status = true;
      }

      for (var i = 0; i < this.filtermode.length; i++) {
        if (this.filtermode[i].status) {
          this.EventCodes.push(this.filtermode[i].api);
        }
      }

      for (var j = 0; j < this.filteralarms.length; j++) {
        if (this.filteralarms[j].status) {
          this.EventCodes.push(this.filteralarms[j].api);
        }
      }
      if (this.locationtype == 'assert') {
        this.AssetResult();
      }
      else {
        this.OperatorResult();
      }
    }
    else {
      this.toastr.error("Kindly select the site", 'Error!');
    }
  }


  popup: any = [];

  AssetResult() {
    let currentasset: any = [];
    if (this.isDeleteGeofence)
      this.selectgeofence = 'Zoom to....';
    var assettypefilter: any = this.assetstypePipe.transform(this.assets, this.SelectAssettype, this.SelectAsset, this.EventCodes);
    let k = 0;
    for (var i = 0; i < assettypefilter.length; i++) {
      var finalfilterasset = this.assetsPipe.transform(assettypefilter[i].assets, this.SelectAssettype, this.SelectAsset, this.EventCodes);
      for (var j = 0; j < finalfilterasset.length; j++) {
        currentasset.push(finalfilterasset[j]);
      }
    }
    let data = {
      'prmarymenutype': 'location',
      'submenutype': 'asset',
      'maptype': 'markerwithgeofence',
      'coordinates': currentasset,
      'isDeleteGeofence': this.isDeleteGeofence,
      'clearexisting': true
    }
    if(!this.isDeleteGeofence){
      data.clearexisting=false;
    }
    // if (this.locationtype == 'assert') {
    this.assetprohelperService.ChangeMapActon(data);
    // }
    // else {
    //   this.OperatorResult();
    // }
  }

  OperatorResult() {
    //this.selectgeofence = 'Zoom to....';
    let filteroperator: any = this.operatorsPipe.transform(this.operators, this.SelectedOperator, this.EventCodes);
    let data = {
      'prmarymenutype': 'location',
      'submenutype': 'operator',
      'maptype': 'markerwithgeofence',
      'coordinates': filteroperator,
      'isDeleteGeofence': this.isDeleteGeofence,
      'clearexisting': true
    }
    // if (this.locationtype == 'operator') {
    this.assetprohelperService.ChangeMapActon(data);
    // }
    // else {
    //   this.AssetResult();
    // }

  }

  public cleardata: any = {
    'prmarymenutype': 'clear',
    'submenutype': null,
    'maptype': null,
    'coordinates': []
  }

  Locationtype(type) {
    this.selectgeofence = 'Zoom to....';
    this.searchText = '';
    this.locationtype = type;
    this.bubbles = [];
    this.SelectAssettype = []
    this.SelectAsset = []
    this.SelectedOperator = []
    this.clearFilters()
    if (type == 'assert') {
      this.AssetResult();
    }
    else {
      this.OperatorResult();
      this.GetOperatorList();
    }

    this.assetprohelperService.ChangeMapActon(this.cleardata);
    //this.GetLocationDetails();
    //this.GetStaticLocationDetails();
    //clearInterval(this.intervalId);
  }

  AssetItem(value: string, type, typevalue, typename) {
    if (type == 'asset') {
      if(typevalue.lat==null && typevalue.lon==null){
        this.toastr.warning("No Coordinates Available", "Warning");
        return;
      }
    }
    if (localStorage.getItem('sitename') != 'All Sites') {
      if (value != '') {
        for (var i = this.bubbles.length - 1; i >= 0; i--) {
          if (this.bubbles[i].id == typevalue.AssetTypeID) {
            this.bubbles.splice(i, 1);
          }
        }
        var isExist = this.bubbles.filter(p => p.value == value);
        if (isExist.length == 0)
          this.bubbles.push({ 'id': typevalue.ID, 'value': value, 'type': type, 'typename': typename });
      }
      if (type == 'asset') {
        var bubblesassettype = this.bubbles.filter(p => p.typename == typename);
        var assetsparent = this.assets.filter(p => p.assetstype == typename);

        if (bubblesassettype.length >= assetsparent[0].assets.length) {

          for (var i = 0; i < this.bubbles.length; i++) {
            for (var j = 0; j < bubblesassettype.length; j++) {
              if (this.bubbles[i].id == bubblesassettype[j].id) {
                this.bubbles.splice(i, 1);
              }
            }
          }

          this.bubbles.push({ 'id': assetsparent[0].ID, 'value': assetsparent[0].assetstype + '/' + 'All', 'type': 'assettype', 'typename': assetsparent[0].assetstype });
          this.SelectAssettype.push(assetsparent[0].ID);
          let temp = assetsparent[0].assets
          for (let n = 0; n < this.SelectAsset.length; n++) {
            for (let p = 0; p < temp.length; p++) {
              if (this.SelectAsset[n] == temp[p].ID) {
                this.SelectAsset.splice(n, 1);
              }
            }
          }
        } else {
          //this.SelectAssettype = [];
          for (var i = 0; i < this.SelectAsset.length; i++) {
            if (this.SelectAsset[i] == typevalue.ID) {
              this.SelectAsset.splice(i, 1);
            }
          }
          this.SelectAsset.push(typevalue.ID);
          for (let n = 0; n < this.SelectAssettype.length; n++) {
            if (this.SelectAssettype[n]== typevalue.AssetTypeID){
              this.SelectAssettype.splice(n, 1);
            }       
           }
        }
      }

      else if (type == 'assettype') {
        var bubblesassettype = this.bubbles.filter(p => p.typename == typename);
        var assetsparent = this.assets.filter(p => p.assetstype == typename);
        if (bubblesassettype.length > 1) {

          for (var i = 0; i < this.bubbles.length; i++) {
            for (var j = 0; j < bubblesassettype.length; j++) {
              if (this.bubbles[i].id == bubblesassettype[j].id) {
                this.bubbles.splice(i, 1);
              }
            }
          }

          for (var i = 0; i < this.SelectAsset.length; i++) {
            for (var j = 0; j < assetsparent[0].assets.length; j++) {
              if (this.SelectAsset[i] == assetsparent[0].assets[j].ID) {
                this.SelectAsset.splice(i, 1);
              }
            }
          }
          var isExist = this.bubbles.filter(p => p.value == value);
          if (isExist.length == 0)
            this.bubbles.push({ 'id': typevalue.ID, 'value': value, 'type': type, 'typename': typename });
        }

        for (var i = 0; i < this.SelectAssettype.length; i++) {
          if (this.SelectAssettype[i] == typevalue.ID) {
            this.SelectAssettype.splice(i, 1);
          }
        }
        this.SelectAssettype.push(typevalue.ID);
      }
      this.isDeleteGeofence = false;
      this.AssetResult();
    }
    else {
      this.toastr.error("Kindly select the site", 'Error!');
    }

  }

  OperatorItem(value: string, type, typevalue) {
    //this.bubbles = [];
    //this.SelectedOperator = [];
      if(typevalue.lat==null && typevalue.lon==null){
        this.toastr.warning("No Coordinates Available", "Warning");
        return;
      }
    
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

    this.OperatorResult();
  }

  public isDeleteGeofence: boolean = false;
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

    this.AssetResult();
  }
  RemoveFilterItem2(value) {

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
  }
  clearAllOperator() {
    this.searchText = ''
    this.selectgeofence = 'Zoom to....';
    this.bubbles = []
    this.SelectAssettype = []
    this.SelectAsset = []
    this.SelectedOperator = []  
    this.isDeleteGeofence=true;
    this.assetprohelperService.ChangeMapActon(this.cleardata);
    this.OperatorResult()
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
    this.isDeleteGeofence=false;
    if (this.bubbles.length == 0) {
      this.GetOperatorList();
     // this.assetprohelperService.ChangeMapActon(this.cleardata);
    } else {
      this.OperatorResult()
    }
  }
  searchText = '';
  clearAllasset() {
    this.searchText = '';
    this.isDeleteGeofence = true;
    for (var i = 0; i < this.bubbles.length; i++)
      this.RemoveFilterItem(this.bubbles[i]);
    this.bubbles = [];
    this.SelectAsset = [];
    this.SelectAssettype = [];
    this.selectgeofence = 'Zoom to....';
    // if (this.locationtype == 'assert') {
    //   this.AssetResult();
    // }
    // else {
    //   this.OperatorResult();
    // }
    // this.assetprohelperService.ChangeMapActon(this.cleardata);

    this.assetprohelperService.ChangeMapActon(this.cleardata);

    if (this.locationtype == 'operator') {
      this.GetOperatorList();
    } else {
      this.GetAssetsList();
    }
    this.GetSiteGeofence();
  }

  clearAllasset2() {
    this.isDeleteGeofence = true;
    for (var i = 0; i < this.bubbles.length; i++)
      this.RemoveFilterItem2(this.bubbles[i]);
    this.bubbles = [];
    this.SelectAsset = [];
    this.SelectAssettype = [];
    this.selectgeofence = 'Zoom to....';
    // if (this.locationtype == 'assert') {
    //   this.AssetResult();
    // }
    // else {
    //   this.OperatorResult();
    // }
    // this.assetprohelperService.ChangeMapActon(this.cleardata);

    this.assetprohelperService.ChangeMapActon(this.cleardata);


  }
  ChangeGeoFence(geofence) {
    this.selectgeofence = geofence.Name;
    var temp = [];
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

  clearFilters() {
    for (var i = 0; i < this.filtermode.length; i++) {
      this.filtermode[i].status = false;
    }
    for (var j = 0; j < this.filteralarms.length; j++) {
      this.filteralarms[j].status = false;
    }
    this.EventCodes = [];
    this.mode = false;
    this.alarm = false;
  }

}
