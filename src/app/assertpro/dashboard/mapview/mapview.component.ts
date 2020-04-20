import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Component, Inject, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import * as MapboxDraw from 'mapbox-gl-draw';
import * as turf from 'turf';
@Component({
  selector: 'mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MapViewDailog implements OnInit {
  @Input() data = []
  constructor(
    //public dialogRef: MatDialogRef<MapViewDailog>, @Inject(MAT_DIALOG_DATA) public data: any,
    public assetprohelperService: AssetprohelperService) {
     //this.mapDatas= data.TableRecords
    mapboxgl.accessToken =  'pk.eyJ1IjoiYWNjZXNzIiwiYSI6ImZVR2xUOWcifQ.lsenYLUIWQoYGH27v2aC6Q';
  }
  mapDatas=[]
  ngOnInit(): void {
    this.buildMap();    
  }
  onNoClick(): void {
    //this.dialogRef.close();
  }
  onYesClick(): void {
    //this.dialogRef.close('Yes');
  }
  public map: any;
  public zoomlevel: any = 3;
  public draw: any;
  public activenavigationcontrol: any = '';
  public satellitetype: any = false;
  usersites = []
  pin:string='<img src="/assets/icon/pin.png" style="margin-top:-100%;width:47px;height:64px" />';
  redPin:string='<img src="/assets/icon/red-pin.png" style="margin-top:-100%;width:47px;height:64px" />';
  getuserSites() {
    let url = 'Account/UserSites';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.usersites = body.Data;
      })
  }
  buildMap() {
    let thiskey = this;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [localStorage.getItem('siteLng'), localStorage.getItem('siteLat')],
      zoom: thiskey.zoomlevel,
      speed: 1.4
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
          //thiskey.assetprohelperService.ChangeMapActon(responsedata);
        }

      })
      var coordinates = data.features[0].geometry.coordinates[0];
      let geomatry = data.features[0].geometry.coordinates[0]
      let value = {
        'coordinates': geomatry,
        'type': "Polygon"
      }
      //this.Selectedgeofencefeatures = value;

      if (this.draw.getMode() == 'draw_polygon') {
        var pids = []

        // ID of the added template empty feature
        const lid = data.features[data.features.length - 1].id

        data.features.forEach((f) => {
          if (f.geometry.type === 'Polygon' && f.id !== lid) {
            pids.push(f.id);
            //            this.pids.push(f.id);
          }
        })
        this.draw.delete(pids)
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
this.drawAllData(this.data);
  }

  ZoomIn() {
    this.activenavigationcontrol = 'zoomin'
    this.zoomlevel = this.zoomlevel + 1;
    this.map.setZoom(this.zoomlevel);
    if (this.zoomlevel == 10) {
      this.activenavigationcontrol = ''
    }
  }

  ZoomOut() {
    if (this.zoomlevel > 1) {
      this.activenavigationcontrol = 'zoomout'
      this.zoomlevel = this.zoomlevel - 1;
      this.map.setZoom(this.zoomlevel);
    }
    if (this.zoomlevel == 10) {
      this.activenavigationcontrol = ''
    }
  }

  setSatelliteView() {
    if (!this.satellitetype) {
      this.satellitetype = true;
      this.map.setStyle('mapbox://styles/mapbox/satellite-v9');
    }
    else {
      this.satellitetype = false;
      this.map.setStyle('mapbox://styles/mapbox/streets-v9');
    }
  }
  
  public default_longitude: number = -98.57948;
  public default_latitude: number = 39.828346;
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
  public popup: any = [];
  public markar: any = [];
  drawAllData(data) {
    var markers = [];
    var markerCoOrdinates = [];
    data.forEach(element => {
      if (element.Lat != null && element.Lon != null) {
        markerCoOrdinates.push([parseFloat(element.Lon), parseFloat(element.Lat)]);
        markers.push(turf.point([parseFloat(element.Lon), parseFloat(element.Lat)]));
        
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
    this.map.setZoom(this.zoomlevel);
    this.map
    let k = 0;
    let currentasset = data;
    for (var m = 0; m < currentasset.length; m++) {
      let Alarms: any = '';
      let Status: any = '';
      let Mode: any = '';

      if (currentasset[m].Lon !== null && currentasset[m].Lat !== null) {
        var impact: any = [];
        impact[k] = document.createElement('div');

        if (currentasset[m].ImpactAlarm == "Y") {
          impact[k].innerHTML = this.redPin;
          //impact[k].style.backgroundImage = 'url("/assets/icon/red-pin.png")';
        }
        else {
          impact[k].innerHTML =this.pin;
          //impact[k].style.backgroundImage = 'url("/assets/icon/pin.png")';
        }

        // impact[k].style.width = '47px';
        // impact[k].style.height = '64px';
        // impact[k].style.backgroundRepeat = 'no-repeat';
        var description = "<div style='width:300px'><div class='row'><div class='col-5'><strong>Current Status</Strong></div><div class='col-7'>" + currentasset[m].AssetTypeName + "</div></div><div class='row'><div class='col-5'><strong>Availability</Strong></div><div class='col-7'>" + currentasset[m].name + "</div></div><div class='row'><div class='col-5'><strong>Output</strong></div> <div class='col-7'>" + Alarms + "</div></div><div class='row'><div class='col-5'><strong>AH Charge</strong></div><div class='col-7'>" + currentasset[m].EventDate + "</div></div><div class='row'><div class='col-5'><strong>Temperature</strong></div><div class='col-7'>" + currentasset[m].OperatorName + "</div></div><div class='row'><div class='col-5'><strong>SoC Level</strong></div><div class='col-7'><span>" + Mode + "</span></div></div><div class='row'><div class='col-5'><strong>Paired device</strong></div><div class='col-7'><span>" + Status + "<span></div></div></div>"
        this.popup[k] = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true,
          // anchor: 'bottom-left',
          offset: [0, -25]
        })
          .setHTML(description);
         this.markar[k] = new mapboxgl.Marker(impact[k]).setLngLat([currentasset[m].Lon, currentasset[m].Lat]).setPopup(this.popup[k]).addTo(this.map);

        k = k + 1;
      }

    }
    if (currentasset.length == 1) {
      this.flyMap(currentasset[0].Lon, currentasset[0].Lat);
    }
    else {
      // this.flyMap(center.geometry.coordinates[0], center.geometry.coordinates[1]);
      this.flyMap(localStorage.getItem('siteLng'), localStorage.getItem('siteLat'));
    }
  }
  latest_feataure=[]
  DrawSelectedGeofence(data) {
    this.zoomlevel = 10;
    //get mile
    var markers = [];
    var markerCoOrdinates = [];
    let datas=[]
    datas.forEach(element => {
      if (element.Lon != null && element.Lat != null) {
        markerCoOrdinates.push([element.Lon,  element.Lat]);
        markers.push(turf.point([element.Lon,  element.Lat]));
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

    this.map.setZoom(this.zoomlevel);
   // this.flyMap(data.sitlng, data.sitelat);
    let features = data.coordinates;
    let k = 0;
    this.latest_feataure = features;

      for (var i = 0; i < features.length; i++) {
        this.map.addLayer({
          'id': i,
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates': [features[i].gometry.coordinates]
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

        let thiskey = this;
        this.map.on('click', i, function (e) {
          let data = { 'fill-color': "rgba(22, 155, 215, 0.12)", 'fill-outline-color': "#169bd7", 'fill-opacity': 0.8, 'fillColor': "#169bd7" }
          e.features[0].layer.paint = data;
          for (var j = 0; j < features.length; j++) {
            if (e.features[0].layer.id == features[j].featureid) {
             // thiskey.Selectedgeofencefeatures = features[j].gometry;
              //thiskey.GetGeoFenceDetails(features[j].ID);
              ///thiskey.selectgeoUniqueId = features[j].ID;
              //thiskey.selectedgeofenceid = features[j].featureid;
            }
          }
          //thiskey.Isselectedgeofence = true;
          //thiskey.Isaddgeofence = false;
        })

        var description = "<div style='min-width:200px'><div class='row geofence-popup'><div class='col-12'>" + features[i].SiteName + " / " + features[i].name + "</div></div></div>"
        // Hover to display popup on marker
        var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        let thisakey = this;
        const geofencedesc = description;
        const geofencelonglat = features[i].gometry.coordinates[0];
        this.map.on('mouseenter', features[i].featureid, function (e) {
          popup.setLngLat(geofencelonglat)
            .setHTML(geofencedesc)
            .addTo(thisakey.map);
        });

        this.map.on('mouseleave', i, function (e) {
          popup.remove();
        });
        // End Hover to display popup on marker

      }

  }
  GetZoomLevel(miles) {
    var computedZoomLevel = 4;
    if (miles > 6000)
    computedZoomLevel = 1;
    else if (miles > 1500)
      computedZoomLevel = 3;
      else if (miles > 900)
      computedZoomLevel = 3;
      else if (miles > 500)
      computedZoomLevel = 4;
    else if (miles > 250)
      computedZoomLevel = 6;
    else if (miles > 100)
      computedZoomLevel = 8;
    else if (miles > 50)
      computedZoomLevel = 8;
      else if (miles > 25)
      computedZoomLevel = 8;
    else if (miles > 10)
      computedZoomLevel = 10;
    else
      computedZoomLevel = 12;

    return computedZoomLevel;
  }
}