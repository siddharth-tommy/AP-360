import { Component, OnInit, ViewChild } from '@angular/core';
import { AssetprohelperService } from '../../../../share/services/assetprohelper.service';
import * as MapboxDraw from 'mapbox-gl-draw';
import { DatePipe } from '@angular/common';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import * as turf from 'turf';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';;
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [DatePipe]
})
export class MapComponent implements OnInit {

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  public customstartdate: any = new Date();
  public customstarttime: any = new Date();

  public default_longitude: number = -98.57948;
  public default_latitude: number = 39.828346;

  public customenddate: any = new Date();
  public customendtime: any = new Date();
  constructor(private calendar: NgbCalendar, private assetprohelperService: AssetprohelperService, private toastr: ToastrService, private spinner: NgxSpinnerService, private datePipe: DatePipe) {
    //mapboxgl.accessToken = 'pk.eyJ1IjoicHJpdGhpIiwiYSI6ImNqcWdnM3o4dTR5dHY0M3BwOWl5MzR6dmwifQ.eLKcsfMsjnwIxLyJTpO2Wg';
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWNjZXNzIiwiYSI6ImZVR2xUOWcifQ.lsenYLUIWQoYGH27v2aC6Q';
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
  }
  public map: any;
  public markar: any = [];
  public popup: any = [];
  public menutype: any = '';
  public showcolorcode: any = false;
  //public CurrentassetHistory = new Array(135);
  public CurrentassetHistory: any = [];
  public Isaddgeofence: any = false;
  public timelineselected;
  public historyCoornidates;
  @ViewChild('mapdatemodel') datemodel;
  @ViewChild('dp') dateTimePicker;

