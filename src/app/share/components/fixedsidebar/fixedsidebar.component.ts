import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserMenuService } from '../../services/usermenu.service';
import { Subscription } from 'rxjs';
import { Menu } from './menu';

@Component({
  selector: 'app-fixedsidebar',
  templateUrl: './fixedsidebar.component.html',
  styleUrls: ['./fixedsidebar.component.css']
})
export class FixedsidebarComponent implements OnInit, OnDestroy {

  constructor(private usermenu: UserMenuService) {

  }
  private serviceSubscription: Subscription;
  model = new Menu();
  ngOnInit() {
    this.serviceSubscription = this.usermenu.menuModel$.subscribe(data => {
      this.model = new Menu();
      if (Object.keys(data).length != 0) {
         data.filter(row => {
          if (row.MenuName == "Dashboard") {
            this.model.dashboard=true;
          }
          else if (row.MenuName == "Asset") {
            this.model.asset=true;
          }
          else if (row.MenuName =="User Directory") {
            this.model.userDirectory=true;
          }
          else if (row.MenuName =="Tracker") {
            this.model.tracker=true;
          }
          else if (row.MenuName =="Reports") {
            this.model.reports=true;
          }
          else if (row.MenuName == "Messaging") {
            this.model.messaging=true;
          }
          else if (row.MenuName == "Notification") {
            this.model.notification=true;
          }
          else if (row.MenuName =="Configuration") {
            this.model.configuration=true;
          }
          else if (row.MenuName =="Admin") {
            this.model.admin=true;
          }
        }); 
      } 
    });
  }

  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
}
