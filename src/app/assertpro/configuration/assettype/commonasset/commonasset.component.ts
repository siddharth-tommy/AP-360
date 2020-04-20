import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AssetprohelperService } from "src/app/share/services/assetprohelper.service";
import { Subscription } from "rxjs";
import { FormBuilder } from "@angular/forms";
@Component({
  selector: "commonasset",
  templateUrl: "./commonasset.component.html",
  styleUrls: ["./commonasset.component.css"]
})
export class CommonassetComponent implements OnInit, OnDestroy {
  constructor(
    public toastr: ToastrService,
    public assetprohelperService: AssetprohelperService,
    private _formBuilder: FormBuilder
  ) {}
  @Input() header = "SEARCH ASSET/ASSET TYPE";
  @Input() deapartment = true;
  @Input() config = false;
  @Input() heightAdj = false;
  @Input() selectAllAssets=false
  @Output() assetChangeEvent = new EventEmitter();
  public isDeleteEnabled: boolean = true;
  public isMultiSelectEnabled: boolean = false;
  public isAllSiteValidationSkip: boolean = true;
  public isLoadFromStorage: boolean = true;
  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(
      () => {
        this.siteName = localStorage.getItem("sitename");
        this.bubbles = [];
        this.assets = [];
        if (
          localStorage.getItem("selectitemId") != null &&
          localStorage.getItem("selectitemId") != "null"
        ) {
          this.siteId = localStorage.getItem("selectitemId");
          if (!this.deapartment) {
            this.GetAssetsList();
          }
        } else {
          this.siteId = "";

          return;
        }
      }
    );
  }
  private serviceSubscription: Subscription;
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  siteId = "";
  siteName = "";
  assets = [];

  departmentList = [];
  loader=false;
  GetAssetsList() {
    var computedID =
      localStorage.getItem("selectitemId") == null ||
      localStorage.getItem("selectitemId") == undefined
        ? "null"
        : localStorage.getItem("selectitemId");
    let url = "TrackingLocation/assetwithsite?id=" + computedID;
    if (this.deapartment == true)
      url = "Configuration/GetAssetListByDepartmentIDs";
    this.assets = [];
    this.bubbles = [];
    if (
      this.deapartment &&
      (this.departmentList == undefined ||
        this.departmentList == null ||
        this.departmentList.length == 0)
    )
      return;
    let idsList = [];
    this.departmentList.forEach(element => {
      idsList.push(element.id);
    });
    this.loader=true
    if (this.deapartment) {
    let  body:any= { DepartmentID: idsList }
      if(this.config){
        body={ DepartmentID: idsList,config:true };
      }
      
      this.assetprohelperService
        .PostMethod(url,body)
        .subscribe(data => {
          this.loader=false;
          let body: any = JSON.parse(data["_body"]);
          this.assets = body.Data;
        });
    } else {
      this.assetprohelperService.GetMethod(url).subscribe(data => {
        this.loader=false;
        let body: any = JSON.parse(data["_body"]);
        this.assets = body.Data;
      });
    }
  }
  searchText;
  bubbles = [];
  AssetItem(value: string, type, typevalue, typename) {
    if (
      localStorage.getItem("sitename") != "All Sites" ||
      this.isAllSiteValidationSkip
    ) {
      if (type == "assettype" && !this.isMultiSelectEnabled) {
        this.bubbles = [];
      }
      if (value != "") {
        for (var i = this.bubbles.length - 1; i >= 0; i--) {
          if (this.bubbles[i].id == typevalue.AssetTypeID) {
            this.bubbles.splice(i, 1);
          }
        }
        var isExist = this.bubbles.filter(p => p.value == value);
        if (isExist.length == 0) {
          if (typevalue.AssetTypeID) {
            let temp = [];
            if (!this.isMultiSelectEnabled) {
              this.bubbles.forEach(data => {
                if (data.assetTypeID == typevalue.AssetTypeID) {
                  temp.push(data);
                }
              });
              this.bubbles = temp;
            }
            this.bubbles.push({
              id: typevalue.ID,
              value: value,
              type: type,
              typename: typename,
              assetTypeID: typevalue.AssetTypeID
            });
          } else
            this.bubbles.push({
              id: typevalue.ID,
              value: value,
              type: type,
              typename: typename,
              assetTypeID: null
            });
        }
      }
      if (type == "asset") {
        var bubblesassettype = this.bubbles.filter(p => p.typename == typename);
        var assetsparent = this.assets.filter(p => p.assetstype == typename);

        if (!this.selectAllAssets && bubblesassettype.length >= assetsparent[0].assets.length) {
          for (var i = 0; i < this.bubbles.length; i++) {
            for (var j = 0; j < bubblesassettype.length; j++) {
              if (this.bubbles[i].id == bubblesassettype[j].id) {
                this.bubbles.splice(i, 1);
              }
            }
          }

          this.bubbles.push({
            id: assetsparent[0].ID,
            value: assetsparent[0].assetstype + "/" + "All",
            type: "assettype",
            typename: assetsparent[0].assetstype,
            assetTypeID: null
          });
        } else {
        }
      } else if (type == "assettype") {
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
              typename: typename,
              assetTypeID: null
            });
        }
      }
      this.assetChangeEvent.emit();
    } else {
      this.toastr.error("Kindly select the site", "Error!");
    }
  }

  isAllAssetSelected = false;
  selectAllAsset() {
    if (!this.isAllAssetSelected) {
      this.bubbles = [];
      for (var index = 0; index < this.assets.length; index++) {
        let currentItem = this.assets[index];
        // if (currentSite.Name != "All Sites")
        //   this.bubbles.push({
        //     id: currentSite.SiteID,
        //     value: currentSite.Name
        //   });
        this.AssetItem(
          currentItem.assetstype + "/" + "All",
          "assettype",
          currentItem,
          currentItem.assetstype
        );
      }
      this.isAllAssetSelected = true;
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
    this.assetChangeEvent.emit();
  }

  clearAllasset() {
    this.bubbles = [];
    this.assetChangeEvent.emit();
  }

  // Check AssetType & Asset selected for reporting module
  selectedAssetType: number = 1;
  getSelectedOptionType() {
    return this.selectedAssetType;
  }

  getSelectedAssetIDs() {
    this.selectedAssetType = 1;
    var selectedIDs = [];
    let isAssetSelected: boolean = false;
    let isAssetTypeSelected: boolean = false;
    for (var index = 0; index < this.bubbles.length; index++) {
      let currentAsset = this.bubbles[index];
      if (currentAsset.type == "asset") {
        selectedIDs.push(currentAsset.id);
        isAssetSelected = true;
      } else {
        var selectedAssetType = this.assets.filter(
          p => p.ID == currentAsset.id
        );
        if (selectedAssetType.length != 0) {
          selectedAssetType[0].assets.forEach(element => {
            selectedIDs.push(element.ID);
          });
          isAssetTypeSelected = true;
        }
      }
      if (isAssetTypeSelected) this.selectedAssetType = 1;
      if (isAssetSelected) this.selectedAssetType = 2;
      if (isAssetSelected && isAssetTypeSelected) this.selectedAssetType = 3;
    }
    return selectedIDs;
  }

  getSelectedAssetNames() {
    var selectedAssetName = "";
    for (var index = 0; index < this.bubbles.length; index++) {
      let currentSite = this.bubbles[index];
      selectedAssetName += currentSite.value + ",";
    }
    return selectedAssetName.slice(0, -1);
  }

  deletAsset(name, type, value) {
    this.assetprohelperService
      .DeleteMethod("Configuration/Assettype?Id=" + value.ID)
      .subscribe(data => {
        let body: any = JSON.parse(data["_body"]);
        if (body.Status == true) {
          this.toastr.success("Asset Deleted Successfully", "Success!");
          this.GetAssetsList();
        } else {
          this.toastr.warning(body.Message, "Warning");
        }
      });
  }
}
