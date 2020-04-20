import { UserMenuService } from './../../share/services/usermenu.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService, public usermenu: UserMenuService,
    private _router: Router
  ) {
  }
  showPage = true;
  companyEnable: boolean = false;
  vendorEnable: boolean = false;
  stockEnable: boolean = false;
  ngOnInit() {
    this.menuserviceSubscription = this.usermenu.menuModel$.subscribe(data => {
      this.companyEnable = false;
      this.vendorEnable = false;
      this.stockEnable = false;
      if (Object.keys(data).length != 0) {
        data.filter(row => {
          if (row.MenuName == "Admin") {
            if (row.ScreenName == "Company") {
              this.companyEnable = true;
            }
            else if (row.ScreenName == "Vendors") {
              this.vendorEnable = true;
            }
            else if (row.ScreenName == "Stock Page") {
              this.stockEnable = true;
            }
          }
        });
        if (!this.companyEnable && !this.vendorEnable && !this.stockEnable) {
          this._router.navigate(['/home/pagemap']);
          return;
        }
        if (!this.companyEnable && this.vendorEnable) {
          this.udmenu = 'VENDORS'
        } else if (!this.vendorEnable && this.stockEnable) {
          this.udmenu = 'STOCK PAGE'
        }
      } else {
       
        this._router.navigate(['/home/pagemap']);
      }
    });
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('role') != 'SiteAdmin') {
        this.showPage = true;
      } else {
        this.showPage = false;
        return;
      }
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');

      } else {
        this.siteId = '';
        this.toastr.warning("Single Site is  Mandatory", "Warning");
        return;
      }
    });

  }
  siteName: string;
  siteId: string;
  private serviceSubscription: Subscription;
  private menuserviceSubscription: Subscription;
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
    this.menuserviceSubscription.unsubscribe();
  }
  udmenu: string = 'COMPANY'
  tabChange(val) {
    this.udmenu = val;
  }
}
