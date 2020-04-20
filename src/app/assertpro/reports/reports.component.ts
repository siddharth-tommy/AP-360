import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs/internal/Subscription";
import { AssetprohelperService } from "src/app/share/services/assetprohelper.service";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"]
})
export class ReportsComponent implements OnInit, AfterViewInit {
  installDate: Date = new Date();
  loader: boolean = false;
  siteName: string;
  serviceSubscription: Subscription;
  constructor(
    private toastr: ToastrService,
    public assetprohelperService: AssetprohelperService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(
    //   () => {
    //     this.siteName = localStorage.getItem("sitename");
    //     if (this.siteName == "All Sites")
    //       this.toastr.warning("Single Site is  Mandatory", "Warning");
    //   }
    // );
  }

  reportmenu: string = "USAGE";
  tabChange(val) {
    this.reportmenu = val;
  }
}
