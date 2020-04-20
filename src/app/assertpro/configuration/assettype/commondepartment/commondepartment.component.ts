import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AssetprohelperService } from "src/app/share/services/assetprohelper.service";
import { Subscription } from "rxjs";
import { FormBuilder } from "@angular/forms";
@Component({
  selector: "commondepartment",
  templateUrl: "./commondepartment.component.html",
  styleUrls: ["./commondepartment.component.css"]
})
export class CommonanDepartmentComponent implements OnInit, OnDestroy {
  constructor(
    public toastr: ToastrService,
    public assetprohelperService: AssetprohelperService,
    private _formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(
      () => {
        this.siteName = localStorage.getItem("sitename");
        if (
          localStorage.getItem("selectitemId") != null &&
          localStorage.getItem("selectitemId") != "null"
        ) {
          this.siteId = localStorage.getItem("selectitemId");
          if (this.isInitialDeptLoadEnabled) {
            this.departmentListFun();
          } else {
            this.departmentList = [];
          }
        } else {
          this.siteId = "";
          this.bubbles = [];
          this.departmentList = [];
          return;
        }
      }
    );
  }
  @Input() header = "SEARCH FOR DEPARTMENT";
  @Input() defaultDept = [];
  private serviceSubscription: Subscription;
  @Output() selectionChange = new EventEmitter();
  public isInitialDeptLoadEnabled: boolean = true;
  public isClearOptionEnabled: boolean = false;
  public isAllSiteValidationSkip: boolean = true;
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  siteId = "";
  siteName = "";
  assets = [];
  departmentList = [];
  departmentListFun() {
    var computedID =
      localStorage.getItem("selectitemId") == null ||
      localStorage.getItem("selectitemId") == undefined
        ? "null"
        : localStorage.getItem("selectitemId");
    let url = "TrackingHistory/departmentlistwithsite?id=" + computedID;
    this.departmentList = [];
    this.bubbles = [];
    //this.loader=true
    this.assetprohelperService.GetMethod(url).subscribe(data => {
     // this.loader=false
      let body: any = JSON.parse(data["_body"]);
      this.departmentList = body.Data;
      if(this.defaultDept.length!=0){
        this.defaultDept.forEach(data=>{
        this.departmentList.forEach(row=>{
          if(data==row.ID){
            this.bubbles.push({
              id: row.ID,
              value: row.NAME,
              type: 'assettype',
              typename: row.NAME
            })
          }
        });
      })
      }
    });
  }

  loader=false;
  getDepartmentList(siteIDs) {
    let url = "Report/departmentlistBySiteIDs";
    this.departmentList = [];
    this.bubbles = [];
    var requestParam = [];
    requestParam.push(siteIDs);
    this.loader=true
    this.assetprohelperService
      .PostMethod(url, {
        SiteIDs: requestParam
      })
      .subscribe(response => {
        this.loader=false
        let body: any = JSON.parse(response["_body"]);
        this.departmentList = body.Data;
      });
  }

  clearAllDepartment() {
    this.bubbles = [];
    this.selectionChange.emit();
  }
  searchText;
  bubbles = [];
  AssetItem(value: string, type, typevalue, typename) {
    if (
      localStorage.getItem("sitename") != "All Sites" ||
      this.isAllSiteValidationSkip
    ) {
      if (value != "") {
        for (var i = this.bubbles.length - 1; i >= 0; i--) {
          if (this.bubbles[i].id == typevalue.ID) {
            this.bubbles.splice(i, 1);
          }
        }
        var isExist = this.bubbles.filter(p => p.value == value);
        if (isExist.length == 0)
          this.bubbles.push({
            id: typevalue.ID,
            value: value,
            type: type,
            typename: typename
          });
      }

      if (type == "assettype") {
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
            this.bubbles.push({
              id: typevalue.ID,
              value: value,
              type: type,
              typename: typename
            });
        }
      }
    } else {
      this.toastr.error("Kindly select the site", "Error!");
    }
    this.selectionChange.emit();
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
    this.selectionChange.emit();
  }

  getDepartmentIDs() {
    var selectedIDs = [];
    for (var index = 0; index < this.bubbles.length; index++) {
      let currentSite = this.bubbles[index];
      selectedIDs.push(currentSite.id);
    }
    return selectedIDs;
  }

  getDepartmentNames() {
    var selectedDepartmentName = "";
    for (var index = 0; index < this.bubbles.length; index++) {
      let currentSite = this.bubbles[index];
      selectedDepartmentName += currentSite.value + ",";
    }
    selectedDepartmentName = selectedDepartmentName.slice(0, -1);
    return selectedDepartmentName;
  }
}
