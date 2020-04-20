import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { RoleModel } from '../rolemodel';
import { MatDialog } from '@angular/material';
import { CommonDailog } from '../../common/commondailog/commondailog.component';
@Component({
  selector: 'accesslevel-component',
  templateUrl: './accesslevel.component.html',
  styleUrls: ['./accesslevel.component.css']
})
export class AccesslevelComponent implements OnInit {
  @ViewChild('side') side: ElementRef;
  @ViewChild('myDiv') myDiv: ElementRef;
  v1 = true;
  v2 = true;
  v3 = true;
  v4 = true;
  v5 = true;
  v6 = true;
  v7 = true;
  v8 = true;
  v9 = true;
  // Mat Tab 2
  v21 = true;
  v22 = true;
  v23 = true;
  v24 = true;
  v25 = true;
  v26 = true;
  v27 = true;
  v28 = true;
  v29 = true;
  // Mat Tab 3
  v31 = true;
  v32 = true;
  v33 = true;
  v34 = true;
  v35 = true;
  v36 = true;
  v37 = true;
  v38 = true;
  v39 = true;

  // Mat Tab 4
  v41 = true;
  v42 = true;
  v43 = true;
  v44 = true;
  v45 = true;
  v46 = true;
  v47 = true;
  v48 = true;
  v49 = true;
  tabIndex = 0;
  sidebarActive(info) {
    this.editEnabled = false;
    this.acgEdit = true;
    this.corAdminEdit = true;
    this.siteAdminEdit = true;
    this.roleAccessEdit = true;
    //  this.sidebarmenu=info;
    if (info == 1) {
      this.userTypes.filter(row => {
        if (row.Name == "CompanyAdmin") {
          this.userRols(row.ID);
        }
      })
    } else if (info == 2) {
      this.userTypes.filter(row => {
        if (row.Name == "SiteAdmin") {
          this.userRols(row.ID);
        }
      })
    } else if (info == 3) {
      this.userTypes.filter(row => {
        if (row.Name == "FleetSupervisor") {
          this.userRols(row.ID);
        }
      })
    } else {
      this.userTypes.filter(row => {
        if (row.Name == "AcgAdmin") {
          this.userRols(row.ID);
        }
      })
    }
  }
  model = new RoleModel();
  constructor(private toastr: ToastrService, private assetprohelperService: AssetprohelperService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getuserSites();
    this.userType();

  }
  asset: boolean = true;
  tabChange(value) {
    this.asset = value;
    this.editEnabled = false;
  }
  public sidebar: any = false;
  opensideBar() {
    this.userTypes.filter(row => {
      if (row.Name == "AcgAdmin") {
        this.userRols(row.ID);
      }
    })
    this.sidebar = !this.sidebar;
    this.asset = true;
    this.tabIndex = 0;
    this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    document.body.style.overflowY="hidden";
    this.side.nativeElement.style.width = "100%";
    if (screen.availWidth >= 1920) {
      this.myDiv.nativeElement.style.width = "50%";
    } else
      this.myDiv.nativeElement.style.width = "55%";
    this.editEnabled = false;
    this.acgEdit = true;
    this.corAdminEdit = true;
    this.siteAdminEdit = true;
    this.roleAccessEdit = true;
  }
  confirmBack() {
    let subdialogRef = this.dialog.open(CommonDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    let parent = this;
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        parent.closeHelpcontainer();
      }
    })
  }
  closeHelpcontainer() {
    this.asset = false;
    this.acgEdit = true;
    this.editEnabled = false;
    this.corAdminEdit = true;
    this.siteAdminEdit = true;
    this.roleAccessEdit = true;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.paddingLeft = "0";
    document.body.style.overflowY="auto";
  }
  editEnabled: boolean = false;
  acgEdit: boolean = true;
  onEditClilck() {
    this.editEnabled = true;

  }
  onAcgAdminEdit() {
    this.acgEdit = false;
    this.editEnabled = true;
  }
  onAcgAdminSave() {
    this.acgEdit = true;
    //this.save();
    this.saveRole();
  }
  rolebaseReset() {
    if (this.tabIndex == 1) {
      this.userTypes.filter(row => {
        if (row.Name == "CompanyAdmin") {
          this.userRols(row.ID);
        }
      })
    } else if (this.tabIndex == 2) {
      this.userTypes.filter(row => {
        if (row.Name == "SiteAdmin") {
          this.userRols(row.ID);
        }
      })

    } else if (this.tabIndex == 3) {
      this.userTypes.filter(row => {
        if (row.Name == "FleetSupervisor") {
          this.userRols(row.ID);
        }
      })
    }
    else {
      this.userTypes.filter(row => {
        if (row.Name == "AcgAdmin") {
          this.userRols(row.ID);
        }
      })
    }
  }
  onResetAcgAdmin() {
    this.v1 = true;
    this.v2 = true;
    this.v3 = true;
    this.v4 = true;
    this.v5 = true;
    this.v6 = true;
    this.v7 = true;
    this.v8 = true;
    this.v9 = true;
    this.rolebaseReset()
  }
  corAdminEdit: boolean = true;
  onCorAdminEdit() {
    this.corAdminEdit = false;
    this.editEnabled = true;
  }
  onCodminSave() {
    this.corAdminEdit = true;
    // this.save();
    this.saveRole();
  }
  onCorAdminReset() {
    this.v21 = true;
    this.v22 = true;
    this.v23 = true;
    this.v24 = true;
    this.v25 = true;
    this.v26 = true;
    this.v27 = true;
    this.v28 = true;
    this.v29 = true;
    this.rolebaseReset()
  }
  siteAdminEdit: boolean = true;
  onSiteAdminEdit() {
    this.siteAdminEdit = false;
    this.editEnabled = true;
  }
  onSiteAminSave() {
    this.siteAdminEdit = true;
    //this.save();
    this.saveRole();
  }
  onSiteAdminReset() {
    this.v31 = true;
    this.v32 = true;
    this.v33 = true;
    this.v34 = true;
    this.v35 = true;
    this.v36 = true;
    this.v37 = true;
    this.v38 = true;
    this.v39 = true;
    this.rolebaseReset()
  }
  roleAccessEdit: boolean = true;
  onRoleAccessEdit() {
    this.roleAccessEdit = false;
    this.editEnabled = true;
  }
  onRoleAccessave() {
    this.roleAccessEdit = true;
    //this.save();
    this.saveRole();
  }
  onRoleAccessReset() {
    this.v41 = true;
    this.v42 = true;
    this.v43 = true;
    this.v44 = true;
    this.v45 = true;
    this.v46 = true;
    this.v47 = true;
    this.v48 = true;
    this.v49 = true;
    this.rolebaseReset()
  }

  cancelEdit() {
    this.editEnabled = false;
  }
  save() {
    this.editEnabled = false;
    this.toastr.success("Updated Successfully", 'Success!');
  }
  editHomeEnabled: boolean = false;
  editHome() {
    this.editHomeEnabled = true;
  }
  cancelHomeEdit() {
    this.editHomeEnabled = false;
  }
  saveHome() {
    this.editHomeEnabled = false;
    this.toastr.success("Updated Successfully", 'Success!');
  }
  disabled: boolean = false;
  usersites = []
  selectdropdownitem: string = '';
  getuserSites() {
    let url = 'Account/UserSites';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.usersites = body.Data;
        // if(this.selectdropdownitem != 'All sites'){

        // }
        for (var i = 0; i < this.usersites.length; i++) {
          if (this.usersites[i].SiteID == localStorage.getItem('selectitemId')) {
            this.selectdropdownitem = this.usersites[i].Name;
          }
        }
        if (this.usersites.length == 0) {
          this.disabled = true;
        }
      })
  }
  saveRole() {
    try {
      let showIds = []
      let hideIds = []
      if (this.model.dashboard) { showIds.push(this.model.dashboardId) } else { hideIds.push(this.model.dashboardId) }
      if (this.model.asset) {
        showIds.push(this.model.equipmentId)
        showIds.push(this.model.batteriesId)
        showIds.push(this.model.chargesId)
        showIds.push(this.model.gatewaysId)
      } else {
        hideIds.push(this.model.equipmentId)
        hideIds.push(this.model.batteriesId)
        hideIds.push(this.model.chargesId)
        hideIds.push(this.model.gatewaysId)
      }
      if (this.tabIndex != 3) {
        if (this.model.userDirectory) {
          showIds.push(this.model.operatorId)
          showIds.push(this.model.webUserId)
        } else {
          hideIds.push(this.model.operatorId)
          hideIds.push(this.model.webUserId)
        }
      }
      if (this.model.tracker) { showIds.push(this.model.trackerId) } else { hideIds.push(this.model.trackerId) }
      if (this.model.reports) { showIds.push(this.model.reportsId) } else { hideIds.push(this.model.reportsId) }
      if (this.model.messaging) { showIds.push(this.model.messagingId) } else { hideIds.push(this.model.messagingId) }
      if (this.model.notification) {
        showIds.push(this.model.alarmAlertId)
        showIds.push(this.model.incidentId)
      }
      else {
        hideIds.push(this.model.alarmAlertId)
        hideIds.push(this.model.incidentId)
      }
      if (this.tabIndex != 3) {
        if (this.model.configuration) {
          showIds.push(this.model.assetTypeId)
          showIds.push(this.model.checkListId)
          if (this.tabIndex != 1 && this.tabIndex != 2) {
            showIds.push(this.model.comserverId)
            showIds.push(this.model.debugId)
          }
        } else {
          hideIds.push(this.model.assetTypeId)
          hideIds.push(this.model.checkListId)
          if (this.tabIndex != 1 && this.tabIndex != 2) {
            hideIds.push(this.model.comserverId)
            hideIds.push(this.model.debugId)
          }
        }
      }

      if (this.tabIndex != 3 && this.tabIndex != 2) {
        if (this.model.admin) {
          showIds.push(this.model.companyId)
          showIds.push(this.model.vendortypeId)
          showIds.push(this.model.stockpageId)
        } else {
          hideIds.push(this.model.companyId)
          hideIds.push(this.model.vendortypeId)
          hideIds.push(this.model.stockpageId)
        }
      }
      this.assetprohelperService.PostMethod("UsersDirectory/UpdateUserRoleScreens", { "ShowIds": showIds, 'HideIds': hideIds }).subscribe(response => {
        try {
          let body = response.json();
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!');
            this.closeHelpcontainer();
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  userRolsData = []
  userRols(id) {
    try {
      this.model = new RoleModel();
      this.userRolsData = []
      this.assetprohelperService.PostMethod("UsersDirectory/GetUserRoleScreens", { "Role": id }).subscribe(response => {
        try {
          let body = response.json();
          if (body.Status) {
            this.userRolsData = body.Data
            this.userRolsData.filter(row => {
              if (row.MenuName == "Dashboard") {
                if (row.IsEnabled == 'Y') {
                  this.model.dashboard = true;
                }
                this.model.dashboardId = row.WebUserRoleScreens_ID
              }
              else if (row.MenuName == "Asset") {
                this.model.assetId = row.WebUserRoleScreens_ID;
                if (row.ScreenName == "Equipment") {
                  if (row.IsEnabled == 'Y') {
                    this.model.equipment = true
                  }
                  this.model.equipmentId = row.WebUserRoleScreens_ID
                }
                else if (row.ScreenName == "Batteries") {
                  if (row.IsEnabled == 'Y') {
                    this.model.batteries = true
                  }
                  this.model.batteriesId = row.WebUserRoleScreens_ID
                }
                else if (row.ScreenName == "Chargers") {
                  if (row.IsEnabled == 'Y') {
                    this.model.charges = true
                  }
                  this.model.chargesId = row.WebUserRoleScreens_ID
                }
                else if (row.ScreenName == "Gateways") {
                  if (row.IsEnabled == 'Y') {
                    this.model.gateways = true;
                  }
                  this.model.gatewaysId = row.WebUserRoleScreens_ID
                }
                if (this.model.equipment && this.model.batteries && this.model.charges && this.model.gateways)
                  this.model.asset = true;
              }
              else if (row.MenuName == "User Directory") {

                this.model.userDirectoryId = row.WebUserRoleScreens_ID
                if (row.ScreenName == "Operators") {
                  if (row.IsEnabled == 'Y') {
                    this.model.operator = true
                  }
                  this.model.operatorId = row.WebUserRoleScreens_ID
                } else if (row.ScreenName == "WebUser") {
                  if (row.IsEnabled == 'Y') {
                    this.model.webUser = true
                  }
                  this.model.webUserId = row.WebUserRoleScreens_ID
                  if (this.model.operator && this.model.webUser) {
                    this.model.userDirectory = true;
                  }
                }
              }
              else if (row.MenuName == "Tracker") {
                if (row.IsEnabled == 'Y') {
                  this.model.tracker = true;
                }
                this.model.trackerId = row.WebUserRoleScreens_ID
              }
              else if (row.MenuName == "Reports") {
                if (row.IsEnabled == 'Y') {
                  this.model.reports = true;
                }
                this.model.reportsId = row.WebUserRoleScreens_ID
              }
              else if (row.MenuName == "Messaging") {
                if (row.IsEnabled == 'Y') {
                  this.model.messaging = true;
                }
                this.model.messagingId = row.WebUserRoleScreens_ID
              }
              else if (row.MenuName == "Notification") {
                if (row.ScreenName == "Alarms/Alerts") {
                  if (row.IsEnabled == 'Y') {
                    this.model.alarmAlert = true;
                  }
                  this.model.alarmAlertId = row.WebUserRoleScreens_ID
                }
                if (row.ScreenName == "Incidents") {
                  if (row.IsEnabled == 'Y') {
                    this.model.incident = true;
                  }
                  this.model.incidentId = row.WebUserRoleScreens_ID
                }
                if (this.model.alarmAlert && this.model.incident) {
                  this.model.notification = true;
                }
                this.model.notificationId = row.WebUserRoleScreens_ID
              }
              else if (row.MenuName == "Configuration") {
                if (row.ScreenName == "Asset Type") {
                  if (row.IsEnabled == 'Y') {
                    this.model.assetType = true
                  }
                  this.model.assetTypeId = row.WebUserRoleScreens_ID
                }
                else if (row.ScreenName == "Checklist") {
                  if (row.IsEnabled == 'Y') {
                    this.model.checkList = true;
                  }
                  this.model.checkListId = row.WebUserRoleScreens_ID
                }
                else if (row.ScreenName == "Debug") {
                  if (row.IsEnabled == 'Y') {
                    this.model.debug = true;
                  }
                  this.model.debugId = row.WebUserRoleScreens_ID
                }
                else if (row.ScreenName == "ComServer") {
                  if (row.IsEnabled == 'Y') {
                    this.model.comserver = true
                  }
                  this.model.comserverId = row.WebUserRoleScreens_ID
                }
                if (this.model.assetType && this.model.checkList && this.model.debug && this.model.comserver)
                  this.model.configuration = true;
                if (id == 0 || id == 1) {
                  if (this.model.assetType && this.model.checkList)
                    this.model.configuration = true;
                }
                this.model.configurationId = row.WebUserRoleScreens_ID
              }
              else if (row.MenuName == "Admin") {
                if (row.ScreenName == "Company") {
                  if (row.IsEnabled == 'Y') {
                    this.model.company = true;
                  }
                  this.model.companyId = row.WebUserRoleScreens_ID
                }
                else if (row.ScreenName == "Vendors") {
                  if (row.IsEnabled == 'Y') {
                    this.model.vendortype = true;
                  }
                  this.model.vendortypeId = row.WebUserRoleScreens_ID
                }
                else if (row.ScreenName == "Stock Page") {
                  if (row.IsEnabled == 'Y') {
                    this.model.stockpage = true;
                  }
                  this.model.stockpageId = row.WebUserRoleScreens_ID
                }
                if (this.model.company && this.model.vendortype && this.model.stockpage)
                  this.model.admin = true;

                this.model.adminId = row.WebUserRoleScreens_ID
              }
            });
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }
      })

    } catch (error) {
      console.log(error)
    }
  }
  userTypes = []
  userType() {
    try {

      this.userTypes = []
      this.assetprohelperService.GetMethod("UsersDirectory/GetAllUserRoles").subscribe(response => {
        try {
          let body = response.json();
          if (body.Status) {
            this.userTypes = body.Data
            this.userTypes.filter(row => {
              if (row.Name == "AcgAdmin") {
                this.userRols(row.ID);
              }
            })
          }
          else {
            this.toastr.warning(body.Message, "Warning")
          }
        }
        catch (apierror) {
          console.log(apierror)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

}