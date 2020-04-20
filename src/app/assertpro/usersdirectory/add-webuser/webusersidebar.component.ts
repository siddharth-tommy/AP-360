import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { MatDialog } from '@angular/material';
import { CommonDailog } from '../../common/commondailog/commondailog.component';
import { Webuser } from './webuser.model';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';


@Component({
  selector: 'webusersidebar-component',
  templateUrl: './webusersidebar.component.html',
  styleUrls: ['./webusersidebar.component.css']
})
export class WebUserSidebarComponent implements OnInit {
  public form: FormGroup;
  public email: AbstractControl;
  @ViewChild('myDiv') myDiv: ElementRef;

  @ViewChild('side') side: ElementRef;
  datas: any;
  model = new Webuser()
  vendor: string = 'Modern Handing Group';
  make: string = '';
  serialNO: string = '765-97654-9765';
  installDate: string = '04/11/2018 03:48 PM';
  leastRendal: string = '';
  aquationDate: string = '12/09/2018';
  acuationCost: string = '$5,987';
  acuationType: string = 'buy';
  @Output() valueChange = new EventEmitter();
  @Output() previsous = new EventEmitter();
  @Output() saveorupdate = new EventEmitter();
  userList = ['Howard Webstar']
  roleList = []

  role: string = '';
  roleId
  onlyforEditEnable: boolean = false;
  sidebarActive(info) {
    this.sidebarmenu = info;
  }

  sidebarmenu: string = 'asset';

  constructor(private toastr: ToastrService, private assetprohelperService: AssetprohelperService, public dialog: MatDialog,fb: FormBuilder) {
    this.form = fb.group({
    'email': ['', Validators.compose([Validators.required])]
    })
    this.email = this.form.controls['email'];
  }

  ngOnInit() {
    this.getUserRole();
    this.getMobileProviders();
  }
 
