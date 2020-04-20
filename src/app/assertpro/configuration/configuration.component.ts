import { UserMenuService } from './../../share/services/usermenu.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, OnDestroy {

  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService, public usermenu: UserMenuService, private _router: Router) {
  }
  assetTypeEnable: boolean = false;
  checkListEnable: boolean = false;
  debugEnable: boolean = false;
  comserver: boolean = false;
  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');

      } else {
        this.siteId = '';
        this.toastr.warning("Single Site is  Mandatory", "Warning");
        return;
      }
    });
    this.menuserviceSubscription = this.usermenu.menuModel$.subscribe(data => {
      this.assetTypeEnable = false
      this.checkListEnable = false;
      this.debugEnable = false;
      this.comserver = false
      if (Object.keys(data).length != 0) {
        data.filter(row => {
          if (row.MenuName == "Configuration") {
            if (row.ScreenName == "Asset Type") {
              this.assetTypeEnable = true
            }
            else if (row.ScreenName == "Checklist") {
              this.checkListEnable = true;
            }
            else if (row.ScreenName == "Debug") {
              this.debugEnable = true;
            }
            else if (row.ScreenName == "ComServer") {
              this.comserver = true
            }
          }
        });
        if(!this.assetTypeEnable && !this.checkListEnable && !this.debugEnable && !this.comserver){
          this._router.navigate(['/home/pagemap']);
          return;
        }
        if(!this.assetTypeEnable && this.checkListEnable){
          this.udmenu='CHECKLIST'
        }else  if(!this.checkListEnable && this.debugEnable){
          this.udmenu='DEBUG'
        }else  if(!this.debugEnable && this.comserver){
          this.udmenu='COMSERVER'
        }

      } else {
        this._router.navigate(['/home/pagemap']);
       
      }
    });
  }
  siteName: string;
  siteId: string;
  private serviceSubscription: Subscription;
  private menuserviceSubscription: Subscription
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
    this.menuserviceSubscription.unsubscribe();

  }
  udmenu: string = 'ASSET TYPE'
  tabChange(val) {
    this.udmenu = val;
  }

}
