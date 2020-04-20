import { Menu } from './../fixedsidebar/menu';
import { Component, OnInit, ElementRef, ViewChild, Inject, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { AssetprohelperService } from '../../services/assetprohelper.service';
import { ToastrService } from 'ngx-toastr';
import { UserIdleService } from 'angular-user-idle';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { UserMenuService } from '../../services/usermenu.service';
import { Subscription } from 'rxjs';
import { Location } from "@angular/common";
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
@Component({
  selector: 'app-fixedmenubar',
  templateUrl: './fixedmenubar.component.html',
  styleUrls: ['./fixedmenubar.component.css']
})
export class FixedmenubarComponent implements OnInit, OnDestroy {
  @ViewChild('myDiv') myDiv: ElementRef;
  private menuserviceSubscription: Subscription;
  private siteAction: Subscription;
  private siteUpdate: Subscription;
  private siteCallClose: Subscription;
  model = new Menu();
  loader = false;
  path: any=''
  siteSelected: any
  assetPath: boolean=false;
  constructor(location: Location, private userIdle: UserIdleService, private _router: Router, private assetprohelperService: AssetprohelperService, private toastr: ToastrService,
    public dialog: MatDialog,private usermenu:UserMenuService,private router: Router) {
    router.events.subscribe(val => {
      this.path=location.path()
        if(this.path!='/home/asset'){
          this.assetPath=false
        }
       if(this.path=='/home/asset' && this.selectdropdownitem=='All Sites'){
         this.assetPath=true
       }
       else{
         this.assetPath=false
       }
    });
    this.getuserprofile();
    this.getuserSites();
    this.menuserviceSubscription = this.usermenu.menuModel$.subscribe(data => {
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
      } else {
        this.model = new Menu();
      }
    });
    this.siteAction = this.assetprohelperService.SiteAction$.subscribe((data) => {
      //  this.siteSelected=localStorage.getItem('sitename')
        
      if(data.Name!=undefined){
        this.subjectLoaded=true;
      }
       if(this.path=='/home/asset' && data.Name=='All Sites'){
         this.assetPath=true
       }
       else{
         this.assetPath=false
       }
      if (localStorage.getItem('sitename') == undefined || localStorage.getItem('sitename') == null)
        this.selectdropdownitem = 'All sites';
      else
        this.selectdropdownitem = localStorage.getItem('sitename');
    })
    this.siteUpdate = this.assetprohelperService.SiteUpdate$.subscribe((data) => {
      if(data){
        this.subjectLoaded=false;
        this.getuserSites();
      }
    })
    this.serviceSubscription = this.assetprohelperService.SiteDefault$.subscribe(data=>{
      if(data){
        for (var i = 0; i < this.usersites.length; i++) {
          if (this.usersites[i].Name == "All Sites") {
            this.SelectSiteMenu(this.usersites[i]);
            this._router.navigate(['/home/pagemap']);
          }
        }
      }
    });
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loader = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loader = false;
          break;
        }
        default: {
          break;
        }
      }
    });
    this.siteCallClose = this.assetprohelperService.SiteCall$.subscribe((data) => {
      if(data!=false){
        this.callAgain(data);
      }
    });
  }
  private serviceSubscription: Subscription;
  
  public href: string = "";
  dailogOpen: boolean = false;
  dialogRef;
  intervel
  ngOnDestroy(): void {
    clearInterval(this.intervel);
    this.menuserviceSubscription.unsubscribe();
    this.serviceSubscription.unsubscribe();
    this.siteAction.unsubscribe();
    this.siteUpdate.unsubscribe();
    this.siteCallClose.unsubscribe();
  }
  impactAlarmPopup() {

    this.dailogOpen = true;
    if (this.dialogRef != undefined) return;
   // let popupHeight='55%';
   // let wiDth='30%'
    if(screen.availWidth>=1920){
     // popupHeight='36%',
    //  wiDth='22%'
    }else if(screen.availWidth==1440){
     // popupHeight='42%',
   //   wiDth='28%'
    }
    else if(screen.availWidth==1280){
      //popupHeight='60%';
    }
    else if(screen.availWidth>1800){
     // popupHeight='39%',
    //  wiDth='22%'
    }
    this.dialogRef = this.dialog.open(ImpactAlarm, {
      panelClass: 'custom-dialog-container',
      data: {},
     // height: popupHeight,
     // width: wiDth,
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(a => {
      this.dialogRef = undefined
    })
  }
  subjectLoaded=false;
  ngOnInit() {
    // this.siteSelected=localStorage.getItem('sitename')
    // if(this.path=='/home/asset' && this.siteSelected=='All Sites'){
    //   this.assetPath=true
    // }
    // else{
    //   this.assetPath=false
    // }
    let parent = this;
    this.intervel = window.setInterval(function () {
      if (parent.dialog.openDialogs.length != 0) return;
      parent.dailogOpen = true;
       //parent.impactAlarmPopup();

    }, 300000);

    this.href = this._router.url;
    this.userIdle.startWatching();
    this.userIdle.onTimeout().subscribe(() =>
      this.logout());
  }

  public disabled = false;
  selectdropdownitem: any = 'All sites';
  public userdetails: any = [];
  public usersites: any = {};


  SelectSiteMenu(site) {

    this.selectdropdownitem = site.Name;
    localStorage.setItem('selectitemId', site.SiteID);
    localStorage.setItem('siteLat', site.SiteLat);
    localStorage.setItem('siteLng', site.SiteLong);
    localStorage.setItem('sitename', site.Name);
    localStorage.setItem('siteUnique',site.UniqueID)
    this.assetprohelperService.ChangeDefaultSite(site);
  }

  logout() {

    this.assetprohelperService.logout();
    this.toastr.success("Successfully logout", 'Success!');
    this._router.navigate(['']);



  }
  logoutToken(){
    this.assetprohelperService.GetMethod('Account/TrackerLogout').subscribe(
      data => {
        var body = JSON.parse(data['_body']);
        if (body.Status) {
          this.assetprohelperService.logout();
          this.toastr.success("Successfully logout", 'Success!');
          if(body.Data!=null && body.Data!='' && body.Data!=undefined && body.Data.length!=0){
            window.location.href=body.Data[0].ReturnUrl;
          }else{
           this._router.navigate(['']);
          }
        }
        else {
          this.toastr.error(body.Message, 'Error!');
        }
      });
  }
  @Output() valueChange = new EventEmitter();
  getuserprofile() {
    let url = 'Account/userProfile';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => { 
        let body: any = JSON.parse(data['_body']);
        this.userdetails = body.Data;
        this.usermenu.changeModel(body.Data.ScreenJson);
        //this.valueChange.emit(body.Data);
        localStorage.setItem('role', this.userdetails.Role);
      })
  }

  getuserSites() {
    let url = 'Account/UserSites';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.usersites = body.Data;
         //if(this.selectdropdownitem != 'All sites'){
        //}
        for (var i = 0; i < this.usersites.length; i++) {
          if (this.usersites[i].SiteID == localStorage.getItem('selectitemId')) {
            this.selectdropdownitem = this.usersites[i].Name;
          }
        }
       for (var i = 0; i < this.usersites.length; i++) {
          if (this.usersites[i].Name == localStorage.getItem('sitename')) {
          localStorage.setItem('siteLat', this.usersites[i].SiteLat);
          localStorage.setItem('siteLng', this.usersites[i].SiteLong);
          localStorage.setItem('siteUnique',this.usersites[i].UniqueID)
            if(!this.subjectLoaded){
              this.assetprohelperService.ChangeDefaultSite(this.usersites[i]);
            }
          }
        } 
        if (this.usersites == undefined || this.usersites.length == 0) {
          this.disabled = true;
        }else{
          
        }
        this.assetprohelperService.updateSite(false)
      })
  }

  public isIfopen: any = false;
  openHelpcontainer() {
    this.isIfopen = !this.isIfopen;
    document.body.style.overflowY="scroll";
    document.getElementById("help-container").style.paddingLeft = "0";
    if (!this.isIfopen) {
      document.getElementById("help-container").style.width = "0";
      document.getElementById("sideScreen").style.width = "0";
      document.getElementById("help-container").style.paddingLeft = "0";
    }
   if (this.isIfopen) {
      document.getElementById("help-container").style.width = "52.57%";
      document.getElementById("sideScreen").style.width = "100%";
      document.body.style.overflowY="hidden";
      document.getElementById("help-container").style.paddingLeft = "4.17%";
      // document.body.style['pointer-events'] = "none";
    }
   
  }
  callAgain(id){
    for (var i = 0; i < this.usersites.length; i++) {
      if (this.usersites[i].SiteID == id) {
      localStorage.setItem('selectitemId', this.usersites[i].SiteID);
      localStorage.setItem('siteLat', this.usersites[i].SiteLat);
      localStorage.setItem('siteLng', this.usersites[i].SiteLong);
      localStorage.setItem('sitename', this.usersites[i].Name);
      localStorage.setItem('siteUnique',this.usersites[i].UniqueID)
      this.assetprohelperService.ChangeDefaultSite(this.usersites[i])
      }
    }
  }
  closeHelpcontainer() {
    document.getElementById("help-container").style.width = "0";
    document.getElementById("sideScreen").style.width = "0";
    document.body.style.overflowY="scroll"
    document.getElementById("help-container").style.paddingLeft = "0";
  }



  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }


  public sidebar: any = false;
  opensideBar() {
    this.sidebar = !this.sidebar;
    console.log(this.myDiv.nativeElement.innerHTML);
    if (!this.sidebar) {
      (<HTMLInputElement>document.getElementById("additional-bar")).style.width = "0";
    }
    if (this.sidebar) {
      this.myDiv.nativeElement.style.width = "60%";
      // (<HTMLInputElement>document.getElementById("additional-bar")).style.width = "52.57%";
    }
  }
}

@Component({
  selector: 'app-impactalarm',
  templateUrl: './impactalarm.component.html',
  styleUrls: ['./impactalarm.component.css'],
})
export class ImpactAlarm implements OnInit, AfterViewInit {

  constructor(public dialogRef: MatDialogRef<ImpactAlarm>, @Inject(MAT_DIALOG_DATA) public data: any, 
  private _router: Router) {

  }
  selected: string = '';
  onNoClick(): void {
    this.selected = '';
    this._router.navigate(['/home/notification']);
    this.dialogRef.close();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }
  msg = '';
  onSubmit() {
    if (this.selected != undefined && this.selected != '') {
      this.dialogRef.close();
    } else {
      this.msg = 'Please Choose any option'
    }
  }

}