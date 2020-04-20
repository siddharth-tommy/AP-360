import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AssetprohelperService } from '../../share/services/assetprohelper.service';
import { OperatorsPipe } from '../../share/pipe/operators.pipe';
import { AssetsPipe } from '../../share/pipe/assets.pipe';
import { AssetstypePipe } from '../../share/pipe/assetstype.pipe';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css'],
  providers: [AssetsPipe, AssetstypePipe]
})
export class TrackerComponent implements OnInit {
  IsShowfullimge
  activemenu: any = 'location';
  constructor(private assetprohelperService: AssetprohelperService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private _router: Router) { }
  public Isshowdashboard: boolean = true;
  public showfullrckingmanu: any = false;
  public Isshowfullscreen: boolean = false;
  @ViewChild('lgModal') lgModal;
  private siteActionSubscription: Subscription;
  private mapValueSubscription: Subscription;
  private fullScreenSubscription: Subscription;
  private showDashbaordSubscription: Subscription;
  ngOnInit() {
    localStorage.removeItem('trackingtype')
    this.fullScreenSubscription = this.assetprohelperService.fullscreen$.subscribe((data) => {
      this.Isshowfullscreen = data;
      this.assetprohelperService.menuHide(data);
    });
    this.showDashbaordSubscription = this.assetprohelperService.showallTab$.subscribe((data) => {
      if (data != null && data != undefined && data.typeCancel == true)
        this.Isshowdashboard = true;
    });
    this.mapValueSubscription = this.assetprohelperService.mapvalue$.subscribe((data) => {
      if (data.typeCancel == true) {
        this.Isshowdashboard = data.IsshowDashboard;
        return;
      }
      if (data.IsshowDashboard == false) {
        //  this.lgModal.hide();
      }

      if (data.IsshowDashboard != undefined) {
        this.Isshowdashboard = data.IsshowDashboard;
      }
      else if (data.IsshowDashboard) {

        this.Isshowdashboard = data.IsshowDashboard;

      }
      else {
        //this.lgModal.hide();
      }



    })

    let data = {
      'prmarymenutype': 'location',
      'submenutype': 'asset',
      'maptype': 'markerwithgeofence',
      'coordinates': ''
    }

    if (localStorage.getItem('sitename') == 'All Sites') {
      this.assetprohelperService.ChangeMapActon(data);
    }

    this.siteActionSubscription = this.assetprohelperService.SiteAction$.subscribe((data) => {
       if (data.TrackAssets != undefined && data.TrackAssets != 'Y') {
         this.toastr.warning("Track Asset Not Enabled", "Warning");
         this._router.navigate(['/home/pagemap']);
         return;
       }
      // let check=true;
      // if (data) {
      //   if (data.ServiceAndProduct.length > 0) {
      //     for (let i = 0; i < data.ServiceAndProduct.length; i++) {
      //       if (data.ServiceAndProduct[i].Status == 'Y') {
      //         if (data.ServiceAndProduct[i].UniqueKey == 'TRACKASSETS') {
      //           check=false;
      //         }
      //       }
      //     }
      //   }
      //   if(check){
      //     this.toastr.warning("Track Asset Not Enabled", "Warning");
      //     this._router.navigate(['/home/pagemap']);
      //     return;
      //   }
      // }
      localStorage.setItem('trackingtype', "location");
      if (localStorage.getItem('sitename') != 'All Sites') {
        this.activemenu = "location";
      }
      if (localStorage.getItem('sitename') != 'All Sites' && localStorage.getItem('sitename') != null && localStorage.getItem('sitename') != "")
        this.showfullrckingmanu = true;
      else {
        this.showfullrckingmanu = false;
      }

    })

    // this.assetprohelperService.SiteAction$.subscribe(() => {
    //   if (localStorage.getItem('sitename') != 'All Sites') {
    //     this.activemenu = "location";
    //     this.showfullrckingmanu = true;
    //   }
    //   else {
    //     this.showfullrckingmanu = false;
    //   }
    //   if (localStorage.getItem('sitename') == null || localStorage.getItem('sitename') == "")
    //     this.showfullrckingmanu = false;
    // })
  }
  ngOnDestroy() {
    try {
      this.assetprohelperService.menuHide(false);
      this.siteActionSubscription.unsubscribe();
      this.mapValueSubscription.unsubscribe();
      this.fullScreenSubscription.unsubscribe();
      this.showDashbaordSubscription.unsubscribe();
    } catch (e) {
      console.log(e);
    }
  }
  menuactivemanger(menu) {
    let data = {
      'prmarymenutype': 'clear',
      'submenutype': null,
      'maptype': null,
      'coordinates': []
    }

    if (menu != this.activemenu) {
      this.assetprohelperService.ChangeMapActon(data);
      this.activemenu = menu;
      localStorage.setItem('trackingtype', menu);
    }
  }
}