  changePasswordDisabled() {
    this.changePassword_button=true
  }
  asset: boolean = true;
  tabChange(value) {
    this.asset = value;
  }
  public sidebar: any = false;
  addMode: boolean = false;
  changePassword_button = true;
  editedOperator: boolean = false;
  enableId = []
  disableIds = []
  opensideBar(data) {
    this.addMode = false;
    //  this.sidebar = !this.sidebar;
    this.asset = true;
    this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    document.body.style.overflowY="hidden";
    this.side.nativeElement.style.width = "100%";
    if (screen.availWidth >= 1920) {
      this.myDiv.nativeElement.style.width = "55%";
    } else
      this.myDiv.nativeElement.style.width = "55.5%";

    if (data == undefined) {
      this.addMode = true
      this.model.id = null

    } else {
      this.model.id = data.ID
      this.model.name = data.FirstName
      this.role = data.roleName
      this.roleId = data.Role
      this.model.phoneNo = data.Phone
      this.model.ext = data.Ext
      this.model.mobileNo = data.Mobile
      this.model.mobileProv = data.MobileProvider
      this.model.email = data.Email
      this.model.username = data.UserName
      if(this.onlyforEditEnable==false){
      this.model.password = ""
      this.model.verifyPassword = ""
      }
      if (this.enableId.length == 0)
        this.EditedRoles(data.Role, this.model.id);
      this.model.mobileProv = data.MobileProvider
      this.mobileProviderList.forEach(row => {
        if (row.Key == data.MobileProvider) {
          this.provider = row.Value
        }
      });
    }
  }
  opensideBarAddMode() {

    this.addMode = true;
    this.onlyforEditEnable=false
    // this.sidebar = !this.sidebar;
    this.asset = true;
    //this.enableId = []
    //this.disableIds = []
    if (this.enableId.length == 0)
    this.userRols(this.roleId);
    this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    document.body.style.overflowY="hidden";
    this.side.nativeElement.style.width = "100%";
    if (screen.availWidth >= 1920) {
      this.myDiv.nativeElement.style.width = "55%";
    } else
      this.myDiv.nativeElement.style.width = "55.5%";
    this.model = new Webuser();

  }
  openAfterRole(){
    this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    document.body.style.overflowY="hidden";
    this.side.nativeElement.style.width = "100%";
    if (screen.availWidth >= 1920) {
      this.myDiv.nativeElement.style.width = "55%";
    } else
      this.myDiv.nativeElement.style.width = "55.5%";

  }
  goBack() {
    let subdialogRef = this.dialog.open(CommonDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.changePasswordDisabled()
        this.closeHelpcontainer();
        this.changePasswordHide();
      }
    })
  }
  closeHelpcontainer() {
    this.myDiv.nativeElement.style.paddingLeft = "0";
    document.body.style.overflowY="auto";
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    this.previsous.emit(true);
    this.changePasswordDisabled()
  }
  close() {
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
  }
  advancebtn() {
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    // this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    // document.body.style.overflowY="hidden";
    this.valueChange.emit({ roleId: this.roleId, mode: this.addMode, id: this.model.id, name: this.model.name, role: this.role });
    this.model.password = "";
    this.model.verifyPassword = "";
    this.changePasswordHide()
  }
  editEnabled: boolean = false;
  onEditClilck() {
    this.editEnabled = true;
    if (this.asset) {

    } else {

    }
  }
  cancelEdit() {
    let subdialogRef = this.dialog.open(CommonDailog, {
      data: { name: 'Are you sure want to cancel ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.editEnabled = false;
        this.model = new Webuser();
        this.closeHelpcontainer();
        this.changePasswordHide();
      }
    })

  }

  saveHome() {
    if (this.model.name == undefined || this.model.name == '' || this.model.name.trim() == '') {
      this.toastr.warning("Name is Mandatory", "Warning");
      return;
    }
    if (this.role == undefined || this.role == '' || this.role.trim() == '') {
      this.toastr.warning("Role is Mandatory", "Warning");
      return;
    }
    if (this.model.username == undefined || this.model.username == '' || this.model.username.trim() == '') {
      this.toastr.warning("Username is Mandatory", "Warning");
      return;
    }
    if (this.model.email == null || this.model.email == undefined || this.model.email == '' || this.model.email.trim() == '') {
      this.toastr.warning("Email is Mandatory", "Warning");
      return;
    }
    if(this.email.invalid && (this.email.dirty || this.email.touched)){
    if (this.email.errors.email) {
      this.toastr.warning("Valid Email Only Allowed", "Warning");
      return;
    }
  }
    if(this.onlyforEditEnable || this.addMode){
               if (this.model.password == undefined || this.model.password == '' || this.model.password.trim() == '') {
               this.toastr.warning("Password is Mandatory", "Warning");
               return;
               }
               if (this.model.password.length<=7) {
                this.toastr.warning("Min 8 Charaters Required For Password", "Warning");
                return;
               }
              if (this.model.verifyPassword == undefined || this.model.verifyPassword == '' || this.model.verifyPassword.trim() == '') {
              this.toastr.warning("VerifyPassword is Mandatory", "Warning");
              return;
               }
               if (this.model.verifyPassword.length<=7) {
                this.toastr.warning("Min 8 Charaters Required For Password", "Warning");
                return;
               }
               if (this.model.password != this.model.verifyPassword) {
                this.toastr.warning("Passwords Not Match", "Warning");
                return;
               }
    }
    
    
    
    if (this.enableId.length == 0 && this.disableIds.length == 0) {
      this.toastr.warning("User Role Selection is Mandatory", "Warning");
      return;
    }
    this.editEnabled = false;
    let msg = 'Created';
    if (!this.addMode) {
      msg = 'Updated';
    }
    if (this.addMode) {
      this.assetprohelperService.PostMethod('UsersDirectory/AddWebUser', {
        "Role": this.roleId,
        "FName": this.model.name,
        "LName": "",
        "UserName": this.model.username,
        "SiteIDs": [
          localStorage.getItem('selectitemId'),
        ],
        "Password": this.model.password,
        "VerifyPassword": this.model.password,
        "ShowIds": this.enableId,
        "HideIds": this.disableIds,
        "Phone": this.model.phoneNo,
        "Email": this.model.email,
        "Ext": this.model.ext,
        "Mobile": this.model.mobileNo,
        "MobileProvider": this.model.mobileProv
      }).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!')
            this.saveorupdate.emit()
            this.closeHelpcontainer();
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (error) {
          console.log(error)
        }
      });
    } 
    else if(this.onlyforEditEnable) {
      this.assetprohelperService.PostMethod('UsersDirectory/UpdateWebUserByID', {
        "ID": this.model.id,
        "Role": this.roleId,
        "FName": this.model.name,
        "LName": "",
        "UserName": this.model.username,
        "SiteIDs": [
          localStorage.getItem('selectitemId')
        ],
        "Password": this.model.password,
        "VerifyPassword": this.model.password,
        "ShowIds": this.enableId,
        "HideIds": this.disableIds,
        "Phone": this.model.phoneNo,
        "Email": this.model.email,
        "Ext": this.model.ext,
        "Mobile": this.model.mobileNo,
        "MobileProvider": this.model.mobileProv
      }).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!')
            this.saveorupdate.emit();
            this.closeHelpcontainer();
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (error) {
          console.log(error)
        }
      });
    }
    else {
      this.assetprohelperService.PostMethod('UsersDirectory/UpdateWebUserByID', {
        "ID": this.model.id,
        "Role": this.roleId,
        "FName": this.model.name,
        "LName": "",
        "UserName": this.model.username,
        "SiteIDs": [
          localStorage.getItem('selectitemId')
        ],
        "ShowIds": this.enableId,
        "HideIds": this.disableIds,
        "Phone": this.model.phoneNo,
        "Email": this.model.email,
        "Ext": this.model.ext,
        "Mobile": this.model.mobileNo,
        "MobileProvider": this.model.mobileProv
      }).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!')
            this.saveorupdate.emit()
            this.closeHelpcontainer();
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (error) {
          console.log(error)
        }
      });
    }
    this.model.password = "";
    this.model.verifyPassword = "";
    this.changePasswordHide()
  }
  disabled: boolean = false;
  usersites = []
  selectdropdownitem: string = '';

  getUserRole() {
    let url = 'UsersDirectory/GetAllUserRoles';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.roleList = body.Data;
        
        if(localStorage.getItem('role')=='CompanyAdmin'){
          this.roleList=this.roleList.filter(row=>{return row.ID>=0});
        }
        else if(localStorage.getItem('role')=='SiteAdmin'){
          this.roleList=this.roleList.filter(row=>{return row.ID>=1});
        }
        this.roleId = this.roleList[0].ID
        this.role = this.roleList[0].Name

        this.userRols(this.roleId);
      })
  }
  roleChange(data) {
    this.roleId = data.ID
    this.role = data.Name
    this.userRols(this.roleId);
  }
  SelectSiteMenu(site) {

    this.selectdropdownitem = site.Name;
  }
  userRolsData
  userRols(id) {
    try {
      this.loader = true;

      this.enableId = []
      this.disableIds = []
      this.assetprohelperService.PostMethod("UsersDirectory/GetUserRoleScreens", { "Role": id }).subscribe(response => {
        try {
          this.loader = false;
          let body = response.json();
          if (body.Status) {
            this.userRolsData = body.Data
            this.userRolsData.filter(row => {
              if (row.IsEnabled == 'Y') {
                this.enableId.push(row.ScreenSubModule_ID)
              } else {
                this.disableIds.push(row.ScreenSubModule_ID)
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
  loader = false
  userRolsData2 = []
  EditedRoles(id, userid) {
    try {
      this.userRolsData2 = []
      this.loader = true;
      this.assetprohelperService.PostMethod("UsersDirectory/GetWebUserScreenModules", { "Role": id, "UserID": userid }).subscribe(response => {
        try {
          this.loader = false;
          let body = response.json();
          if (body.Status) {
            this.userRolsData2 = body.Data
            this.userRolsData2.filter(row => {
              if (row.IsEnabled == 'Y') {
                this.enableId.push(row.WebUserScreens_ID)
              } else {
                this.disableIds.push(row.WebUserScreens_ID)
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
  mobileProviderList = []
  getMobileProviders() {
    let url = 'UsersDirectory/GetAllMobileProvider';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.mobileProviderList = body.Data;
        this.provider = body.Data[0].Value
        this.model.mobileProv = body.Data[0].Key
      })
  }
  provider = ''
  providerchange(data) {
    this.provider = data.Value
    this.model.mobileProv = data.Key
  }
  changePassword(){
    this.onlyforEditEnable=true;
    this.changePassword_button=false;
  }
  changePasswordHide(){
    this.onlyforEditEnable=false;
    this.changePassword_button=true;
  }
}
