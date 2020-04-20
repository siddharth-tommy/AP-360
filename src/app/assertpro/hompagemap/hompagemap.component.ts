import { Subscription } from 'rxjs';
import { UserMenuService } from './../../share/services/usermenu.service';
import { Menu } from './../../share/components/fixedsidebar/menu';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-hompagemap',
  templateUrl: './hompagemap.component.html',
  styleUrls: ['./hompagemap.component.css']
})
export class HompagemapComponent implements OnInit, OnDestroy {

  constructor(private _router: Router, public usermenu: UserMenuService) { }
  model = new Menu();
  private menuserviceSubscription: Subscription;
  ngOnInit() {
    this.menuserviceSubscription = this.usermenu.menuModel$.subscribe(data => {
      this.model = new Menu();
      if (Object.keys(data).length != 0) {
        data.filter(row => {
          if (row.MenuName == "Dashboard") {
            this.model.dashboard = true;
          }
          else if (row.MenuName == "Asset") {
            this.model.asset = true;
          }
          else if (row.MenuName == "User Directory") {
            this.model.userDirectory = true;
          }
          else if (row.MenuName == "Tracker") {
            this.model.tracker = true;
          }
          else if (row.MenuName == "Reports") {
            this.model.reports = true;
          }
          else if (row.MenuName == "Messaging") {
            this.model.messaging = true;
          }
          else if (row.MenuName == "Notification") {
            this.model.notification = true;
          }
          else if (row.MenuName == "Configuration") {
            this.model.configuration = true;
          }
          else if (row.MenuName == "Admin") {
            this.model.admin = true;
          }
        });
      } 
    });
  }
  ngOnDestroy(): void {
    this.menuserviceSubscription.unsubscribe();
  }
}
