import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { RoleModel } from '../rolemodel';

@Component({
  selector: 'rolefunction-component',
  templateUrl: './rolefunction.component.html',
  styleUrls: ['./rolefunction.component.css']
})
export class RoleFunctionComponent implements OnInit {

  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('side') side: ElementRef;
  @Output() valueChange = new EventEmitter();
  datas: any;
  userList = ['Howard Webstar']
  roleList = ['ACG Admin']
  name: string = 'Howard Webstar';
  role: string = 'ACG Admin';
  model = new RoleModel();
  constructor(private toastr: ToastrService, private assetprohelperService: AssetprohelperService, ) {
  }

  ngOnInit() {
  }
  asset: boolean = true;
  tabChange(value) {
    this.asset = value;
  }
  public sidebar: any = false;
  createMode: boolean = false
  roleid;
  userId;
  opensideBar(data) {
    this.hide = false;
    this.adminHide = false;
    this.configHide = false;
    this.userdirectory = false;
    this.asset = true;
    this.editEnabled = false;
    this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    document.body.style.overflowY="hidden";
    this.side.nativeElement.style.width = "100%";
    this.myDiv.nativeElement.style.width = "60%";
    this.model = new RoleModel()
    this.createMode = data.mode
    this.roleid = data.roleId
    if (data.roleId == 0 || data.roleId == 1) {
      this.hide = true;
    }
    if (data.roleId == 1) {
      this.adminHide = true;
    }
    if (data.roleId == 2) {
      this.adminHide = true;
      this.configHide = true;
      this.userdirectory = true;
      this.hide = true;
    }
    if (data.mode) {
      this.userRols(data.roleId)
    } else {
      this.EditedRoles(data.roleId, data.id);
      this.userId = data.id
    }
    this.name = data.name
    this.role = data.role
  }
  closeHelpcontainer(data) {
    this.editMode = true;
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    this.valueChange.emit(data);
    this.myDiv.nativeElement.style.paddingLeft = "0";
    document.body.style.overflowY="auto";
  }
  close() {
    this.editMode = true;
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.paddingLeft = "0";
    document.body.style.overflowY="auto";
  }
  editEnabled: boolean = false;
  editMode: boolean = true;
  onEditClilck() {
    this.editMode = false;
    this.editEnabled = true;
    if (this.asset) {

    } else {

    }
  }
  cancelEdit() {
    
    document.body.style.overflowY="hidden";
    this.editEnabled = false;
    this.closeHelpcontainer({ createMode: this.createMode })
  }
  hide = false;
  adminHide = false;
  configHide = false;
  userdirectory = false;
  save() {
    this.editEnabled = false;
    let enableId = []
    let diableId = []

    if (this.createMode) {
      this.userRolsData.filter(row => {
        if (row.MenuName == "Dashboard") {
          if (this.model.dashboard) {
            enableId.push(row.ScreenSubModule_ID)
          } else {
            diableId.push(row.ScreenSubModule_ID)
          }
        }
        else if (row.MenuName == "Asset") {
          if (row.ScreenName == "Equipment") {

            if (this.model.equipment) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
          else if (row.ScreenName == "Batteries") {

            if (this.model.batteries) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
          else if (row.ScreenName == "Chargers") {

            if (this.model.charges) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
          else if (row.ScreenName == "Gateways") {

            if (this.model.gateways) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }

        }
        else if (this.roleid != 2 && row.MenuName == "User Directory") {
          if (row.ScreenName == "Operators") {
            if (this.model.operator) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          } else if (row.ScreenName == "WebUser") {

            if (this.model.webUser) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
        }
        else if (row.MenuName == "Tracker") {

          if (this.model.tracker) {
            enableId.push(row.ScreenSubModule_ID)
          } else {
            diableId.push(row.ScreenSubModule_ID)
          }
        }
        else if (row.MenuName == "Reports") {

          if (this.model.reports) {
            enableId.push(row.ScreenSubModule_ID)
          } else {
            diableId.push(row.ScreenSubModule_ID)
          }
        }
        else if (row.MenuName == "Messaging") {

          if (this.model.messaging) {
            enableId.push(row.ScreenSubModule_ID)
          } else {
            diableId.push(row.ScreenSubModule_ID)
          }
        }
        else if (row.MenuName == "Notification") {

          if (this.model.notification) {
            enableId.push(row.ScreenSubModule_ID)
          } else {
            diableId.push(row.ScreenSubModule_ID)
          }
        }
        else if (this.roleid != 2 && row.MenuName == "Configuration") {

          if (row.ScreenName == "Asset Type") {

            if (this.model.assetType) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
          else if (row.ScreenName == "Checklist") {
            //this.model.checkList = true;
            if (this.model.checkList) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
          if (this.roleid != 1 && this.roleid != 0) {
            if (row.ScreenName == "Debug") {

              if (this.model.debug) {
                enableId.push(row.ScreenSubModule_ID)
              } else {
                diableId.push(row.ScreenSubModule_ID)
              }
            }
            else if (row.ScreenName == "ComServer") {

              if (this.model.comserver) {
                enableId.push(row.ScreenSubModule_ID)
              } else {
                diableId.push(row.ScreenSubModule_ID)
              }
            }
          }
        }
        else if (this.roleid != 1 && this.roleid != 2 && row.MenuName == "Admin") {

          if (row.ScreenName == "Company") {

            if (this.model.company) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
          else if (row.ScreenName == "Vendors") {

            if (this.model.vendortype) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
          else if (row.ScreenName == "Stock Page") {

            if (this.model.stockpage) {
              enableId.push(row.ScreenSubModule_ID)
            } else {
              diableId.push(row.ScreenSubModule_ID)
            }
          }
        }
      });
    } else {
      this.userRolsData2.filter(row => {
        if (row.MenuName == "Dashboard") {
          if (this.model.dashboard) {
            enableId.push(row.WebUserScreens_ID)
          } else {
            diableId.push(row.WebUserScreens_ID)
          }
        }
        else if (row.MenuName == "Asset") {
          if (row.ScreenName == "Equipment") {

            if (this.model.equipment) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
          else if (row.ScreenName == "Batteries") {

            if (this.model.batteries) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
          else if (row.ScreenName == "Chargers") {

            if (this.model.charges) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
          else if (row.ScreenName == "Gateways") {

            if (this.model.gateways) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }

        }
        else if (row.MenuName == "User Directory") {
          if (row.ScreenName == "Operators") {
            if (this.model.operator) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          } else if (row.ScreenName == "WebUser") {

            if (this.model.webUser) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
        }
        else if (row.MenuName == "Tracker") {

          if (this.model.tracker) {
            enableId.push(row.WebUserScreens_ID)
          } else {
            diableId.push(row.WebUserScreens_ID)
          }
        }
        else if (row.MenuName == "Reports") {

          if (this.model.reports) {
            enableId.push(row.WebUserScreens_ID)
          } else {
            diableId.push(row.WebUserScreens_ID)
          }
        }
        else if (row.MenuName == "Messaging") {

          if (this.model.messaging) {
            enableId.push(row.WebUserScreens_ID)
          } else {
            diableId.push(row.WebUserScreens_ID)
          }
        }
        else if (row.MenuName == "Notification") {

          if (this.model.notification) {
            enableId.push(row.WebUserScreens_ID)
          } else {
            diableId.push(row.WebUserScreens_ID)
          }
        }
        else if (row.MenuName == "Configuration") {

          if (row.ScreenName == "Asset Type") {

            if (this.model.assetType) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
          else if (row.ScreenName == "Checklist") {

            if (this.model.checkList) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
          else if (row.ScreenName == "Debug") {

            if (this.model.debug) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
          else if (row.ScreenName == "ComServer") {

            if (this.model.comserver) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
        }
        else if (row.MenuName == "Admin") {

          if (row.ScreenName == "Company") {

            if (this.model.company) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
          else if (row.ScreenName == "Vendors") {

            if (this.model.vendortype) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
          else if (row.ScreenName == "Stock Page") {

            if (this.model.stockpage) {
              enableId.push(row.WebUserScreens_ID)
            } else {
              diableId.push(row.WebUserScreens_ID)
            }
          }
        }
      });
    }
    //this.toastr.success("Updated Successfully", 'Success!');
    this.closeHelpcontainer({ enableId: enableId, diableId: diableId, createMode: this.createMode })
  }
  editHomeEnabled: boolean = false;
  editHome() {
    this.editHomeEnabled = true;
  }
  resetEdit() {
    //this.model = new RoleModel()
    if (this.createMode) {
      this.userRols(this.roleid)
    } else {
      this.EditedRoles(this.roleid, this.userId);
    }
  }
  assetChange() {
    if (this.model.asset) {
      this.model.equipment = true;
      this.model.batteries = true;
      this.model.charges = true;
      this.model.gateways = true;
    } else {
      this.model.equipment = false;
      this.model.batteries = false;
      this.model.charges = false;
      this.model.gateways = false;
    }
  }
  asseChange() {
    if (this.model.equipment && this.model.batteries && this.model.charges && this.model.gateways) {
      this.model.asset = true;
    } else {
      this.model.asset = false;
    }
  }
  userDirectoryChange() {
    if (this.model.userDirectory) {
      this.model.operator = true;
      this.model.webUser = true;
    } else {
      this.model.operator = false;
      this.model.webUser = false;
    }
  }
  userDireChange() {
    if (this.model.operator && this.model.webUser) {
      this.model.userDirectory = true;
    } else {
      this.model.userDirectory = false;
    }
  }

  trackChange() {
    if (this.model.tracker) {

      this.model.location = true;
      this.model.history = true;
      this.model.geofence = true;
    } else {
      this.model.location = false;
      this.model.history = false;
      this.model.geofence = false;
    }
  }
  configurationChange() {
    if (this.model.configuration) {
      this.model.assetType = true;
      this.model.checkList = true;
      this.model.debug = true;
      this.model.comserver = true;
    } else {
      this.model.assetType = false;
      this.model.checkList = false;
      this.model.debug = false;
      this.model.comserver = false;
    }
  }
  configchange() {
    if (this.model.assetType && this.model.checkList && this.model.debug && this.model.comserver) {
      this.model.configuration = true;
    } else {
      this.model.configuration = false
    }
    if (this.roleid == 0 || this.roleid == 1) {
      if (this.model.assetType && this.model.checkList) {
        this.model.configuration = true;
      } else {
        this.model.configuration = false;
      }
    }
  }
  adminChange() {
    if (this.model.admin) {
      this.model.company = true;
      this.model.stockpage = true;
      this.model.vendortype = true;
    } else {
      this.model.company = false;
      this.model.stockpage = false;
      this.model.vendortype = false;
    }
  }
  admChange() {
    if (this.model.company && this.model.stockpage && this.model.vendortype) {
      this.model.admin = true;
    } else {
      this.model.admin = false;
    }
  }
  cancelHomeEdit() {
    this.editHomeEnabled = false;

  }
  saveHome() {
    this.editHomeEnabled = false;
    //this.toastr.success("Updated Successfully", 'Success!');
    this.closeHelpcontainer({ createMode: this.createMode })
  }
  disabled: boolean = false;

  userRolsData = []
  loader = false;
  userRols(id) {
    try {
      this.loader = true;
      this.model = new RoleModel();
      this.userRolsData = []
      this.assetprohelperService.PostMethod("UsersDirectory/GetUserRoleScreens", { "Role": id }).subscribe(response => {
        try {
          this.loader = false;
          let body = response.json();
          if (body.Status) {
            this.userRolsData = body.Data
            this.userRolsData.filter(row => {
              if (row.MenuName == "Dashboard" && row.IsEnabled == 'Y') {
                this.model.dashboard = true;
              }
              else if (row.MenuName == "Asset" && row.IsEnabled == 'Y') {
                if (row.ScreenName == "Equipment" && row.IsEnabled == 'Y') {
                  this.model.equipment = true
                }
                else if (row.ScreenName == "Batteries" && row.IsEnabled == 'Y') {
                  this.model.batteries = true
                }
                else if (row.ScreenName == "Chargers" && row.IsEnabled == 'Y') {
                  this.model.charges = true
                }
                else if (row.ScreenName == "Gateways" && row.IsEnabled == 'Y') {
                  this.model.gateways = true;
                }
                if (this.model.equipment && this.model.batteries && this.model.charges && this.model.gateways)
                  this.model.asset = true;
              }
              else if (row.MenuName == "User Directory") {

                if (row.ScreenName == "Operators" && row.IsEnabled == 'Y') {
                  this.model.operator = true
                } else if (row.ScreenName == "WebUser" && row.IsEnabled == 'Y') {
                  this.model.webUser = true
                }
                if (this.model.operator && this.model.webUser)
                  this.model.userDirectory = true;
              }
              else if (row.MenuName == "Tracker" && row.IsEnabled == 'Y') {
                this.model.tracker = true;
              }
              else if (row.MenuName == "Reports" && row.IsEnabled == 'Y') {
                this.model.reports = true;
              }
              else if (row.MenuName == "Messaging" && row.IsEnabled == 'Y') {
                this.model.messaging = true;
              }
              else if (row.MenuName == "Notification" && row.IsEnabled == 'Y') {

                if (row.ScreenName == "Alarms/Alerts" && row.IsEnabled == 'Y') {
                  this.model.alarmAlert = true;
                }
                if (row.ScreenName == "Incidents" && row.IsEnabled == 'Y') {
                  this.model.incident = true;
                }
                if (this.model.alarmAlert && this.model.incident) {
                  this.model.notification = true;
                }
              }
              else if (row.MenuName == "Configuration") {
                if (row.ScreenName == "Asset Type" && row.IsEnabled == 'Y') {
                  this.model.assetType = true
                }
                else if (row.ScreenName == "Checklist" && row.IsEnabled == 'Y') {
                  this.model.checkList = true;
                }
                else if (row.ScreenName == "Debug" && row.IsEnabled == 'Y') {
                  this.model.debug = true;
                }
                else if (row.ScreenName == "ComServer" && row.IsEnabled == 'Y') {
                  this.model.comserver = true
                }
                if (this.model.assetType && this.model.checkList && this.model.debug && this.model.comserver)
                  this.model.configuration = true;
                if (this.roleid == 1 || this.roleid == 0) {
                  if (this.model.assetType && this.model.checkList)
                    this.model.configuration = true;
                }
              }
              else if (row.MenuName == "Admin") {

                if (row.ScreenName == "Company" && row.IsEnabled == 'Y') {
                  this.model.company = true;
                }
                else if (row.ScreenName == "Vendors" && row.IsEnabled == 'Y') {
                  this.model.vendortype = true;
                }
                else if (row.ScreenName == "Stock Page" && row.IsEnabled == 'Y') {
                  this.model.stockpage = true;
                }
                if (this.model.company && this.model.vendortype && this.model.stockpage)
                  this.model.admin = true;
              }
            });
            if (id == 0 || id == 1) {
              this.model.comserver = false
              this.model.debug = false;
            }
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
  userRolsData2 = []
  EditedRoles(id, userid) {
    try {
      this.model = new RoleModel();
      this.userRolsData2 = []
      this.loader = true;
      this.assetprohelperService.PostMethod("UsersDirectory/GetWebUserScreenModules", { "Role": id, "UserID": userid }).subscribe(response => {
        try {
          this.loader = false;
          let body = response.json();
          if (body.Status) {
            this.userRolsData2 = body.Data
            this.userRolsData2.filter(row => {
              if (row.MenuName == "Dashboard" && row.IsEnabled == 'Y') {
                this.model.dashboard = true;
              }
              else if (row.MenuName == "Asset") {

                if (row.ScreenName == "Equipment" && row.IsEnabled == 'Y') {
                  this.model.equipment = true
                }
                else if (row.ScreenName == "Batteries" && row.IsEnabled == 'Y') {
                  this.model.batteries = true
                }
                else if (row.ScreenName == "Chargers" && row.IsEnabled == 'Y') {
                  this.model.charges = true
                }
                else if (row.ScreenName == "Gateways" && row.IsEnabled == 'Y') {
                  this.model.gateways = true;
                }
                if (this.model.equipment && this.model.batteries && this.model.charges && this.model.gateways)
                  this.model.asset = true;
              }
              else if (row.MenuName == "User Directory") {

                if (row.ScreenName == "Operators" && row.IsEnabled == 'Y') {
                  this.model.operator = true
                } else if (row.ScreenName == "WebUser" && row.IsEnabled == 'Y') {
                  this.model.webUser = true
                }
                if (this.model.operator && this.model.webUser)
                  this.model.userDirectory = true;
              }
              else if (row.MenuName == "Tracker" && row.IsEnabled == 'Y') {
                this.model.tracker = true;
              }
              else if (row.MenuName == "Reports" && row.IsEnabled == 'Y') {
                this.model.reports = true;
              }
              else if (row.MenuName == "Messaging" && row.IsEnabled == 'Y') {
                this.model.messaging = true;
              }
              else if (row.MenuName == "Notification" && row.IsEnabled == 'Y') {
                this.model.notification = true;
              }
              else if (row.MenuName == "Configuration") {

                if (row.ScreenName == "Asset Type" && row.IsEnabled == 'Y') {
                  this.model.assetType = true
                }
                else if (row.ScreenName == "Checklist" && row.IsEnabled == 'Y') {
                  this.model.checkList = true;
                }
                else if (row.ScreenName == "Debug" && row.IsEnabled == 'Y') {
                  this.model.debug = true;
                }
                else if (row.ScreenName == "ComServer" && row.IsEnabled == 'Y') {
                  this.model.comserver = true
                }
                if (this.model.assetType && this.model.checkList && this.model.debug && this.model.comserver)
                  this.model.configuration = true;
                  if (id == 0 || id == 1) {
                    if (this.model.assetType && this.model.checkList)
                      this.model.configuration = true;
                  }
              }
              else if (row.MenuName == "Admin") {

                if (row.ScreenName == "Company" && row.IsEnabled == 'Y') {
                  this.model.company = true;
                }
                else if (row.ScreenName == "Vendors" && row.IsEnabled == 'Y') {
                  this.model.vendortype = true;
                }
                else if (row.ScreenName == "Stock Page" && row.IsEnabled == 'Y') {
                  this.model.stockpage = true;
                }
                if (this.model.company && this.model.vendortype && this.model.stockpage)
                  this.model.admin = true;
              }
            });
            if (id == 0 || id == 1) {
              this.model.comserver = false
              this.model.debug = false;
            }
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