import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'commonsite',
  templateUrl: './commonsite.component.html',
  styleUrls: ['./commonsite.component.css']
})
export class CommonaSiteComponent implements OnInit, OnDestroy {
  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService, private _formBuilder: FormBuilder) {
  }
  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
        //this.GetAssetsList();
      } else {
        this.siteId = '';
        this.bubbles = []
        this.assets = []
        return;
      }
    });
  }

  defaultSelection: boolean = false
  private serviceSubscription: Subscription;
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  siteId = '';
  siteName = '';
  assets = []
  SystemID = '';
  @Input() selectedSites = []
  GetAssetsList() {
    //var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    //let url = 'TrackingLocation/assetwithsite?id=' + computedID;
    let url = 'Configuration/GetSiteListBySystemID';
    this.assets = [];
    this.bubbles = []
    this.assetprohelperService.PostMethod(url, { SystemID: this.SystemID }).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.assets = body.Data;
        if (this.selectedSites != null && this.selectedSites != undefined && this.selectedSites.length > 0) {
          this.selectedSites.forEach(data => {
            this.assets.forEach(data2 => {
              if (data.ID == data2.SiteID)
                this.bubbles.push({ 'id': data2.SiteID, 'value': data2.name, 'type': 'assettype', 'typename': undefined });
            })
          })
        }
      })
  }
  searchText
  bubbles = [];
  AssetItem(value: string, type, typevalue, typename) {
    //  if (localStorage.getItem('sitename') != 'All Sites') {
    if (value != '') {
      for (var i = this.bubbles.length - 1; i >= 0; i--) {
        if (this.bubbles[i].id == typevalue.SiteID) {
          this.bubbles.splice(i, 1);
        }
      }
      var isExist = this.bubbles.filter(p => p.value == value);
      if (isExist.length == 0)
        this.bubbles.push({ 'id': typevalue.SiteID, 'value': value, 'type': type, 'typename': typename });
    }

    if (type == 'assettype') {
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
        var isExist = this.bubbles.filter(p => p.value == value);
        if (isExist.length == 0)
          this.bubbles.push({ 'id': typevalue.SiteID, 'value': value, 'type': type, 'typename': typename });
      }
    }

    //  }
    // else {
    //  this.toastr.error("Kindly select the site", 'Error!');
    // }

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