  pin: string = '<img src="/assets/icon/pin.png" style="margin-top:-100%;width:47px;height:64px" />';
  redPin: string = '<img src="/assets/icon/red-pin.png" style="margin-top:-100%;width:47px;height:64px" />';
  purplePin: string = '<img src="/assets/icon/purple_pin.png" style="margin-top:-100%;width:47px;height:64px" />';
  private siteActionSubscription: Subscription;
  private mapValueSubscription: Subscription;
  private geofenceSubscription: Subscription;
  ngOnInit() {

    this.buildMap();
    this.siteActionSubscription = this.assetprohelperService.SiteAction$.subscribe((data) => {
      if (localStorage.getItem('sitename') == 'All Sites') {
        this.removegeofence();
        this.Isaddgeofence = false;
        this.IsEditgeofence = false;
      } else {
        this.showMainDashboard();
      }
      // if (this.IsEditgeofence || this.Isaddgeofence)
      //   this.showMainDashboard();
      //this.showmoreGeoFenceDetails = false;
      this.clearAllasset();
    });

    this.mapValueSubscription = this.assetprohelperService.mapvalue$.subscribe((data) => {
      this.clearPlay();
      this.menutype = ''
      this.Isselectedgeofence = false;
      if (data != null && data != undefined) {
        // if (data.IsshowDashboard)
        //   this.showMainDashboard();
        if (data.typeCancel == true) {
          return;
        }
        if (data.prmarymenutype == "location") {
          if (data.clearexisting == true) {
            if (this.draw != undefined)
              this.draw.deleteAll()
          }
          this.menutype = "location";
          try {
            if (data.type == 'GeoFencestype' && data.prmarymenutype == 'location' && data.submenutype == '') {
              if (this.draw != undefined)
                this.draw.deleteAll()
            } else {
              this.clear()
              this.getInitialSites(data)
            }
          } catch (e) {
            console.log(e);
            this.getInitialSites(data)
          }
          if (data.coordinates.length > 1 && data.isDeleteGeofence)
            this.removegeofence();
          //this.RemoveALLMapItem();
          if (data.IsselectedSite) {
            this.getuserSites();
            if (data.isDeleteGeofence)
              this.removegeofence();
            this.DrawSelectedGeofence(data);
          }

        }
        else if (data.prmarymenutype == "history") {
          this.clear();
          this.menutype = "history";
          this.isChangeDateClicked = false;
          this.SelectHistoryAssetType(data, true);
          if (localStorage.getItem('sitename') == 'All Sites') {
            this.RemoveALLMapItem();
          }
        }
        else if (data.prmarymenutype == "clear") {
          this.RemoveALLMapItem();
          this.clear();
          this.removegeofence();
          if (this.draw != undefined)
            this.draw.deleteAll();
        }
        else if (data.prmarymenutype == "geofence") {
          this.menutype = "geofence";
          // this.getuserSites();
          if (data.submenutype == 'addgeofence' && data.mode == 'add') { //Geofence Create Mode
            this.selectAsset=[]
            this.selectgeoUniqueId = ""
            this.editgeofenceData = ''
            if (this.draw != undefined)
              this.draw.deleteAll();
            this.removegeofence();
            //this.clear();
            this.createMode = true
            this.editMode = false;
            this.beforeEditMode = false;
            this.startEditMode = false;

            this.Selectedgeofencefeatures = "";
            this.Isselectedgeofence = false;
            this.Isdrawtoolactive = false;
            this.Isaddgeofence = true;

            if (!this.IsEditgeofence) {
              this.editfence = "";
              this.selectgeoUniqueId = "";
              this.Selectedgeofencefeatures = "";
              this.removegeofence();
            }
            this.selectdropdownitem = localStorage.getItem('sitename');
            this.selectedsiteId = localStorage.getItem('siteUnique');
            this.GetAssetsList(localStorage.getItem('selectitemId'))
          }
          if (data.IsselectedSite) {
            this.selectgeoUniqueId = "" //Geofence Edited Id
            this.removegeofence();
            this.DrawSelectedGeofence(data);
          }
        }
      }
    });
    this.historyStartTime.setHours(0);
    this.historyStartTime.setMinutes(0);
    this.historyEndTime.setHours(24);
    this.historyEndTime.setMinutes(0);
    this.geofenceSubscription = this.assetprohelperService.geofenceObjectValue$.subscribe((data) => {
      this.firstGeofenceCreate = false
      this.editgeofenceData = ''
      if (data != null && data != undefined) {
        this.latest_feataure = data;
        this.removegeofence();
        this.beforeEditMode = false;
      }
    });
    this.assetprohelperService.datemodel$.subscribe((data) => {
      if (data != false) {
        this.fromDate = this.calendar.getToday();
        this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1); 
        this.historyType = data.HistoryType;
        this.selectAsset = data.SelectAsset;
        this.selectOperator = data.SelectOperator
        if (data.StartTime != undefined) {
          this.historyStartTime = data.StartTime;
          this.fromDate.day = data.StartTime.getDate();
          this.fromDate.month = data.StartTime.getMonth() + 1;
          this.fromDate.year = data.StartTime.getFullYear();
        }
        if (data.EndTime != undefined) {
          this.historyEndTime = data.EndTime;
          this.toDate.day = data.EndTime.getDate();
          this.toDate.month = data.EndTime.getMonth() + 1;
          this.toDate.year = data.EndTime.getFullYear();
        }
        this.FilterType = data.FilterType;
        this.StartDate = data.StartDate;
        this.EndDate = data.EndDate;

        if (data.UtcStartDate != '') {

          this.historyStartTime = new Date(data.UtcStartDate + ' ' + data.UtcStartTime);

          // let tempdate = data.UtcStartTime.split(":")
          // this.historyStartTime.setHours(tempdate[0])
          // this.historyStartTime.setMinutes(tempdate[1])
          // this.historyStartTime.setSeconds(tempdate[2])

        }
        if (data.UtcEndDate != '') {
          this.historyEndTime = new Date(data.UtcEndDate + ' ' + data.UtcEndTime);
          // let tempdate = data.UtcEndTime.split(":")
          // this.historyEndTime.setHours(tempdate[0])
          // this.historyEndTime.setMinutes(tempdate[1])
          // this.historyEndTime.setSeconds(tempdate[2])
        }
      }
    })
  }
  FilterType = 'Custom'
  StartDate = '';
  EndDate = '';
  ngOnDestroy() {
    try {
      this.siteActionSubscription.unsubscribe();
      this.mapValueSubscription.unsubscribe();
      this.geofenceSubscription.unsubscribe();
    } catch (e) {
      console.log(e);
    }
  }
  buildMap() {
    let thiskey = this;
    let long = this.default_longitude + ''
    let lat = this.default_latitude + ''
    // if (localStorage.getItem('sitename') != 'All Sites') {
    //   long=localStorage.getItem('siteLng')
    //   lat=localStorage.getItem('siteLat')
    // }  

    let mapStyle = 'streets-v9';
    if (this.satellitetype) {
      mapStyle = 'satellite-v9'
    }
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/' + mapStyle,
      center: [long, lat],
      zoom: thiskey.zoomlevel,
      speed: 4.4
    });
    this.map.on('draw.modechange', (e) => {
      if (e.mode == "draw_polygon") {
        this.map.getCanvas().style.cursor = 'pointer';
      }
      else {
        this.map.getCanvas().style.cursor = '';
      }
      const data = this.draw.getAll();
      let thiskey = this;

      this.map.on('draw.modechange', (e) => {
        if (e.mode == "direct_select") {
          let responsedata = {
            'prmarymenutype': 'geofence',
            'submenutype': 'addgeofence',
            'maptype': 'markerwithgeofence',
            'historydetils': history,
            'IsshowDashboard': false
          }
          this.Selectedgeofencefeatures = "";

          // thiskey.assetprohelperService.ChangeMapActon(responsedata);
        }

      })
      var coordinates = data.features[0].geometry.coordinates[0];
      let geomatry = data.features[0].geometry.coordinates[0]
      let value = {
        'coordinates': geomatry,
        'type': "Polygon"
      }
      this.Selectedgeofencefeatures = value;

      if (this.draw.getMode() == 'draw_polygon') {
        var pids = []

        // ID of the added template empty feature
        const lid = data.features[data.features.length - 1].id

        data.features.forEach((f) => {
          if (f.geometry.type === 'Polygon' && f.id !== lid) {
            pids.push(f.id);
            this.pids.push(f.id);
          }
        })
        this.draw.delete(pids)
      }
      //clear EditMode Data because we shouldn't save in editmode
      if (e.mode == "direct_select") {
        thiskey.Selectedgeofencefeatures = "";
        thiskey.editfence = "";
      }
    });
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false,
        trash: false
      },
      styles: [{
        "id": "gl-draw-polygon-fill",
        "type": "fill",
        "paint": {
          "fill-color": "#169bd7",
          "fill-outline-color": "#D20C0C",
          "fill-opacity": 0.1
        }
      },
      //*** HERE YOU DEFINE POINT STYLE *** //
      {
        "id": "gl-draw-point",
        "type": "circle",
        "paint": {
          "circle-radius": 3,
          "circle-color": "#ff0202"
        }
      } //**********************************//
        ,
      {
        "id": "gl-draw-polygon-stroke-active",
        "type": "line",
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#169bd7",
          "line-width": 2
        }
      },
      {
        "id": "gl-draw-polygon-and-line-vertex-active",
        "type": "circle",
        "filter": ["all", ["==", "meta", "vertex"],
          ["==", "$type", "Point"],
          ["!=", "mode", "static"]
        ],
        "paint": {
          "circle-radius": 3,
          "circle-color": "#470CD1",
        }
      }
      ]
    });
    this.map.addControl(this.draw);

  }
  public latest_feataure: any = [];
  public editfence: any = [];
  public editgeofenceData: any = '';
  firstGeofenceCreate = false;
  showPopup=false;
  DrawSelectedGeofence(data) {
    this.firstGeofenceCreate = true;
    this.removegeofence();
    this.clearAllasset()
    this.GetAssetsList(localStorage.getItem('selectitemId'))
    this.editfence = data;
    this.editgeofenceData = data
    this.zoomlevel = 10;
    //get mile
    var markers = [];
    var markerCoOrdinates = [];
    let datas = []
    if (data.coordinates.gometry == undefined) {
      datas = data.coordinates[0].gometry.coordinates
    } else {
      datas = data.coordinates.gometry.coordinates
    }
    datas.forEach(element => {
      if (element[0] != null && element[1] != null) {
        markerCoOrdinates.push([element[0], element[1]]);
        markers.push(turf.point([element[0], element[1]]));
      }
    });

    var featuress = turf.featureCollection(markers);
    var center = turf.center(featuress);

    var computedMiles = 0;
    for (var index = 0; index < markerCoOrdinates.length; index++) {
      for (var index1 = 0; index1 < markerCoOrdinates.length; index1++) {
        const calculatedMiles = turf.distance(markerCoOrdinates[index], markerCoOrdinates[index1], 'miles');
        if (calculatedMiles > computedMiles)
          computedMiles = calculatedMiles;
      }
    }
    if (markers.length == 1)
      this.zoomlevel = 18;
    else
      this.zoomlevel = this.GetZoomLevel(computedMiles);
    //end mile

    //this.map.setZoom(this.zoomlevel);
    if (markerCoOrdinates.length != 0) {
      this.centerPoint(markerCoOrdinates)
    } else {
      //this.flyMap(localStorage.getItem('siteLng'), localStorage.getItem('siteLat'));
    }

    // Center Point of Asset/AssetType first coordinates starting
    try {
      this.createMode = false;
      this.beforeEditMode = false;
      this.startEditMode = false;
      if (data.type == 'GeoFencestype' && data.prmarymenutype == 'location' && data.submenutype == '') {
        //let centervalue = this.centerPoint(markerCoOrdinates)
        //this.flyMap(datas[0], datas[1]);
        // this.flyMap(centervalue[0], centervalue[1]);
      }
      else if (data.type == 'GeoFences' && data.prmarymenutype == 'geofence' && data.submenutype == '') {
        this.draw.deleteAll();
        //let centervalue = this.centerPoint(markerCoOrdinates)
        //this.flyMap(datas[0], datas[1]);
        //this.flyMap(centervalue[0], centervalue[1]);
      }
      else {
        this.flyMap(data.sitlng, data.sitelat);
      }
    } catch (e) {
      console.log(e);
      this.flyMap(data.sitlng, data.sitelat);
    }
    //Center Point End
    //this.flyMap(data.coordinates.gometry.coordinates[0][0], data.coordinates.gometry.coordinates[1]);
    let features = data.coordinates;
    let k = 0;
    this.latest_feataure = features;

    this.selectgeoUniqueId = ""
    if (data.type == 'GeoFencestype') {
      features = features[0]
    }

    this.map.addLayer({
      'id': features.featureid,
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [features.gometry.coordinates]
          }
        }
      },
      'layout': {},
      'paint': {
        'fill-color': 'rgba(29, 61, 87, 0.12)',
        "fill-outline-color": 'rgba(29, 61, 87, 0.8)',
        'fill-opacity': 0.8
      }
    });

    // var feature = {
    //   'id': features.featureid,
    //   type: 'Feature',
    //   properties: {},
    //   geometry: {  type: 'Polygon',
    //   'coordinates': [features.gometry.coordinates]}
    // };
    // this.draw.add(feature);

    let thiskey = this;
    this.map.on('click', features.featureid, function (e) {
      thiskey.firstGeofenceCreate = false
      try {
        if (!thiskey.startEditMode && !thiskey.createMode) {
          thiskey.draw.changeMode('simple_select'); //Restrict Edit Geofence option in View Goefence Option
        }
        //Remove Black Layer After Geofence Click
        if (!thiskey.beforeEditMode && !thiskey.startEditMode) {
          if (thiskey.latest_feataure != undefined && thiskey.latest_feataure != null && JSON.stringify(thiskey.latest_feataure) != JSON.stringify({})) {
            if (thiskey.latest_feataure.length > 0) {
              for (var k = 0; k < thiskey.latest_feataure.length; k++) {
                if (thiskey.map.getLayer(thiskey.latest_feataure[k].featureid)) {
                  // Remove map layer & source.
                  thiskey.map.removeLayer(thiskey.latest_feataure[k].featureid);
                  thiskey.map.removeSource(thiskey.latest_feataure[k].featureid);

                }
              }
            }
            else {
              if (thiskey.map.getLayer(thiskey.latest_feataure.featureid)) {
                // Remove map layer & source.
                thiskey.map.removeLayer(thiskey.latest_feataure.featureid);
                thiskey.map.removeSource(thiskey.latest_feataure.featureid);
              }
            }
          }
        }
        data = { 'fill-color': "rgba(22, 155, 215, 0.12)", 'fill-outline-color': "#169bd7", 'fill-opacity': 0.8, 'fillColor': "#169bd7" }
        e.features[0].layer.paint = data;
        //Removed Unwanted Already Click
        if (e.features[0].layer.id == features.featureid) {
          if (thiskey.selectgeoUniqueId == features.ID) {
            //Check Already Clicked
            return;
          }

          thiskey.Selectedgeofencefeatures = features.gometry;
          thiskey.GetGeoFenceDetails(features.ID);
          thiskey.selectgeoUniqueId = features.ID;
          thiskey.selectedgeofenceid = features.featureid;
          //thiskey.singlegeofence = features
          //thiskey.newEditGeofence()
        }

        thiskey.Isselectedgeofence = true;
        thiskey.Isaddgeofence = false;
      } catch (e) {

        console.log('Geofence Click Function ' + e);
      }
    })

    var description = "<div style='min-width:200px'><div class='row'><div class='col-12'><a>" + features.SiteName + "/" + features.name + "</a></div></div></div>"
    // Hover to display popup on marker
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
      // anchor: 'bottom-left',
      // offset: [0, 0],
    });

    let thisakey = this;
    const geofencedesc = description;
    const geofencelonglat = features.gometry.coordinates[0];
    this.map.on('mouseenter', features.featureid, function (e) {
      popup.setLngLat(geofencelonglat)
        .setHTML(geofencedesc)
        .addTo(thisakey.map);
    });

    this.map.on('mouseleave', features.featureid, function (e) {
      popup.remove();
    });


    // End Hover to display popup on marker



    // for (let i = 0; i < data.length; i++) {
    //     var geofenceData = features;
    //     var impact: any = [];
    //     impact[k] = document.createElement('div');
    //     var circleRadius = 1;
    //     var linearOffset = Math.round(Math.sqrt(0.2 * Math.pow(circleRadius, 2)));
    //     var description = "<div style='min-width:200px'><div class='row'><div class='col-12'><a>" + geofenceData[i].SiteName +"/"+geofenceData[i].name + "</a></div></div></div>"
    // // Hover to display popup on marker
    //     var popup = new mapboxgl.Popup({
    //       closeButton: false,
    //       closeOnClick: false,
    //       anchor: 'bottom-left',
    //       offset: [-5, -25],
    //     });
    //
    //     let thisakey = this;
    //     const geofencedesc = description;
    //     const geofencelong = geofenceData.SiteLong;
    //     const geofencelat = geofenceData.SiteLat;
    //     impact[k].addEventListener('mouseenter', function () {
    //       popup.setLngLat([geofencelong, geofencelat])
    //         .setHTML(geofencedesc)
    //         .addTo(thisakey.map);
    //     });
    //
    //     impact[k].addEventListener('mouseleave', function () {
    //       popup.remove();
    //     });
    // // End Hover to display popup on marker
    //     k = k + 1;
    // }
    console.log(this.zoomlevel)
  }

  flyMap(longitude, latitude) {
    if (this.zoomlevel == 4) {
      longitude = this.default_longitude;
      latitude = this.default_latitude;
    }
    if (longitude != null && latitude != null && !isNaN(longitude) && !isNaN(latitude)) {
      this.map.flyTo({
        center: [longitude, latitude]
      });
    }
  }

  public selectedgeofenceid: any = '';
  public singlegeofence: any = [];
  public showmoreGeoFenceDetails: any = true;
  public selectedgeofence: any = '';

  public IsEditgeofence: any = false;

  DefalutAllSiteMarkar() {
    let k = 0;
    // var markersLayer =
    var markers = [];
    var markerCoOrdinates = [];
    var allSitesLat = '';
    var allSitesLong = '';
    for (let i = 0; i < this.usersites.length; i++) {
      if (this.usersites[i].Name != "All Sites") {
        if (this.usersites[i].TrackAssets == undefined || this.usersites[i].TrackAssets == 'N') {
          continue;
        }
        var impact: any = [];
        impact[k] = document.createElement('div');
        impact[k].innerHTML = this.pin;
        // impact[k].style.backgroundImage = 'url("/assets/icon/pin.png")';
        // impact[k].style.width = '47px';
        // impact[k].style.height = '64px';
        // impact[k].style.backgroundRepeat = 'no-repeat';
        // impact[k].className = 'marker';
        var circleRadius = 1;
        var linearOffset = Math.round(Math.sqrt(0.2 * Math.pow(circleRadius, 2)));
        var description = "<div style='min-width:80px;text-align:center'><a>" + this.usersites[i].Name + "</a></div>"
        this.popup[k] = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true
          // anchor: 'bottom-left',
          // offset: [-25, -25]
        })
          .setLngLat([this.usersites[i].SiteLong, this.usersites[i].SiteLat])
          .setHTML(description);

        //this.markar[k] = new mapboxgl.Marker(impact[k]).setLngLat([this.usersites[i].SiteLong, this.usersites[i].SiteLat]).setPopup(this.popup[k]).addTo(this.map);
        this.markar[k] = new mapboxgl.Marker(impact[k]).setLngLat([this.usersites[i].SiteLong, this.usersites[i].SiteLat]).addTo(this.map);
        markers.push(turf.point([this.usersites[i].SiteLong, this.usersites[i].SiteLat]));
        markerCoOrdinates.push([this.usersites[i].SiteLong, this.usersites[i].SiteLat]);

        // Hover to display popup on marker
        var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          // anchor: 'bottom-left',
          offset: [0, -25],
        });

        let thisakey = this;
        const desc = description;
        impact[k].addEventListener('mouseenter', function () {
          // thisakey.markar[k] = new mapboxgl.Marker(impact[k]).setLngLat([thisakey.usersites[i].SiteLong, thisakey.usersites[i].SiteLat]).setPopup(thisakey.popup[k]).addTo(thisakey.map);
          popup.setLngLat([thisakey.usersites[i].SiteLong, thisakey.usersites[i].SiteLat])
            .setHTML(desc)
            .addTo(thisakey.map);
        });

        impact[k].addEventListener('mouseleave', function () {
          // thisakey.markar[k].remove();
          popup.remove();
        });
        // End Hover to display popup on marker

        const mapg = this.usersites[i];
        // let thisakey = this;
        impact[k].addEventListener('click', function () {
          popup.remove();
          this.selectdropdownitem = mapg.Name;
          localStorage.setItem('selectitemId', mapg.SiteID);
          localStorage.setItem('siteLat', mapg.SiteLat);
          localStorage.setItem('siteLng', mapg.SiteLong);
          localStorage.setItem('sitename', mapg.Name);
          thisakey.assetprohelperService.ChangeDefaultSite(mapg);
        });
        k = k + 1;
      }
      else {
        allSitesLong = this.usersites[i].SiteLong;
        allSitesLat = this.usersites[i].SiteLat;
      }
    }
    var features = turf.featureCollection(markers);
    var center = turf.center(features);
    var computedMiles = 0;
    for (var index = 0; index < markerCoOrdinates.length; index++) {
      for (var index1 = 0; index1 < markerCoOrdinates.length; index1++) {
        const calculatedMiles = turf.distance(markerCoOrdinates[index], markerCoOrdinates[index1], 'miles');
        if (calculatedMiles > computedMiles)
          computedMiles = calculatedMiles;
      }
    }
    if (markers.length == 1)
      this.zoomlevel = 18;
    else
      this.zoomlevel = this.GetZoomLevel(computedMiles);
    //  this.zoomlevel = 4;
    // this.map.setZoom(this.zoomlevel);
    //this.flyMap(allSitesLong, allSitesLat);
    if (markerCoOrdinates.length != 0) {
      this.centerPoint(markerCoOrdinates)
    } else {

    }
  }

  GetZoomLevel(miles) {
    var computedZoomLevel = 4;
    if (miles > 6000)
      computedZoomLevel = 1;
    else if (miles > 2400)
      computedZoomLevel = 4;
    else if (miles > 1500)
      computedZoomLevel = 3;
    else if (miles > 900)
      computedZoomLevel = 3;
    else if (miles > 500)
      computedZoomLevel = 3;
    else if (miles > 250)
      computedZoomLevel = 4;
    else if (miles > 150)
      computedZoomLevel = 14;
    else if (miles > 100)
      computedZoomLevel = 12;
    else if (miles > 50)
      computedZoomLevel = 8;
    else if (miles > 25)
      computedZoomLevel = 8;
    else if (miles > 10)
      computedZoomLevel = 10;
    else if (miles < 0.27 && miles > 0.26)
      computedZoomLevel = 12;
    else if (miles < 0.02)
      computedZoomLevel = 20;
    else if (miles < 0.30)
      computedZoomLevel = 16;
    else if (miles < 0.40)
      computedZoomLevel = 16;
    else if (miles < 0.80)
      computedZoomLevel = 14;
    else if (miles < 0.90)
      computedZoomLevel = 12;
    else if (miles < 3)
      computedZoomLevel = 12;
    else if (miles < 5)
      computedZoomLevel = 9;
    else if (miles < 6)
      computedZoomLevel = 10;
    else if (miles < 10)
      computedZoomLevel = 8;
    else
      computedZoomLevel = 12;

    return computedZoomLevel;
  }
  GetZoomLevel2(miles) {
    var computedZoomLevel = 14;
    if (miles > 11) {
      computedZoomLevel = 10;
    }
    if (miles > 1 && miles < 3) {
      computedZoomLevel = 12;
    }
    if (miles > 4 && miles < 5) {
      computedZoomLevel = 10;
    }
    if (miles <= 0.15) {
      computedZoomLevel = 22;
    }
    if (miles <= 0.1) {
      computedZoomLevel = 18;
    }
    if (miles <= 1) {
      computedZoomLevel = 16;
    }
    if (miles <= 5) {
      computedZoomLevel = 12;
    }
    if (miles <= 10) {
      computedZoomLevel = 11;
    }
    return computedZoomLevel;
  }
  newEditGeofence() {
    try {
      this.spinner.show()

      this.beforeEditMode = true;
      this.editMode = true;
      //this.IsEditgeofence = true;
      // this.Isselectedgeofence = false;
      // this.Isaddgeofence = false;
      // this.Isdrawtoolactive = false;
      let responsedata = {
        'prmarymenutype': 'geofence',
        'submenutype': 'addgeofence',
        'maptype': 'markerwithgeofence',
        'historydetils': history,
        'IsshowDashboard': true
      }
      // this.assetprohelperService.ChangeMapActon(responsedata);
      //this.removegeofence();
      this.draw.deleteAll();
      // this.Isselectedgeofence = false;
      //  this.Isaddgeofence = true;
      // this.Isdrawtoolactive = false;
      //this.notes = this.singlegeofence.Notes;
      //this.geofencename = this.singlegeofence.Name;
      //this.selectdropdownitem = this.singlegeofence.SiteName;
      //this.selectedsiteId = this.singlegeofence.SiteUniqueID;
      //this.GetAssetsList(this.singlegeofence.SiteID);


      let dataa = this.editfence;
      //this.zoomlevel = 4;
      //this.map.setZoom(this.zoomlevel);
      let features = dataa.coordinates;
      this.latest_feataure = features;

      var computedCoOrdiantes = [];
      if (features.length >= 1) {
        computedCoOrdiantes = [this.singlegeofence.gometry.coordinates];
      }
      else {
        if (features.gometry == undefined) {
          computedCoOrdiantes = [features[0].gometry.coordinates];
        } else
          computedCoOrdiantes = [features.gometry.coordinates];
      }
      if (features.featureid == undefined) {
        features = features[0]
      }
      var feature = {
        'id': features.featureid,
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          'coordinates': computedCoOrdiantes
        }
      };
      this.draw.add(feature);
      this.spinner.hide()
    } catch (e) {
      this.spinner.hide()
      console.log(e);
    }
  }
  beforeEditMode: boolean = false;
  editMode: boolean = false;
  startEditMode: boolean = false;
  createMode: boolean = false;
  EditGeofence() {
    this.bubbles = [];
    this.selectAsset = [];
    this.IsEditgeofence = true;
    let responsedata = {
      'prmarymenutype': 'geofence',
      'submenutype': 'addgeofence',
      'maptype': 'markerwithgeofence',
      'historydetils': history,
      'IsshowDashboard': false
    }

    this.assetprohelperService.ChangeMapActon(responsedata);
    this.beforeEditMode = false;
    this.editMode = true;
    this.startEditMode = true;
    this.Isselectedgeofence = false;
    this.Isaddgeofence = true;
    this.Isdrawtoolactive = false;
    this.notes = this.singlegeofence.Notes;
    this.geofencename = this.singlegeofence.Name;
    this.selectdropdownitem = this.singlegeofence.SiteName;
    this.selectedsiteId = localStorage.getItem('siteUnique');
    //this.GetAssetsList(this.singlegeofence.SiteID);


    if (this.singlegeofence.Outside == 0) {
      this.selectalarmtype = 'OUT OF'
    }
    else {
      this.selectalarmtype = 'IN'
    }
    this.typecheck = this.singlegeofence.Type == 'Alarm' ? true : false;
    var assetstype: any = this.singlegeofence.AssetType;

    var totalAssets = 0;
    for (var i = 0; i < assetstype.length; i++) {
      for (var j = 0; j < assetstype[i].assets.length; j++) {
        if (assetstype[i].assets.length == 1)
          this.AssignAsset(assetstype[i].assetstype + '/' + assetstype[i].assets[j].name, 'asset', assetstype[i].assets[j], assetstype[i].assetstype);
        else {
          var computedAssetType = this.assets.filter(p => p.assetstype == assetstype[i].assetstype);
          if (computedAssetType[0].assets.length == assetstype[i].assets.length) {
            this.AssignAsset(assetstype[i].assetstype + '/' + 'All', 'assettype', assetstype[i], assetstype[i].assetstype);
            j = assetstype[i].assets.length
          }
          else {
            this.AssignAsset(assetstype[i].assetstype + '/' + assetstype[i].assets[j].name, 'asset', assetstype[i].assets[j], assetstype[i].assetstype);
          }
        }
      }
    }
    let dataa = this.editfence;
    //this.zoomlevel = 4;
    //this.map.setZoom(this.zoomlevel);
    let features = dataa.coordinates;
    this.latest_feataure = features;

    // this.map.addLayer({
    //   'id': features.featureid,
    //   'type': 'fill',
    //   'source': {
    //     'type': 'geojson',
    //     'data': {
    //       'type': 'Feature',
    //       'geometry': {
    //         'type': 'Polygon',
    //         'coordinates': [features.gometry.coordinates]
    //       }
    //     }
    //   },
    //   'layout': {},
    //   'paint': {
    //     'fill-color': 'rgba(29, 61, 87, 0.12)',
    //     "fill-outline-color": 'rgba(29, 61, 87, 0.8)',
    //     'fill-opacity': 0.8
    //   }
    // });

    var computedCoOrdiantes = [];
    if (features.length >= 1) {
      computedCoOrdiantes = [this.singlegeofence.gometry.coordinates];
    }
    else {
      if (features.gometry == undefined) {
        computedCoOrdiantes = [features[0].gometry.coordinates];
      } else
        computedCoOrdiantes = [features.gometry.coordinates];
    }
    if (features.featureid == undefined) {
      features = features[0]
    }
    var feature = {
      'id': features.featureid,
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        'coordinates': computedCoOrdiantes
      }
    };
    this.draw.add(feature);
    //this.flyMap(dataa.sitlng, dataa.sitelat);
  }


  GetGeoFenceDetails(geofenceid) {
    this.createMode = false
    this.editMode = false
    this.beforeEditMode = false;
    this.startEditMode = false;
    this.showmoreGeoFenceDetails = true;
    //this.showmoreGeoFenceDetails = geofenceid;
    let url = 'TrackingGeofence/GetGeoFenceDetails?Id=' + geofenceid;
    this.spinner.show();
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.singlegeofence = body.Data;
        this.spinner.hide();
        this.newEditGeofence()
      })

  }


  public Isselectedgeofence: any = false;

  public usersites: any = [];
  public selectdropdownitem: any = [];
  public disabled: any = false;
  public selectedsiteId: any = '';
  public bubbles: any = [];
  public selectAsset: any = [];
  public selectOperator: any = [];
  public selectAssettype: any = [];
  AssignAsset(value: string, type, typevalue, typename) {
    if (value != '') {
      for (var i = this.bubbles.length - 1; i >= 0; i--) {
        if ((this.bubbles[i].id == typevalue.UniqueID && typevalue.UniqueID != null) ||
          (((this.bubbles[i].typename == typevalue.AssetTypeName &&
            ((this.bubbles[i].id == typevalue.UniqueID) || this.bubbles[i].id == undefined))) ||
            (this.bubbles[i].typename == typevalue.assetstype)) && this.bubbles[i].value != value) {
          this.bubbles.splice(i, 1);
        }
      }
      var isExist = this.bubbles.filter(p => p.value == value);
      if (isExist.length == 0) {
        if (typevalue.UniqueID != undefined) {
          this.bubbles.push({ 'id': typevalue.UniqueID, 'value': value, 'type': type, 'typename': typename });
        } else {
          this.bubbles.push({ 'id': typevalue.assets[0].UniqueID, 'value': value, 'type': type, 'typename': typename });
        }
      }
    }

    if (type == 'asset') {
      var bubblesassettype = this.bubbles.filter(p => p.typename == typename);
      var assetsparent = this.assets.filter(p => p.assetstype == typename);

      if (assetsparent.length > 0 && bubblesassettype.length == assetsparent[0].assets.length) {

        for (var i = 0; i < this.bubbles.length; i++) {
          for (var j = 0; j < bubblesassettype.length; j++) {
            if (this.bubbles[i].id == bubblesassettype[j].id) {
              this.bubbles.splice(i, 1);
            }
          }
        }
        if (assetsparent[0].UniqueID == undefined) {
          this.bubbles.push({ 'id': assetsparent[0].assets[0].UniqueID, 'value': assetsparent[0].assetstype + '/' + 'All', 'type': 'assettype', 'typename': assetsparent[0].assetstype });
          this.selectAssettype.push(assetsparent[0].assets[0].UniqueID);
        } else {
          this.bubbles.push({ 'id': assetsparent[0].UniqueID, 'value': assetsparent[0].assetstype + '/' + 'All', 'type': 'assettype', 'typename': assetsparent[0].assetstype });
          this.selectAssettype.push(assetsparent[0].UniqueID);
        }

        for (var i = 0; i < this.selectAsset.length; i++) {
          for (var j = 0; j < assetsparent[0].assets.length; j++) {
            if (this.selectAsset[i] == assetsparent[0].assets[j].UniqueID) {
              this.selectAsset.splice(i, 1);
            }
          }
        }

        for (var i = 0; i < assetsparent[0].assets.length; i++) {
          this.selectAsset.push(assetsparent[0].assets[i].UniqueID);
        }
      }
      else {

        this.selectAsset = [];

        for (let k = 0; k < this.bubbles.length; k++) {
          if (this.bubbles[k].value.indexOf('/All') != -1) {
            var tempAsset = this.assets.filter(p => p.assetstype == this.bubbles[k].typename);
            for (var i = 0; i < tempAsset[0].assets.length; i++) {
              this.selectAsset.push(tempAsset[0].assets[i].UniqueID);
            }
          } else {
            this.selectAsset.push(this.bubbles[k]["id"]);
          }
        }
        // for (var i = 0; i < this.selectAsset.length; i++) {
        //   if (this.selectAsset[i] == typevalue.UniqueID) {
        //     this.selectAsset.splice(i, 1);
        //   }
        // }
        // for (var x = 0; x < this.selectAsset.length; x++) {
        //   for (var y = 0; y < assetsparent[0].assets.length; y++) {
        //     if (this.selectAsset[x] == assetsparent[0].assets[y].UniqueID) {
        //       this.selectAsset.splice(y, 1);
        //     }
        //   }
        // }
        // for (var i = 0; i < this.selectAsset.length; i++) {
        //   if(assetsparent!=undefined && assetsparent!=null && assetsparent.length>0)
        //   for (var j = 0; j < assetsparent[0].assets.length; j++) {
        //     if (this.selectAsset[i] == assetsparent[0].assets[j].UniqueID && typevalue.assets==this.selectAsset[i]) {
        //       this.selectAsset.splice(i, 1);
        //     }
        //   }
        // }
        //  this.selectAsset.push(typevalue.UniqueID);
        //var temp=[]

        // this.selectAsset.forEach(a=>{temp.push(a);});
        // for(let k=0;k<temp.length;k++){
        //   let check=true;
        //   for(let s=0;s<this.bubbles.length;s++){
        //     if(this.bubbles[s]["id"]==temp[k]){
        //       check=false;
        //     }
        //   }
        //   if(check)
        //   this.selectAsset.splice(k, 1);
        // }


        // for(let k=0;k<this.selectAsset.length;k++){
        // var bubblesassettype = this.bubbles.filter(p => p["id"] == this.selectAsset[k] && p.value.indexOf('/All')==-1);
        // if(bubblesassettype.length==0 && bubblesassettype['id']==undefined){
        //   this.selectAsset.splice(k, 1);
        // }
        // }
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

        for (var i = 0; i < this.selectAsset.length; i++) {
          for (var j = 0; j < assetsparent[0].assets.length; j++) {
            if (this.selectAsset[i] == assetsparent[0].assets[j].UniqueID) {
              this.selectAsset.splice(i, 1);
            }
          }
        }

        this.bubbles.push({ 'id': typevalue.UniqueID, 'value': value, 'type': type, 'typename': typename });
        this.selectAssettype.push(assetsparent[0].UniqueID);
        for (var assetindex = 0; assetindex < assetsparent[0].assets.length; assetindex++)
          this.selectAsset.push(assetsparent[0].assets[assetindex].UniqueID);
      }
      else {
        for (var i = 0; i < this.selectAssettype.length; i++) {
          if (this.selectAssettype[i] == typevalue.UniqueID) {
            this.selectAssettype.splice(i, 1);
          }
        }
        for (var x = 0; x < this.selectAsset.length; x++) {
          for (var y = 0; y < assetsparent[0].assets.length; y++) {
            if (this.selectAsset[x] == assetsparent[0].assets[y].UniqueID) {
              this.selectAsset.splice(x, 1);
            }
          }
        }
        for (var assetindex = 0; assetindex < assetsparent[0].assets.length; assetindex++)
          this.selectAsset.push(assetsparent[0].assets[assetindex].UniqueID);
      }
    }
  }



  RemoveFilterItem(value) {
    var index = this.bubbles.indexOf(value);
    if (index > -1) {
      this.bubbles.splice(index, 1);
    }
    for (var i = 0; i < this.selectAsset.length; i++) {
      if (this.selectAsset[i] == value.id) {
        this.selectAsset.splice(i, 1);
      }
      else if (value.id == undefined || value.id == null || value.value.indexOf('All') > -1) {
        var assetsparent = this.assets.filter(p => p.assetstype == value.typename);
        for (var j = 0; j < assetsparent[0].assets.length; j++) {
          for (var k = 0; k < this.selectAsset.length; k++) {
            if (this.selectAsset[k] == assetsparent[0].assets[j].UniqueID) {
              this.selectAsset.splice(k, 1);
              k = this.selectAsset.length;
            }
          }
        }
      }
    }
  }
  SelectSite(site) {
    this.selectdropdownitem = site.Name;
    localStorage.setItem('selectitemId', site.SiteID);
    localStorage.setItem('siteLat', site.SiteLat);
    localStorage.setItem('siteLng', site.SiteLong);
    localStorage.setItem('sitename', site.Name);
    this.assetprohelperService.ChangeDefaultSite(site);
  }

  SelectSiteMenu(site) {
    this.clearAllasset();
    if (site.Name != "All Sites") {
      this.selectdropdownitem = site.Name;
      this.selectedsiteId = site.UniqueID;
      this.GetAssetsList(site.SiteID);
      //this.SelectSite(site); // Unwanted Function On Create Geofence Site Selection

      if (this.draw.getAll().features.length == 0)
        this.flyMap(site.SiteLong, site.SiteLat);
    }
    else {
      this.toastr.error("we can't save in all site for this geofence", 'Error!');
    }

  }

  public geofencename: any = '';
  public typecheck: any = false;



  getuserSites() {

    let url = 'Account/UserSites';
    this.spinner.show();
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        this.spinner.hide();
        let body: any = JSON.parse(data['_body']);
        this.usersites = body.Data;
        if (this.selectdropdownitem != 'All sites') {
          for (var i = 0; i < this.usersites.length; i++) {
            if (this.usersites[i].SiteID == localStorage.getItem('selectitemId')) {
              this.selectdropdownitem = this.usersites[i].Name;
              this.GetAssetsList(this.usersites[i].SiteID);
              this.selectedsiteId = this.usersites[i].UniqueID
            }
          }
        }

        if (this.usersites.length == 0) {
          this.disabled = true;
        }
      })
  }

  getInitialSites(parentData) {
    let url = 'Account/UserSites';
    this.spinner.show();
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        this.spinner.hide()
        let body: any = JSON.parse(data['_body']);
        this.usersites = body.Data;
        if (this.selectdropdownitem != 'All sites') {
          for (var i = 0; i < this.usersites.length; i++) {
            if (this.usersites[i].SiteID == localStorage.getItem('selectitemId')) {
              this.selectdropdownitem = this.usersites[i].Name;
              this.GetAssetsList(this.usersites[i].SiteID);
              this.selectedsiteId = this.usersites[i].UniqueID
            }
          }
        }
        if (this.usersites.length == 0) {
          this.disabled = true;
        }
        if (localStorage.getItem('sitename') == null || localStorage.getItem('sitename') == 'All Sites') {
          this.RemoveALLMapItem();
          this.DefalutAllSiteMarkar();
        }
        else {
          if (parentData.submenutype == 'asset') {
            this.DrawLocationAssets(parentData);
          }
          else {
            this.DrawLocationOperators(parentData);
          }
        }
      })
  }
  public zoomlevel: any = 3;
  public activenavigationcontrol: any = '';
  public draw: any;
  public Selectedgeofencefeatures: any;
  public selectgeoUniqueId: any = "";

  public pids: any = '';



  public Isdrawtoolactive: any = false;
  DrawToolAction() {
    if (!this.Isdrawtoolactive) {
      this.draw.changeMode('draw_polygon');
    }
    else {
      this.draw.changeMode('simple_select');
      this.draw.delete(this.pids)
    }
    this.Isdrawtoolactive = !this.Isdrawtoolactive;
  }

  updateArea(e) {
    var data = this.draw.getAll();
    var answer = document.getElementById('calculated-area');
    if (data.features.length > 0) {
      var area = turf.area(data);
      // restrict to area to 2 decimal points
      var rounded_area = Math.round(area * 100) / 100;
      answer.innerHTML = '<p><strong>' + rounded_area + '</strong></p><p>square meters</p>';
    } else {
      answer.innerHTML = '';
      if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
    }
  }

  ZoomIn() {
    this.zoomlevel = this.map.getZoom()
    this.activenavigationcontrol = 'zoomin'
    this.zoomlevel = this.zoomlevel + 1;
    this.map.setZoom(this.zoomlevel);
    if (this.zoomlevel == 10) {
      this.activenavigationcontrol = ''
    }
  }

  ZoomOut() {
    this.zoomlevel = this.map.getZoom()
    if (this.zoomlevel > 1) {
      this.activenavigationcontrol = 'zoomout'
      this.zoomlevel = this.zoomlevel - 1;
      this.map.setZoom(this.zoomlevel);
    }
    if (this.zoomlevel == 10) {
      this.activenavigationcontrol = ''
    }
  }


  public satellitetype: any = false;
  public mapsatellite = 'mapbox://styles/mapbox/streets-v9';
  public
  setSatelliteView() {
    if (!this.satellitetype) {

      this.satellitetype = true;
      this.map.setStyle('mapbox://styles/mapbox/satellite-v9');

    }
    else {
      this.satellitetype = false;
      this.map.setStyle('mapbox://styles/mapbox/streets-v9');
    }
    if (localStorage.getItem('trackingtype') == 'history') {
      if (this.openTimeline || this.isChangeDateClicked) {
        if (this.historyCoornidates != undefined)
          setTimeout(() => {
            this.drawHistoryPath()
          }, 800);
      }
      //  alert(JSON.stringify({'timeline':this.openTimeline,'dateClicket':this.isChangeDateClicked,'historypath':this.historyCoornidates}));
    }
    if (localStorage.getItem('trackingtype') != 'geofenhistoryce' && localStorage.getItem('sitename') != 'All Sites') {
      if (this.firstGeofenceCreate && this.editgeofenceData != '') {
        setTimeout(() => {
          this.recreateGeofence();
        }, 800);
      }
      //  alert(JSON.stringify({mode:this.firstGeofenceCreate,data:this.editgeofenceData}));
    }
  }
  drawHistoryPath() {
    this.map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": this.historyCoornidates
          }
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#169bd7",
        "line-width": 5
      }
    });
  }

  public Isfullscreen: boolean = false

  FullScreen() {
    this.Isfullscreen = !this.Isfullscreen
    this.assetprohelperService.ChanageScreen(this.Isfullscreen);
  }

  DrawLocationAssets(data) {
    if (localStorage.getItem('trackingtype') == 'geofence' || localStorage.getItem('trackingtype') == 'history') {
      return
    }

    this.spinner.show();
    try {
      var markers = [];
      var markerCoOrdinates = [];
      var markerCoOrdinates2 = [];
      data.coordinates.forEach(element => {
        if (element.lat != null && element.lon != null) {
          markerCoOrdinates.push([element.lat, element.lon]);
          markerCoOrdinates2.push([element.lon, element.lat]);
          markers.push(turf.point([element.lon, element.lat]));
        }
      });
      var features = turf.featureCollection(markers);
      var center = turf.center(features);

      var computedMiles = 0;
      for (var index = 0; index < markerCoOrdinates.length; index++) {
        for (var index1 = 0; index1 < markerCoOrdinates.length; index1++) {
          const calculatedMiles = turf.distance(markerCoOrdinates[index], markerCoOrdinates[index1], 'miles');
          if (calculatedMiles > computedMiles)
            computedMiles = calculatedMiles;
        }
      }
      if (markers.length == 1)
        this.zoomlevel = 18;
      else
        this.zoomlevel = this.GetZoomLevel(computedMiles);
      // this.zoomlevel = 13;
      //this.map.setZoom(this.zoomlevel);
      this.RemoveALLMapItem();
      let k = 0;
      let currentasset = data.coordinates;
      if (markerCoOrdinates2.length != 0) {
        this.centerPoint(markerCoOrdinates2)
      } else {
        //this.flyMap(localStorage.getItem('siteLng'), localStorage.getItem('siteLat'));
      }

      for (var l = 0; l < this.markar.length; l++) {
        this.markar[l].remove();
      }
      for (var m = 0; m < currentasset.length; m++) {
        let Alarms: any = '';
        let Status: any = '';
        let Mode: any = '';
        if (currentasset[m].ImpactAlarm == "Y") {
          Alarms = 'Impact' + ', '
        }
        if (currentasset[m].CheckListAlarm == "Y") {
          Alarms = Alarms + 'Checklist' + ', '
        }
        if (currentasset[m].AssetFault == "Y") {
          Alarms = Alarms + 'Asset Fault' + ', '
        }
        if (currentasset[m].LowFuel == "Y") {
          Alarms = Alarms + 'Low Fuel' + ', '
        }
        if (currentasset[m].PMDueAlarm == "Y") {
          Alarms = Alarms + 'PM Due' + ', '
        }
        if (Alarms != '') {
          Alarms = Alarms.substring(0, Alarms.length - 2);
        }
        if(Alarms==''){
          Alarms='N/A'
        }
        if (currentasset[m].LogOn == "Y") {
          Status = 'Logged in'
        }
        else {
          Status = 'Logged off'
        }
        if (currentasset[m].BypassCode == "Y") {
          Mode = 'ByPass'
        }
        else if (currentasset[m].MaintainanceLockout == "Y") {
          Mode = Mode + 'Maintenance'
        }
        else if (currentasset[m].BypassCode != "Y" && currentasset[m].MaintainanceLockout != "Y") {
          Mode = 'Normal'
        }
        if (currentasset[m].lon !== null && currentasset[m].lat !== null) {
          var impact: any = [];
          impact[k] = document.createElement('div');
          if(currentasset[m].LastSeenState!=2 && currentasset[m].LastSeenState!="2"){
            impact[k].innerHTML = this.purplePin;
          }
          else if (currentasset[m].ImpactAlarm == "Y" || currentasset[m].CheckListAlarm == "Y"
            || currentasset[m].PMDueAlarm == "Y" || currentasset[m].LowFuel == "Y" || currentasset[m].AssetFault == "Y") {
            impact[k].innerHTML = this.redPin;
            //impact[k].style.backgroundImage = 'url("/assets/icon/red-pin.png")';
          }
          else {
            impact[k].innerHTML = this.pin;
            //impact[k].style.backgroundImage = 'url("/assets/icon/pin.png")';
          }

          // impact[k].style.width = '47px';
          // impact[k].style.height = '64px';
          // impact[k].style.backgroundRepeat = 'no-repeat';
          let OperatorName = currentasset[m].OperatorName
          if (OperatorName == null || OperatorName == undefined || OperatorName == '') {
            OperatorName = 'N/A'
          }
          var description = "<div style='width:300px'><div class='row'><div class='col-5'><strong>Asset Type</Strong></div><div class='col-7'>" + currentasset[m].AssetTypeName + "</div></div><div class='row'><div class='col-5'><strong>Asset name</Strong></div><div class='col-7'>" + currentasset[m].name + "</div></div><div class='row'><div class='col-5'><strong>Alarms</strong></div> <div class='col-7'>" + Alarms + "</div></div><div class='row'><div class='col-5'><strong>Event Timestamp</strong></div><div class='col-7'>" + currentasset[m].EventDate + "</div></div><div class='row'><div class='col-5'><strong>Operator</strong></div><div class='col-7'>" + OperatorName + "</div></div><div class='row'><div class='col-5'><strong>Mode</strong></div><div class='col-7'><span>" + Mode + "</span></div></div><div class='row'><div class='col-5'><strong>Status</strong></div><div class='col-7'><span>" + Status + "<span></div></div></div>"
          this.popup[k] = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            // anchor: 'bottom-left',
            offset: [0, -25]
          })
            .setHTML(description);
          this.markar[k] = new mapboxgl.Marker(impact[k]).setLngLat([currentasset[m].lon, currentasset[m].lat]).setPopup(this.popup[k]).addTo(this.map);
          // this.markar[k] = new mapboxgl.Marker(impact[k]).setLngLat([currentasset[m].lon, currentasset[m].lat]).addTo(this.map);

          // Hover to display popup on marker
          // var popup = new mapboxgl.Popup({
          //   closeButton: false,
          //   closeOnClick: false,
          //   offset: [0, -25],
          // });
          //
          // let thisakey = this;
          // const assetdesc = description;
          // const assetlong = currentasset[m].lon;
          // const assetlat = currentasset[m].lat;
          // impact[k].addEventListener('mouseenter', function () {
          //   popup.setLngLat([assetlong, assetlat])
          //     .setHTML(assetdesc)
          //     .addTo(thisakey.map);
          // });
          //
          // impact[k].addEventListener('mouseleave', function () {
          //   popup.remove();
          // });
          // End Hover to display popup on marker

          k = k + 1;
        }

      }

      if (currentasset.length == 1) {
        //this.map.setZoom(this.zoomlevel);
        //this.flyMap(currentasset[0].lon, currentasset[0].lat);
      }
      else {
        //this.flyMap(center.geometry.coordinates[0], center.geometry.coordinates[1]);
        if (currentasset.length != 0) {
          if (markerCoOrdinates.length != 0) {
            // this.map.setZoom(this.zoomlevel);
            // this.map.flyTo({
            //   center: [currentasset[0].lon, currentasset[0].lat]
            // });
          } else {
            // this.flyMap(localStorage.getItem('siteLng'), localStorage.getItem('siteLat'));
            //this.toastr.warning("No data in the selected site", "Warning")
          }
        } else {
          //this.toastr.warning("No data in the selected site", "Warning")
        }
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      console.log(e)
    }
  }

  DrawLocationOperators(data) {
    if (localStorage.getItem('trackingtype') == 'geofence' || localStorage.getItem('trackingtype') == 'history') {
      return
    }
    this.RemoveALLMapItem();
    var markers = [];
    var markerCoOrdinates = [];
    var markerCoOrdinates2 = []
    data.coordinates.forEach(element => {
      if (element.lat != null && element.lon != null) {
        markerCoOrdinates.push([element.lat, element.lon]);
        markerCoOrdinates2.push([element.lon, element.lat]);
        markers.push(turf.point([element.lon, element.lat]));
      }
    });
    var features = turf.featureCollection(markers);
    var center = turf.center(features);

    var computedMiles = 0;
    for (var index = 0; index < markerCoOrdinates.length; index++) {
      for (var index1 = 0; index1 < markerCoOrdinates.length; index1++) {
        const calculatedMiles = turf.distance(markerCoOrdinates[index], markerCoOrdinates[index1], 'miles');
        if (calculatedMiles > computedMiles)
          computedMiles = calculatedMiles;
      }
    }
    if (markers.length == 1)
      this.zoomlevel = 18;
    else
      this.zoomlevel = this.GetZoomLevel(computedMiles)
    //this.map.setZoom(this.zoomlevel);
    //this.zoomlevel = 13;

    if (markerCoOrdinates2.length != 0) {
      this.centerPoint(markerCoOrdinates2)
    } else {
      //this.flyMap(localStorage.getItem('siteLng'), localStorage.getItem('siteLat'));
    }

    let currentasset = data.coordinates;
    let k = 0;

    for (var m = 0; m < currentasset.length; m++) {
      let Alarms: any = '';
      let Status: any = '';
      let Mode: any = '';
      if (currentasset[m].ImpactAlarm == "Y") {
        Alarms = 'Impact' + ', '
      }
      if (currentasset[m].CheckListAlarm == "Y") {
        Alarms = Alarms + 'Checklist' + ', '
      }
      if (currentasset[m].AssetFault == "Y") {
        Alarms = Alarms + 'Asset Fault' + ', '
      }
      if (currentasset[m].LowFuel == "Y") {
        Alarms = Alarms + 'Low Fuel' + ', '
      }
      if (currentasset[m].PMDueAlarm == "Y") {
        Alarms = Alarms + 'PM Due' + ', '
      }
      if (Alarms != '') {
        Alarms = Alarms.substring(0, Alarms.length - 2);
      }
      if(Alarms==''){
        Alarms='N/A'
      }
      if (currentasset[m].LogOn == "Y") {
        Status = 'Logged in'
      }
      else {
        Status = 'Logged off'
      }
      if (currentasset[m].BypassCode == "Y") {
        Mode = 'ByPass'
      }
      else if (currentasset[m].MaintainanceLockout == "Y") {
        Mode = Mode + 'Maintainance'
      }
      else if (currentasset[m].BypassCode != "Y" && currentasset[m].MaintainanceLockout != "Y") {
        Mode = 'Normal'
      }

      if (currentasset[m].lon !== null && currentasset[m].lat !== null) {
        let OperatorName = currentasset[m].OperatorName
        if (OperatorName == null || OperatorName == undefined || OperatorName == '') {
          OperatorName = 'N/A'
        }
        var description = "<div style='width:300px'><div class='row'><div class='col-5'><strong>Asset name</Strong></div><div class='col-7'>" + currentasset[m].AssetName + "</div></div><div class='row'><div class='col-5'><strong>Alarms</strong></div><div class='col-7'>" + Alarms + "</div></div><div class='row'><div class='col-5'><strong>Event Timestamp</strong></div><div class='col-7'>" + currentasset[m].EventDate + "</div></div><div class='row'><div class='col-5'><strong>Operator</strong></div><div class='col-7'>" + OperatorName + "</div></div><div class='row'><div class='col-5'><strong>Mode</strong></div><div class='col-7'><span>" + Mode + "</span></div></div><div class='row'><div class='col-5'><strong>Status</strong></div><div class='col-7'><span>" + Status + "<span></div></div></div>"
        this.popup[k] = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true
        })
          .setHTML(description);

        var impact: any = [];
        impact[k] = document.createElement('div');
        if(currentasset[m].LastSeenState!=2 && currentasset[m].LastSeenState!="2"){
          impact[k].innerHTML = this.purplePin;
        }
        else if (currentasset[m].ImpactAlarm == "Y" || currentasset[m].CheckListAlarm == "Y"
          || currentasset[m].PMDueAlarm == "Y" || currentasset[m].LowFuel == "Y" || currentasset[m].AssetFault == "Y") {
          impact[k].innerHTML = this.redPin;
          //impact[k].style.backgroundImage = 'url("/assets/icon/red-pin.png")';
        }
        else {
          impact[k].innerHTML = this.pin;
          //impact[k].style.backgroundImage = 'url("/assets/icon/pin.png")';
        }
        // impact[k].style.width = '47px';
        // impact[k].style.height = '64px';
        // impact[k].style.backgroundRepeat = 'no-repeat';

        if (currentasset[m].lon == undefined && currentasset[m].lat == undefined) {
          this.markar[k] = new mapboxgl.Marker(impact[k]).setLngLat([currentasset[m].SiteLong, currentasset[m].SiteLat]).setPopup(this.popup[k]).addTo(this.map);
        } else {
          this.markar[k] = new mapboxgl.Marker(impact[k]).setLngLat([currentasset[m].lon, currentasset[m].lat]).setPopup(this.popup[k]).addTo(this.map);
        }

        // // Hover to display popup on marker
        // var popup = new mapboxgl.Popup({
        //   closeButton: false,
        //   closeOnClick: false
        // });

        // let thisakey = this;
        // const operatordesc = description;
        // const operatorlong = currentasset[m].lon;
        // const operatorlat = currentasset[m].lat;
        // impact[k].addEventListener('mouseenter', function () {
        //   popup.setLngLat([operatorlong, operatorlat])
        //     .setHTML(operatordesc)
        //     .addTo(thisakey.map);
        // });

        // impact[k].addEventListener('mouseleave', function () {
        //   popup.remove();
        // });
        // // End Hover to display popup on marker

        // k = k + 1;
      }
      k = k + 1;
    }
    if (currentasset.length == 1) {
      if (currentasset[0].lon != null && currentasset[0].lat != null) {
        // this.map.setZoom(this.zoomlevel);
        /// this.flyMap(currentasset[0].lon, currentasset[0].lat);
      }
      else if (currentasset[0].SiteLong != null && currentasset[0].SiteLat != null) {
        //this.flyMap(center.geometry.coordinates[0], center.geometry.coordinates[1]);
        //this.map.setZoom(this.zoomlevel);
        //this.flyMap(currentasset[0].SiteLong, currentasset[0].SiteLat);

      }
      else {
      //  this.toastr.error("No proper coordinates", 'Error!');
      }
    }
    else {
      if (markerCoOrdinates.length != 0 && currentasset.length != 0) {
        // this.map.setZoom(this.zoomlevel);
        // this.map.flyTo({
        //   center: [currentasset[0].lon, currentasset[0].lat]
        // });

      } else {
        //this.toastr.warning("No data in the selected site", "Warning")
        // this.flyMap(localStorage.getItem('siteLng'), localStorage.getItem('siteLat'));
      }
    }
  }


  public historydatadetilas: any = [];
  public historystartdate: any;
  public historyenddate: any;
  public uniqueOperatorNames: any = '';

  public currenthistorydetails: any = {};

  public slectedhistorydetails: any = {};


  SelectHistoryAssetType(data, type) {
    if (type) {
      if (data.selectionType != 'Y')
        this.currenthistorydetails = data.responsevalue;
      this.slectedhistorydetails = data.responsevalue[0];
      this.timelineselected = this.slectedhistorydetails.AssetName;
      this.DrawHistoryAssets(data);
    }

  }



  DrawHistoryAssets(data) {
    this.historydatadetilas = data.responsevalue[0];
    if (data.startdate instanceof NgbDate) {
      this.historystartdate = new Date(data.startdate.year, (data.startdate.month - 1), data.startdate.day, this.historyStartTime.getHours(), this.historyStartTime.getMinutes(), this.historyStartTime.getUTCSeconds());
    }
    else {
      this.historystartdate = data.startdate;
    }
    if (data.enddate instanceof NgbDate) {
      this.historyenddate = new Date(data.enddate.year, (data.enddate.month - 1), data.enddate.day, this.historyEndTime.getHours(), this.historyEndTime.getMinutes(), this.historyEndTime.getUTCSeconds());
    }
    else {
      this.historyenddate = data.enddate;
    }

    //this.CurrentassetHistory = new Array(135);
    this.RemoveALLMapItem();
    for (var l = 0; l < this.markar.length; l++) {
      this.markar[l].remove();
    }

    var lastOperatorID = 0;
    let operatorName = ''
    for (var historyDetailsIndex = 0; historyDetailsIndex < data.historydetils.length; historyDetailsIndex++) {
      var currentItem = data.historydetils[historyDetailsIndex];
      if (currentItem.OperatorID != null && historyDetailsIndex != 0 && currentItem.OperatorID != lastOperatorID) {
        data.historydetils[historyDetailsIndex - 1].IsOperatorChanged = true;
        data.historydetils[historyDetailsIndex - 1].operatorName = operatorName
      }
      if (currentItem.OperatorID != null) {
        lastOperatorID = currentItem.OperatorID;
      }
      if (currentItem.OperatorName != null) {
        operatorName = currentItem.OperatorName;
      }
    }
    if (data.historydetils != null && data.historydetils != undefined && data.historydetils.length > 0) {
      if (data.historydetils[0].ColorCode == 'accident') {
        this.historydatadetilas.isimpact = true;
      } else {
        this.historydatadetilas.isimpact = false;
      }
    }
    if(data.historydetils.length>0){
      let temp=data.historydetils[data.historydetils.length-1];
      var v1=new Date(this.EndDate)
      var v2=new Date(temp.DATE)
      if(v1.getTime()!=v2.getTime()){
        data.historydetils.push({space:true});
      }
    }
    this.CurrentassetHistory = data.historydetils;
    this.timeData = undefined
    this.existIndex = null
    if (this.historydatadetilas.isdetect == 0) {
      this.historydatadetilas.dectectName = 'None'
    }
    else if (this.historydatadetilas.isdetect == 1) {
      this.historydatadetilas.dectectName = 'Impact'
    }
    else if (this.historydatadetilas.isdetect == 2) {
      this.historydatadetilas.dectectName = 'Overweight'
    }
    else if (this.historydatadetilas.isdetect == 3) {
      this.historydatadetilas.dectectName = 'Speed'
    }
    // for (var i = 0; i < data.historydetils.length; i++) {
    //   this.CurrentassetHistory[i] = data.historydetils[i];
    //   var datewithouttimezone = new Date(this.CurrentassetHistory[i].Date.getUTCFullYear(), this.CurrentassetHistory[i].Date.getUTCMonth(), this.CurrentassetHistory[i].Date.getUTCDate(), this.CurrentassetHistory[i].Date.getUTCHours(), this.CurrentassetHistory[i].Date.getUTCMinutes(), this.CurrentassetHistory[i].Date.getUTCSeconds());
    //   this.CurrentassetHistory[i].Date = '';
    //   this.CurrentassetHistory[i].Date = datewithouttimezone;
    // }

    this.DrawHistorystartimpactendpoints(data.historydetils);
    this.DrawHistoryMarkarPin(data.historydetils[data.historydetils.length - 1],false);
    let thiskey = this;
    this.openTimeline = true
    this.historyCoornidates = data.coordinates
    thiskey.map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": data.coordinates
          }
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#169bd7",
        "line-width": 5
      }
    });

  }


  public assetpin: any = null;
  public historystartpositionicon: any = null;
  public historyendpositionicon: any = null;
  public historyimpactpositionicon: any = [];
  public notes: any;
  isCollapsed = false;
  DrawHistoryMarkarPin(asset,statusType) {
    this.timeData = asset
    this.showPopup=statusType;
    this.isCollapsed = !this.isCollapsed;
    if (this.assetpin != null) {
      this.assetpin.remove()
    }
    var el = document.createElement('div');
    el.innerHTML = this.pin;
    // el.style.backgroundImage = 'url("/assets/icon/pin.png")';
    // el.style.width = '47px';
    // el.style.height = '64px';
    // el.style.backgroundRepeat = 'no-repeat';
    try{
    if (asset && asset.lon!=undefined) {
      this.assetpin = new mapboxgl.Marker(el).setLngLat([asset.lon, asset.lat]).addTo(this.map)
    }
    if(this.timeData==undefined){
      this.timeData={}
    }
    this.timeData.modeName = 'Normal Mode'
    if (asset && asset.AssetCurrentMode!=undefined && asset.AssetCurrentMode == 1 || asset.AssetCurrentMode == '1') {
      this.timeData.modeName = 'ByPass'
    }
    else if (asset && asset.AssetCurrentMode!=undefined && asset.AssetCurrentMode == 1 || asset.AssetCurrentMode == '1') {
      this.timeData.modeName = 'Maintenance Mode'
    }
  }catch(e){
    console.log(e);
  }
  }
  playEnable=false;
  intervel
  playAndPause()
  {
    clearInterval(this.intervel);
    this.playEnable=!this.playEnable
    var length=this.CurrentassetHistory.length
    var count=0;
      let parnt=this;
     this.intervel= window.setInterval(function () {
     if(parnt.playEnable && count<length){
      parnt.DrawHistoryMarkarPin(parnt.CurrentassetHistory[count],true);
      count=count+1;
     }
      }, 800);
  }

  DrawHistorystartimpactendpoints(data) {

    let markerCoOrdinates = []
    let markers = []
    try {
      data.forEach(element => {
        if (element.lon != null && element.lat != null) {
          markerCoOrdinates.push([element.lon, element.lat]);
          markers.push(turf.point([element.lon, element.lat]));
        }
      });

      var featuress = turf.featureCollection(markers);
      var center = turf.center(featuress);

      var computedMiles = 0;
      for (var index = 0; index < markerCoOrdinates.length; index++) {
        for (var index1 = 0; index1 < markerCoOrdinates.length; index1++) {
          const calculatedMiles = turf.distance(markerCoOrdinates[index], markerCoOrdinates[index1], 'miles');
          if (calculatedMiles > computedMiles)
            computedMiles = calculatedMiles;
        }
      }
      // if (markers.length == 1)
      //   this.zoomlevel = 18;
      // else
      //   this.zoomlevel = this.GetZoomLevel(computedMiles);

    } catch (e) {
      console.log(e);
    }
    this.zoomlevel = this.GetZoomLevel2(computedMiles);

    //  this.map.setZoom(this.zoomlevel);

    if (markerCoOrdinates.length != 0) {
      this.centerPoint(markerCoOrdinates)
    } else {
      //this.flyMap(localStorage.getItem('siteLng'), localStorage.getItem('siteLat'));
    }

    this.RemoveALLMapItem();
    let k = 0;
    var start = document.createElement('div');
    start.style.backgroundImage = 'url("/assets/icon/position.png")';
    start.style.width = '24px';
    start.style.height = '24px';
    start.style.backgroundRepeat = 'no-repeat';

    var end = document.createElement('div');
    end.style.backgroundImage = 'url("/assets/icon/position.png")';
    end.style.width = '24px';
    end.style.height = '24px';
    end.style.backgroundRepeat = 'no-repeat';

    for (var i = 0; i < data.length; i++) {
      if (data[i].ColorCode == 'accident') {
        var impact: any = [];
        impact[k] = document.createElement('div');
        impact[k].style.backgroundImage = 'url("/assets/icon/impact.png")';
        impact[k].style.width = '24px';
        impact[k].style.height = '24px';
        impact[k].style.backgroundRepeat = 'no-repeat';
        this.historyimpactpositionicon[k] = new mapboxgl.Marker(impact[k]).setLngLat([data[i].lon, data[i].lat]).addTo(this.map)
        k = k + 1;
      }
      if (i == 0) {
        this.historystartpositionicon = new mapboxgl.Marker(start).setLngLat([data[i].lon, data[i].lat]).addTo(this.map)
      }

      var lastposition = data.length - 1;
      if(data[lastposition].lon!=undefined)
      this.historyendpositionicon = new mapboxgl.Marker(end).setLngLat([data[lastposition].lon, data[lastposition].lat]).addTo(this.map)

    }
    //this.flyMap(data[0].lon, data[0].lat);

  }




  removegeofence() {
    if (this.latest_feataure != undefined && this.latest_feataure != null && JSON.stringify(this.latest_feataure) != JSON.stringify({})) {
      if (this.latest_feataure.length > 0) {
        for (var k = 0; k < this.latest_feataure.length; k++) {
          if (this.map.getLayer(this.latest_feataure[k].featureid)) {
            // Remove map layer & source.
            this.map.removeLayer(this.latest_feataure[k].featureid);
            this.map.removeSource(this.latest_feataure[k].featureid);

          }
        }
        try {
          // let pids = []
          // pids.push(this.latest_feataure[k].featureid);
          // this.draw.delete(pids)
          this.draw.deleteAll();
          this.Isaddgeofence = false;
          this.IsEditgeofence = false;
          this.Isselectedgeofence = false;
          //this.createMode = false;
          //this.editMode = false;
          //this.beforeEditMode = false;
          // this.startEditMode = false;
        } catch (e) {
          console.log(e);
        }
      }
      else {
        if (this.map.getLayer(this.latest_feataure.featureid)) {
          // Remove map layer & source.
          this.map.removeLayer(this.latest_feataure.featureid);
          this.map.removeSource(this.latest_feataure.featureid);
        }
      }
    }
  }

  RemoveALLMapItem() {
    for (var i = 0; i < this.markar.length; i++) {
      this.markar[i].remove();
    }

    for (var j = 0; j < this.historyimpactpositionicon.length; j++) {
      this.historyimpactpositionicon[j].remove();
    }

    if (this.map.getLayer("route")) {
      this.map.removeLayer("route");
      this.map.removeSource("route");
    }

    if (this.assetpin != null) {
      this.assetpin.remove()
    }

    if (this.historystartpositionicon != null) {
      this.historystartpositionicon.remove()
    }
    if (this.historyendpositionicon != null) {
      this.historyendpositionicon.remove()
    }
  }

  public isChangeDateClicked: boolean = false;
  openTimeline = false;
  closeTimeline() {
    //remove Operator Popup On Timeline
    this.timeData = undefined
    if (this.existIndex != null && this.CurrentassetHistory.length > 0) {
      this.CurrentassetHistory[this.existIndex].edited = false;
    }
    this.existIndex = null

    this.isChangeDateClicked = true;
    this.openTimeline = false;
  }
  showTimeLine() {
    this.isChangeDateClicked = false;
    this.openTimeline = true;
  }
  ChangeDate() {
    this.isChangeDateClicked = true;
    var computedDateObject = {
      "StartDate": this.historystartdate,
      "EndDate": this.historyenddate,
    }
    this.assetprohelperService.ChangeDateObject(computedDateObject);
  }
  showDate() {
    this.clearPlay();
    //   if (this.customstarttime == null || this.customstarttime == undefined || this.customstarttime == '') {
    //     this.toastr.warning("Fill The Start Time Properly", "success");
    //     return
    // }
    // if (this.customendtime == null || this.customendtime == undefined || this.customendtime == '') {
    //     this.toastr.warning("Fill The End Time Properly", "success");
    //     return
    // }
    //remove Operator Popup On Timeline
    this.timeData = undefined
    if (this.existIndex != null && this.CurrentassetHistory.length > 0) {
      this.CurrentassetHistory[this.existIndex].edited = false;
    }
    this.existIndex = null
    this.datemodel.show();
    this.getHistoryDate(true);
  }
  public selectalarmtype: any = 'OUT OF';
  public alarmtype: any = [{ 'id': 1, 'name': 'OUT OF' }, { 'id': 1, 'name': 'IN' }];
  public assets: any = [];

  GetAssetsList(site) {
    //this.spinner.show();
    this.Issave = true;
    let url = 'TrackingHistory/assetlistwithsite?id=' + site;
    this.assets = [];
    this.spinner.show();
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        this.spinner.hide()
        let body: any = JSON.parse(data['_body']);
        this.assets = body.Data;
        //this.spinner.hide();
        this.Issave = false;
      })
  }


  clear() {
    this.createMode = false;
    this.editMode = false;
    this.beforeEditMode = false;
    this.startEditMode = false;
    this.showmoreGeoFenceDetails = true;
    this.openTimeline = false
    this.isChangeDateClicked = false;
    this.historyCoornidates = undefined
    this.firstGeofenceCreate = false
    this.editgeofenceData = ''
  }
  showMainDashboard() {
    if (!this.IsEditgeofence || localStorage.getItem('trackingtype') == "history") {
      this.removegeofence();
    }
    this.clear();
    this.editfence = "";
    this.draw.deleteAll();
    this.geofencename = '';
    this.bubbles = [];
    this.selectAsset = [];
    this.typecheck = false;
    this.notes = '';
    this.selectalarmtype = 'OUT OF';
    let responsedata = {
      'prmarymenutype': 'geofence',
      'submenutype': '',
      'maptype': 'markerwithgeofence',
      'historydetils': history,
      'IsshowDashboard': true,
      'typeCancel': true
    }
    this.Isaddgeofence = false;
    this.IsEditgeofence = false;
    this.Isselectedgeofence = false;

    this.assetprohelperService.ChangeMapActon(responsedata);
    //unwanted Call
    //this.assetprohelperService.ChangeActiongeofence(true);
  }



  public Issave = false;
  SaveGeofence() {
    if (this.geofencename == undefined || this.geofencename == null || this.geofencename.trim() == '') {
      this.toastr.warning("Name Field is Required", 'Warning');
      return;
    }
    if (this.selectAsset.length > 0) {
      let mode = this.draw.getMode();
      if (mode == 'draw_polygon' || mode == 'direct_select') {
        this.toastr.warning("Click Outside Geofence to Submit", 'Warning');
        return;
      }
      this.Issave = true;
      let isoutside = 1
      // this.selectalarmtype='IN'
      if (this.selectalarmtype == 'OUT OF') {
        isoutside = 0;
        //this.selectalarmtype='OUT OF'
      }

      var selectedAssetIDs = this.selectAsset.filter((el, i, a) => i === a.indexOf(el));
      let features = this.draw.getAll().features;
      if (features != null && features != undefined && features.length > 0) {
        features = features[0].geometry.coordinates[0];
      }
      if (this.editfence != '') {
        let value = {
          'coordinates': features,
          'type': "Polygon"
        }
        this.Selectedgeofencefeatures = value;
      }
      // selectedAssetIDs=[]
      // this.bubbles.forEach(data=>{
      //   if(data.id!=undefined && data.id!=null){
      //     selectedAssetIDs.push(data.id);
      //   }
      // });
      //Creation ID is always null 
      let currentId = this.selectgeoUniqueId;
      if (this.selectgeoUniqueId == "") {
        currentId = null;
      }
      let requestData = {
        "ID": currentId,
        "Name": this.geofencename,
        "SiteUniqueID": this.selectedsiteId,
        "gometry": this.Selectedgeofencefeatures,
        "Notes": this.notes,
        "Type": this.typecheck == true ? 'Alarm' : 'Location',
        "Outside": isoutside,
        "AssetUniqueIDs": selectedAssetIDs
      }

      var url = 'TrackingGeofence/GeoFence'
      this.spinner.show();
      this.assetprohelperService.PostMethod(url, requestData).subscribe(
        data => {
          var body = JSON.parse(data['_body']);
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!');
            this.draw.deleteAll();

            this.assetprohelperService.ChangeActiongeofence(true);
            this.IsEditgeofence = false;
            this.spinner.hide();
            this.Issave = false;
            //this.buildMap()
            this.showMainDashboard();
            this.assetprohelperService.geofenceSave(true);
            //this.Selectedgeofencefeatures =""
            //this.selectgeoUniqueId = null
            //this.selectedgeofenceid = ''
          }
          else {
            this.toastr.error(body.Message, 'Error!');
            this.spinner.hide();
          }
        });
    }
    else {
      this.toastr.error("Please select asset(s)", 'Error!');
    }
  }



  DeleteGeofence() {
    this.spinner.show();
    let url = 'TrackingGeofence/GeoFence?Id=' + this.selectgeoUniqueId
    this.assetprohelperService.DeleteMethod(url).subscribe(
      data => {
        var body = JSON.parse(data['_body']);
        if (body.Status) {
          this.toastr.success(body.Message, 'Success!');
          this.spinner.hide();
          this.showMainDashboard();
          this.assetprohelperService.geofenceSave(true);
        }
        else {
          this.toastr.error(body.Message, 'Error!');
          this.spinner.hide();
        }
      });
  }


  clearAllasset() {
    this.bubbles = [];
    this.selectAsset = [];
    this.selectOperator = []
    this.searchText = ''
  }



  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  public customerStartDate: any;
  public customerEndDate: any;

  getHistoryDate(isInitialCall) {
    if (this.historystartdate instanceof Date)
      this.historystartdate = this.datePipe.transform(this.historystartdate, 'yyyy-MM-dd HH:mm:ss')
    if (this.historyenddate instanceof Date)
      this.historyenddate = this.datePipe.transform(this.historyenddate, 'yyyy-MM-dd HH:mm:ss')
    var computedStartDate = new Date(this.historystartdate);
    var computedEndDate = new Date(this.historyenddate);
    //this.fromDate = new NgbDate(computedStartDate.getUTCFullYear(), computedStartDate.getUTCMonth() + 1, computedStartDate.getDate());
    //this.toDate = new NgbDate(computedEndDate.getUTCFullYear(), computedEndDate.getUTCMonth() + 1, computedEndDate.getDate());
    this.dateTimePicker.navigateTo({ year: computedStartDate.getUTCFullYear(), month: computedStartDate.getUTCMonth() + 1 });
    this.customstarttime.setHours(computedStartDate.getHours());
    this.customstarttime.setMinutes(computedStartDate.getMinutes());
    this.customendtime.setHours(computedEndDate.getHours());
    this.customendtime.setMinutes(computedEndDate.getMinutes());
    this.customerStartDate = computedStartDate;
    this.customerEndDate = computedEndDate;

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


  public pass: any = [];
  public passFromDate: any = [];
  public passToDate: any = [];
  public ngbDate: any;
  public ngbFromDate: any;
  public ngbToDate: any;
  public historyType: any = "";
  public historyStartTime: any = new Date();
  public historyEndTime: any = new Date();

  getTimeLineResult() {
    this.clearPlay();
    this.FilterType = 'Custom'
    if (this.historyStartTime == null || this.historyStartTime == undefined || this.historyStartTime == '') {
      this.toastr.warning("Fill The Start Time Properly", "Warning");
      return
    }
    if (this.historyEndTime == null || this.historyEndTime == undefined || this.historyEndTime == '') {
      this.toastr.warning("Fill The End Time Properly", "Warning")
      return
    }
    if (this.historyType == "assert")
      this.getTimeLineAssetResult();
    else
      this.getTimeLineOperatorResult();
  }
  getTimeLineAssetResult() {
    let url = 'TrackingHistory/AssetHistoryDetails';
    var computedStartDate: any = new Date();
    var computedEndDate: any = new Date();
    computedStartDate.setFullYear(this.fromDate.year);
    computedStartDate.setMonth(this.fromDate.month - 1);
    computedStartDate.setDate(this.fromDate.day);
    
    
    computedStartDate.setHours(this.historyStartTime.getHours());
    computedStartDate.setMinutes(this.historyStartTime.getMinutes());
    computedStartDate.setSeconds(0);
    if (this.toDate == null) {
      computedEndDate.setFullYear(this.fromDate.year);
      computedEndDate.setMonth(this.fromDate.month - 1);
      computedEndDate.setDate(this.fromDate.day);
    } else {
      computedEndDate.setFullYear(this.toDate.year);
      computedEndDate.setMonth(this.toDate.month - 1);
      computedEndDate.setDate(this.toDate.day);
      
      
    }
    computedEndDate.setHours(this.historyEndTime.getHours());
    computedEndDate.setMinutes(this.historyEndTime.getMinutes());
    computedEndDate.setSeconds(0);
    if (this.fromDate instanceof NgbDate) {
      //computedStartDate = new Date(this.fromDate.year, (this.fromDate.month - 1), this.fromDate.day, this.historyStartTime.getHours(), this.historyStartTime.getMinutes(), this.historyStartTime.getUTCSeconds());
      computedStartDate = new Date(this.datePipe.transform(computedStartDate, 'yyyy-MM-dd HH:mm:ss'));
    }
    if (this.toDate == undefined || this.toDate == null) {
      this.toDate = this.fromDate;
    }
    //if (this.toDate instanceof NgbDate) {
    //computedEndDate = new Date(this.toDate.year, (this.toDate.month - 1), this.toDate.day, this.historyEndTime.getHours(), this.historyEndTime.getMinutes(), this.historyEndTime.getUTCSeconds());
    computedEndDate = new Date(this.datePipe.transform(computedEndDate, 'yyyy-MM-dd HH:mm:ss'));
    //}
    let date1_ms = computedStartDate.getTime();
    let date2_ms = computedEndDate.getTime();

    // Calculate the difference in milliseconds
    let difference_ms = date2_ms - date1_ms;


    if (difference_ms > 86400000) {
      this.toastr.error("Kindly select less than or equal to 24 hours !", 'Error!');
      return;
    }
    // let requestdata = {
    //   "SiteId": localStorage.getItem('selectitemId'),
    //   "StartDate": computedStartDate.getUTCFullYear()+'-'+parseInt(computedStartDate.getMonth()+1)+'-'+computedStartDate.getDate()+' '+computedStartDate.toLocaleTimeString(),
    //   "EndDate": computedEndDate.getUTCFullYear()+'-'+parseInt(computedEndDate.getMonth()+1)+'-'+computedEndDate.getDate()+' '+computedEndDate.toLocaleTimeString(),
    //   "Assets": this.selectAsset
    // }
    let requestdata = {
      "SiteId": localStorage.getItem('selectitemId'),
      "StartDate": computedStartDate.getFullYear() + "-" + (computedStartDate.getMonth() + 1) + "-" + computedStartDate.getDate() + " " + computedStartDate.getHours() + ":" + computedStartDate.getMinutes() + ":" + computedStartDate.getSeconds(),
      "EndDate": computedEndDate.getFullYear() + "-" + (computedEndDate.getMonth() + 1) + "-" + computedEndDate.getDate() + " " + computedEndDate.getHours() + ":" + computedEndDate.getMinutes() + ":59",
      "Assets": this.selectAsset,
      "FilterType": this.FilterType
    }

    let historydetails: any = [];

    if (this.selectAsset.length != 0) {
      this.spinner.show();
      this.assetprohelperService.PostMethod(url, requestdata).subscribe(
        data => {
          this.spinner.hide();
          let body: any = JSON.parse(data['_body']);

          if (body.Data.length != 0) {
            historydetails = body.Data;

            var lastOperatorID = 0;
            for (var historyDetailsIndex = 0; historyDetailsIndex < historydetails[0].HistoryDetails; historyDetailsIndex++) {
              var currentItem = historydetails[0].HistoryDetails[historyDetailsIndex];
              if (historyDetailsIndex != 0 && currentItem.OperatorID != lastOperatorID) {
                historydetails[0].HistoryDetails[historyDetailsIndex - 1].IsOperatorChanged = true;
              }
              lastOperatorID = currentItem.OperatorID;
            }
            if (historydetails[0].HistoryDetails != null && historydetails[0].HistoryDetails != undefined && historydetails[0].HistoryDetails.length > 0) {
              if (historydetails[0].HistoryDetails[0].ColorCode == 'accident') {
                this.historydatadetilas.isimpact = true;
              } else {
                this.historydatadetilas.isimpact = false;
              }
            }
            let tempHist= historydetails[0].HistoryDetails;
            this.datemodel.hide();
            let responsedata = {
              'prmarymenutype': 'history',
              'submenutype': 'asset',
              'maptype': 'markerwithgeofence',
              'historydetils': historydetails[0].HistoryDetails,
              'coordinates': historydetails[0].coordinates,
              'responsevalue': historydetails,
              'startdate': this.fromDate,
              'enddate': this.toDate
            }
            this.StartDate = body.StartDate;
            this.EndDate = body.EndDate;
            this.assetprohelperService.ChangeMapActon(responsedata);
            if (body.utcStartDate != null && body.utcStartDate != '') {
              this.historyStartTime = new Date(body.utcStartDate + ' ' + body.utcStartTime);
              // let tempdate = body.utcStartTime.split(":")
              // this.historyStartTime.setHours(tempdate[0])
              // this.historyStartTime.setMinutes(tempdate[1])
              // this.historyStartTime.setSeconds(tempdate[2])
            }
            if (body.utcEndDate != null && body.utcEndDate != '') {
              this.historyEndTime = new Date(body.utcEndDate + ' ' + body.utcEndTime);
              // let tempdate = body.utcEndTime.split(":")
              // this.historyEndTime.setHours(tempdate[0])
              // this.historyEndTime.setMinutes(tempdate[1])
              // this.historyEndTime.setSeconds(tempdate[2])
            }
          }
          else {
            this.toastr.error('There is no history for the select assets and selected timeframe');
          }
        });
    }
    else {
      this.toastr.error("Kindly select assets !", 'Error!');
    }
  }
  getTimeLineOperatorResult() {
    this.clearPlay();
    this.OperatorResult()
  }
  getTimeLineIndividualResult(data) {
    this.clearPlay();
    if (this.historyType != "assert") {
      this.OperatorResult()
      return;
    }
    //Timeline Popup Data clear
    this.timeData = undefined
    this.existIndex = null
    //this.getHistoryDate(true);
    let url = 'TrackingHistory/AssetHistoryDetails';
    let computedStartDate: any = new Date();
    let computedEndDate: any = new Date();
    computedStartDate.setFullYear(this.fromDate.year);
    computedStartDate.setMonth(this.fromDate.month - 1);
    computedStartDate.setDate(this.fromDate.day);
    
  
    computedStartDate.setHours(this.historyStartTime.getHours());
    computedStartDate.setMinutes(this.historyStartTime.getMinutes());
    computedStartDate.setSeconds(0);
    if (this.toDate == null) {
      computedEndDate.setFullYear(this.fromDate.year);
      computedEndDate.setMonth(this.fromDate.month - 1);
      computedEndDate.setDate(this.fromDate.day);
      
      
    } else {
      computedEndDate.setFullYear(this.toDate.year);
      computedEndDate.setMonth(this.toDate.month - 1);
      computedEndDate.setDate(this.toDate.day);
      
      
    }
    computedEndDate.setHours(this.historyEndTime.getHours());
    computedEndDate.setMinutes(this.historyEndTime.getMinutes());
    computedEndDate.setSeconds(0);
    if (this.fromDate instanceof NgbDate) {
      //computedStartDate = new Date(this.fromDate.year, (this.fromDate.month - 1), this.fromDate.day, this.historyStartTime.getHours(), this.historyStartTime.getMinutes(), this.historyStartTime.getUTCSeconds());
      computedStartDate = new Date(this.datePipe.transform(computedStartDate, 'yyyy-MM-dd HH:mm:ss'));
    }
    if (this.toDate == undefined || this.toDate == null) {
      this.toDate = this.fromDate;
    }
    //if (this.toDate instanceof NgbDate) {
    //computedEndDate = new Date(this.toDate.year, (this.toDate.month - 1), this.toDate.day, this.historyEndTime.getHours(), this.historyEndTime.getMinutes(), this.historyEndTime.getUTCSeconds());
    computedEndDate = new Date(this.datePipe.transform(computedEndDate, 'yyyy-MM-dd HH:mm:ss'));
    //}

    var assets = []
    assets.push(data.AssetID);
    let requestdata = {
      "SiteId": localStorage.getItem('selectitemId'),
      "StartDate": computedStartDate.getFullYear() + "-" + (computedStartDate.getMonth() + 1) + "-" + computedStartDate.getDate() + " " + computedStartDate.getHours() + ":" + computedStartDate.getMinutes() + ":" + computedStartDate.getSeconds(),
      "EndDate": computedEndDate.getFullYear() + "-" + (computedEndDate.getMonth() + 1) + "-" + computedEndDate.getDate() + " " + computedEndDate.getHours() + ":" + computedEndDate.getMinutes() + ":59",
      "Assets": assets,
      "FilterType": this.FilterType
    }

    let historydetails: any = [];
    if (this.selectAsset.length != 0) {
      this.spinner.show();
      this.assetprohelperService.PostMethod(url, requestdata).subscribe(
        data => {
          this.spinner.hide();
          let body: any = JSON.parse(data['_body']);
          let historyDropValue;
          let historyDropCoord;
          if (body.Data.length != 0) {
            historydetails = body.Data;
            if (historydetails.length > 1) {
              for (let i = 0; i < historydetails.length; i++) {
                historyDropValue = historydetails[i].HistoryDetails;
                historyDropCoord = historydetails[i].coordinates;
              }
            } else {
              historyDropValue = historydetails[0].HistoryDetails;
              historyDropCoord = historydetails[0].coordinates;
            };
            this.datemodel.hide();
            let responsedata = {
              'prmarymenutype': 'history',
              'submenutype': 'asset',
              'maptype': 'markerwithgeofence',
              'historydetils': historyDropValue,
              'coordinates': historyDropCoord,
              'responsevalue': historydetails,
              'startdate': this.fromDate,
              'enddate': this.toDate,
              'selectionType': 'Y'
            }

            this.assetprohelperService.ChangeMapActon(responsedata);
          }
          else {
            this.toastr.error('There is no history for the select assets and selected timeframe');
          }
        });
    }
    else {
      this.toastr.error("Kindly select assets !", 'Error!');
    }
  }
  impactDetailsImpact(value) {
    //this.historydatadetilas.isimpact = value;
    return value;
  }
  impactDetailsNoImpact(value) {
    //this.historydatadetilas.isimpact = !value;
    return value;
  }
  searchText = ''
  cancelgeofence() {
    this.selectgeoUniqueId
    this.geofencename = ''
    this.bubbles = [];
    this.notes = ''
    this.searchText = ''
    this.selectalarmtype = 'OUT OF';
    this.typecheck = false;
    if (this.createMode) {
      this.showMainDashboard()
      return;
    }
    if (this.editgeofenceData != '' && this.editgeofenceData.type == 'GeoFencestype') {
      this.editMode = false;
      this.startEditMode = false;
      this.beforeEditMode = false;
      let responsedata = {
        'prmarymenutype': 'geofence',
        'submenutype': '',
        'maptype': 'markerwithgeofence',
        'historydetils': history,
        'IsshowDashboard': true,
        'typeCancel': true
      }
      this.draw.deleteAll();
      this.assetprohelperService.ChangeShowDashboard(responsedata);
    } else {
      this.editgeofenceData = ''
      this.editfence = "";
      this.draw.deleteAll();
      this.geofencename = '';
      this.bubbles = [];
      this.selectAsset = [];
      this.selectOperator = []
      this.typecheck = false;
      this.notes = '';
      this.selectalarmtype = 'OUT OF';
      let responsedata = {
        'prmarymenutype': 'geofence',
        'submenutype': '',
        'maptype': 'markerwithgeofence',
        'historydetils': history,
        'IsshowDashboard': true,
        'typeCancel': true
      }
      this.Isaddgeofence = false;
      this.IsEditgeofence = false;
      this.Isselectedgeofence = false;
     
      this.assetprohelperService.ChangeMapActon(responsedata);
    }
     this.editMode=false;
     this.assetprohelperService.geofenceSave(true);
  }
  cancelEditMode() {
    this.selectgeoUniqueId = ''
    this.beforeEditMode = !this.beforeEditMode
    //this.recreateGeofence();
  }
  existIndex = null;
  timeData: any;
  timelinePopup(index, data) {

    this.timeData = data
    if (this.existIndex != null) {
      this.CurrentassetHistory[this.existIndex].edited = false;
    }
    this.CurrentassetHistory[index].edited = true;
    this.existIndex = index
    if(this.timeData==undefined){
      this.timeData={}
    }
    try{
    if (data.AssetCurrentMode!=undefined && data.AssetCurrentMode == 1 || data.AssetCurrentMode == '1') {
      this.timeData.modeName = 'ByPass'
    }
    else if (data.AssetCurrentMode!=undefined && data.AssetCurrentMode == 1 || data.AssetCurrentMode == '1') {
      this.timeData.modeName = 'Maintenance Mode'
    }
    // else if (data.AssetCurrentMode == null || data.AssetCurrentMode == '0' || data.AssetCurrentMode == 0) {
    //   this.timeData.modeName = 'Logoff'
    // }
    else {
      this.timeData.modeName = 'Normal Mode'
    }
  }catch(e){
    console.log(e);
  }
  }
  closeTimeData() {
    this.timeData = undefined
    if (this.existIndex != null && this.CurrentassetHistory.length > 0) {
      this.CurrentassetHistory[this.existIndex].edited = false;
    }
    this.existIndex = null
  }
  recreateGeofence() {
    this.DrawSelectedGeofence(this.editgeofenceData);
  }
  clearPlay(){
    this.playEnable=false;
    this.showPopup=false;
  }
  OperatorResult() {
    this.clearPlay();
    this.playEnable=false;
    //this.assetprohelperService.ChangeMapActon(this.cleardata);
    let url = 'TrackingHistory/OperatorHistoryDetails';
    let computedStartDate: any = new Date();
    let computedEndDate: any = new Date();
    computedStartDate.setFullYear(this.fromDate.year);
    computedStartDate.setMonth(this.fromDate.month - 1);
    computedStartDate.setDate(this.fromDate.day);
    computedStartDate.setHours(this.historyStartTime.getHours());
    computedStartDate.setMinutes(this.historyStartTime.getMinutes());
    computedStartDate.setSeconds(0);
    if (this.toDate == null) {
      computedEndDate.setFullYear(this.fromDate.year);
      computedEndDate.setMonth(this.fromDate.month - 1);
      computedEndDate.setDate(this.fromDate.day);
      
    } else {
      computedEndDate.setFullYear(this.toDate.year);
      computedEndDate.setMonth(this.toDate.month - 1);
      computedEndDate.setDate(this.toDate.day);
      
      
    }
    computedEndDate.setHours(this.historyEndTime.getHours());
    computedEndDate.setMinutes(this.historyEndTime.getMinutes());
    computedEndDate.setSeconds(0);
    if (this.fromDate instanceof NgbDate) {
      //computedStartDate = new Date(this.fromDate.year, (this.fromDate.month - 1), this.fromDate.day, this.historyStartTime.getHours(), this.historyStartTime.getMinutes(), this.historyStartTime.getUTCSeconds());
      computedStartDate = new Date(this.datePipe.transform(computedStartDate, 'yyyy-MM-dd HH:mm:ss'));
    }
    if (this.toDate == undefined || this.toDate == null) {
      this.toDate = this.fromDate;
    }
    //if (this.toDate instanceof NgbDate) {
    //computedEndDate = new Date(this.toDate.year, (this.toDate.month - 1), this.toDate.day, this.historyEndTime.getHours(), this.historyEndTime.getMinutes(), this.historyEndTime.getUTCSeconds());
    computedEndDate = new Date(this.datePipe.transform(computedEndDate, 'yyyy-MM-dd HH:mm:ss'));
    //}
    let date1_ms = computedStartDate.getTime();
    let date2_ms = computedEndDate.getTime();

    // Calculate the difference in milliseconds
    let difference_ms = date2_ms - date1_ms;


    if (difference_ms > 86400000) {
      this.toastr.error("Kindly select less than or equal to 24 hours !", 'Error!');
      return;
    }
    let requestdata = {
      "SiteId": localStorage.getItem('selectitemId'),
      "StartDate": computedStartDate.getFullYear() + "-" + (computedStartDate.getMonth() + 1) + "-" + computedStartDate.getDate() + " " + computedStartDate.getHours() + ":" + computedStartDate.getMinutes() + ":" + computedStartDate.getSeconds(),
      "EndDate": computedEndDate.getFullYear() + "-" + (computedEndDate.getMonth() + 1) + "-" + computedEndDate.getDate() + " " + computedEndDate.getHours() + ":" + computedEndDate.getMinutes() + ":59",
      "Operator": this.selectOperator,
      "FilterType": this.FilterType
    }

    let historydetails: any = [];

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
            'startdate': computedStartDate,
            'enddate': computedEndDate
          }
          this.StartDate = body.StartDate;
          this.EndDate = body.EndDate;
          this.assetprohelperService.ChangeMapActon(responsedata);
          if (body.utcStartDate != null && body.utcStartDate != '') {
            this.historyStartTime = new Date(body.utcStartDate + ' ' + body.utcStartTime);
            // let tempdate = body.utcStartTime.split(":")
            // this.historyStartTime.setHours(tempdate[0])
            // this.historyStartTime.setMinutes(tempdate[1])
            // this.historyStartTime.setSeconds(tempdate[2])
          }
          if (body.utcEndDate != null && body.utcEndDate != '') {
            this.historyEndTime = new Date(body.utcEndDate + ' ' + body.utcEndTime);
            // let tempdate = body.utcEndTime.split(":")
            // this.historyEndTime.setHours(tempdate[0])
            // this.historyEndTime.setMinutes(tempdate[1])
            // this.historyEndTime.setSeconds(tempdate[2])
          }
        }
        else {
          this.toastr.error('There is no history for the select operator and selected timeframe');
        }
      })


  }
  centerPoint(data) {
    let bounds = data.reduce(function (bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(data[0], data[0]));

    this.map.fitBounds(bounds, {
      padding: 100
    });
  }
}