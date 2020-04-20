import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { AssetprohelperService } from "src/app/share/services/assetprohelper.service";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "singlesite-component",
  templateUrl: "./singlesite.component.html",
  styleUrls: ["./singlesite.component.css"]
})
export class SinglesiteComponent implements OnInit, OnDestroy {
  constructor(private assetprohelperService: AssetprohelperService) {}
  @Input() header = "PICK LOCATION";
  @Output() siteChangeEvent = new EventEmitter();
  loader: boolean;
  searchText
  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(
      () => {
        let siteName = localStorage.getItem("sitename");
        if (
          localStorage.getItem("selectitemId") != null &&
          localStorage.getItem("selectitemId") != "null"
        ) {
          var selectedSite = this.usersites.filter(
            p => p.SiteID == localStorage.getItem("selectitemId")
          );
          if (selectedSite.length != 0) {
            this.SelectSite(selectedSite[0].Name, selectedSite[0]);
          }
        } else {
          return;
        }
      }
    );
    this.getuserSites();
  }
  private serviceSubscription: Subscription;

  public usersites: any = [];
  getuserSites() {
    let url = "Account/UserSites";
    this.assetprohelperService.GetMethod(url).subscribe(data => {
      let body: any = JSON.parse(data["_body"]);
      this.usersites = body.Data;
      if (localStorage.getItem("sitename") != "All Sites") {
        if (localStorage.getItem("selectitemId")) {
          var selectedSite = this.usersites.filter(
            p => p.SiteID == localStorage.getItem("selectitemId")
          );
          if (selectedSite.length != 0)
            this.SelectSite(selectedSite[0].Name, selectedSite[0]);
        }
      } else {
        this.SelectAllAsset();
      }
    });
  }

  bubbles = [];
  SelectSite(siteName, selectedSite) {
    if (this.getAvailablesiteCount() == this.bubbles.length) {
      this.bubbles = [];
      this.isAllSiteSelected = false;
    }
    var isExist = this.bubbles.filter(p => p.value == siteName);
    if (isExist.length == 0)
      this.bubbles.push({ id: selectedSite.SiteID, value: siteName });
    if (this.getAvailablesiteCount() == this.bubbles.length)
      this.isAllSiteSelected = true;
    this.siteChangeEvent.emit();
  }

  isAllSiteSelected = false;
  SelectAllAsset() {
    if (!this.isAllSiteSelected) {
      this.searchText='';
      this.bubbles = [];
      for (var index = 0; index < this.usersites.length; index++) {
        let currentSite = this.usersites[index];
        if (currentSite.Name != "All Sites")
          this.bubbles.push({
            id: currentSite.SiteID,
            value: currentSite.Name
          });
      }
      this.isAllSiteSelected = true;
      this.siteChangeEvent.emit();
    }
  }

  getSelectedSiteIDs() {
    var selectedIDs = [];
    for (var index = 0; index < this.bubbles.length; index++) {
      let currentSite = this.bubbles[index];
      selectedIDs.push(currentSite.id);
    }
    return selectedIDs;
  }

  getSelectedSiteNames() {
    var selectedSiteName = "";
    for (var index = 0; index < this.bubbles.length; index++) {
      let currentSite = this.bubbles[index];
      selectedSiteName += currentSite.value + ",";
    }
    selectedSiteName = selectedSiteName.slice(0, -1);
    return selectedSiteName;
  }

  getAvailablesiteCount() {
    let availableSiteCount = 0;
    for (var index = 0; index < this.usersites.length; index++) {
      let currentSite = this.usersites[index];
      if (currentSite.Name != "All Sites") {
        availableSiteCount++;
      }
    }
    return availableSiteCount;
  }

  RemoveSite(selectedIndex) {
    this.bubbles.splice(selectedIndex, 1);
    this.siteChangeEvent.emit();
  }

  RemoveAllSite() {
    this.bubbles = [];
    this.isAllSiteSelected = false;
    this.siteChangeEvent.emit();
  }

  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
}
