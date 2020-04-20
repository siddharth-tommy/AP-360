import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'commoncommand',
  templateUrl: './commoncommand.component.html',
  styleUrls: ['./commoncommand.component.css']
})
export class CommonCommand implements OnInit, OnDestroy {
  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService, private _formBuilder: FormBuilder) {
  }
  @Input() header = 'SEARCH FOR ASSET/ASSET TYPE'
  @Input() deapartment = true
  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      this.bubbles = []
      this.assets = []
      this.getCommandList();
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
      } else {
        this.siteId = '';
        return;
      }
    });
  }
  private serviceSubscription: Subscription;
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  siteId = '';
  siteName = '';
  assets = []

  departmentList=[];

  getCommandList() {
    //var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    //let url = 'TrackingLocation/assetwithsite?id=' + computedID;
     let url = 'Configuration/GetAllCommandList';
    this.assets = [];
    this.bubbles = []

      this.assetprohelperService.GetMethod(url).subscribe(
        data => {
            
          let body: any = JSON.parse(data['_body']);
          this.assets = body.Data;
        })

  }
  searchText
  bubbles = [];
  AssetItem(value: string, type, typevalue, typename) {
   
    if (localStorage.getItem('sitename') != 'All Sites') {
      if (type == 'assettype') {
        return;
      }
      this.bubbles = [];
      if (value != '') {
        for (var i = this.bubbles.length - 1; i >= 0; i--) {
          if (this.bubbles[i].id == typevalue.AssetTypeID) {
            this.bubbles.splice(i, 1);
          }
        }
        var isExist = this.bubbles.filter(p => p.value == value);
        if (isExist.length == 0) {
          if (typevalue.TypeID) {
            let temp = []
            this.bubbles.forEach(data => {
              if (data.assetTypeID == typevalue.TypeID) {
                temp.push(data);
              }
            });
            this.bubbles = temp;
            this.bubbles.push({ 'id': typevalue.ID, 'value': value, 'type': type, 'typename': typename, assetTypeID: typevalue.TypeID });
          }
          else
            this.bubbles.push({ 'id': typevalue.ID, 'value': value, 'type': type, 'typename': typename, assetTypeID: null });
        }
      }
      if (type == 'asset') {
        var bubblesassettype = this.bubbles.filter(p => p.typename == typename);
        var assetsparent = this.assets.filter(p => p.TypeName == typename);

        if (bubblesassettype.length >= assetsparent[0].assets.length) {

          for (var i = 0; i < this.bubbles.length; i++) {
            for (var j = 0; j < bubblesassettype.length; j++) {
              if (this.bubbles[i].id == bubblesassettype[j].id) {
                this.bubbles.splice(i, 1);
              }
            }
          }

          this.bubbles.push({ 'id': assetsparent[0].ID, 'value': typename+ '/' + 'All', 'type': 'assettype', 'typename': assetsparent[0].TypeName, assetTypeID: typevalue.ID });
        } else {
        }
      }

      else if (type == 'assettype') {

        var bubblesassettype = this.bubbles.filter(p => p.typename == typename);
        var assetsparent = this.assets.filter(p => p.TypeName == typename);
        if (bubblesassettype.length > 1) {

          for (var i = 0; i < this.bubbles.length; i++) {
            for (var j = 0; j < bubblesassettype.length; j++) {
              if (this.bubbles[i].id == bubblesassettype[j].id) {
                this.bubbles.splice(i, 1);
              }
            }
          }
          var isExist = this.bubbles.filter(p => p.value == value);
          if (isExist.length == 0)
            this.bubbles.push({ 'id': typevalue.ID, 'value': value, 'type': type, 'typename': typename, assetTypeID: null });
        }
      }

    }
    else {
      this.toastr.error("Kindly select the site", 'Error!');
    }

  }
  RemoveFilterItem(value) {

    // if (value.type == 'asset') {
    //   for (var i = 0; i < this.SelectAsset.length; i++) {
    //     if (this.SelectAsset[i] == value.id) {
    //       this.SelectAsset.splice(i, 1);
    //     }
    //   }
    // }
    // else if (value.type == 'assettype') {
    //   for (var j = 0; j < this.SelectAssettype.length; j++) {
    //     if (this.SelectAssettype[j] == value.id) {
    //       this.SelectAssettype.splice(j, 1);
    //     }
    //   }
    // }

    var index = this.bubbles.indexOf(value);
    if (index > -1) {
      this.bubbles.splice(index, 1);
    }

  }
 
}