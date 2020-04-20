import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDailog } from 'src/app/assertpro/usersdirectory/usersdirectory.component';

@Component({
  selector: 'createcompany',
  templateUrl: './createcompany.component.html',
  styleUrls: ['./createcompany.component.css']
})
export class CreateCompanyComponent implements OnInit {
  statesList = [];
  stateId: any;
  countryList: any;
  countryId: any;
  @ViewChild('side') side: ElementRef;

  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadAdminList();
    this.countryArray();

  }
  loader: boolean = false
  adminList = [1, 2, 3]
  timeZone = [1, 2, 3]
  Peplink = []
  @ViewChild('myDiv') myDiv: ElementRef;
  actualData;
  type: boolean = false;
  openSidebar(data, type) {
    this.type = true;
    if (type == true) {
      this.type = false;
    }
    document.body.style.overflowY="hidden";
    this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    this.side.nativeElement.style.width = "100%";
    this.actualData = data;
    let width = '55%'
    if (screen.availWidth <= 576) {
      width = '90%'
      this.myDiv.nativeElement.style.right = 'unset';
    }
    else if (screen.availWidth <= 768) {
      width = '90%'
    } else if (screen.availWidth <= 992) {
      width = '80%'
    }
    else if (screen.availWidth <= 1200) {
      width = '66%'
    }
    this.myDiv.nativeElement.style.width = width;
    this.companyname = data.Name;
    this.adminname = data.AdminName
    this.phone = data.AdminPhone
    this.email = data.AdminEmail
    if (data.Address1 != undefined && data.Address1 != null)
      this.address = data.Address1.trim()
    this.country = data.Country;
    this.countryId=data.CountryID;
    this.statesArray(this.countryId)
    this.state = data.State;
    this.stateId=data.StateID;
    this.city = data.City
    this.zip = data.Zipcode
    this.timezone = '';
    this.phoneNo = data.Phone
    this.ext = data.Ext
    this.fax = data.Fax;
    this.trackAssets = false;
    this.analytics = false;
    this.loadsettings = false;
    this.idlingOptions = false;
    this.logonOptions = false;
    this.gateway = false;
    this.ultimate = false;
    this.advanced = false;
    this.vital = false;
    this.celltrac = false;
    this.atlus = false;
    this.momentus = false;
    this.pepling = data.PeplinkOrgId
    if (data.PeplinkOrgId != undefined && data.PeplinkOrgId != null) {
      this.gateway = true;
    }
  }
  close() {
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    // this.myDiv.nativeElement.style.right = '-100px';
    document.body.style.overflowY="auto";
    this.myDiv.nativeElement.style.paddingLeft = "0";
  }
  cancel() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to Cancel ?' }
    });
    let parent=this;
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
       parent.close();
      }
    })
    
  }
  companyname: string;
  adminname: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  timezone: string;
  phoneNo: string;
  ext: string;
  fax: string;
  trackAssets: boolean;
  analytics: boolean;
  loadsettings: boolean;
  idlingOptions: boolean;
  logonOptions: boolean;
  gateway: boolean;
  ultimate: boolean;
  advanced: boolean;
  vital: boolean;
  celltrac: boolean;
  atlus: boolean;
  momentus: boolean;
  pepling: string;

  clear() {
    this.companyname = '';
    this.adminname = '';
    this.phone = '';
    this.email = '';
    this.address = '';
    this.country = '';
    this.state = '';
    this.city = '';
    this.zip = '';
    this.timezone = '';
    this.phoneNo = '';
    this.ext = '';
    this.fax = '';
    this.trackAssets = false;
    this.analytics = false;
    this.loadsettings = false;
    this.idlingOptions = false;
    this.logonOptions = false;
    this.gateway = false;
    this.ultimate = false;
    this.advanced = false;
    this.vital = false;
    this.celltrac = false;
    this.atlus = false;
    this.momentus = false;
    this.pepling = '';
    this.country="";
    this.state="";
    this.stateId="";
    this.countryId="";
  }
  goBack() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    let parent=this;
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        parent.close()
      }
    })
  }
  beforeUpdate(){
    let parent = this;
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to APPLY this Action?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        parent.update()
      }
    });
  }
  save(){
    if (this.companyname==null || this.companyname==undefined || this.companyname=='' || this.companyname.trim()==''){
        this.toastr.warning("Name is Mandatory","Warning")
        return
    }
    if (this.phone==null || this.phone==undefined || this.phone=='' || this.phone.trim()==''){
      this.toastr.warning("Phone Number is Mandatory","Warning")
      return
  }
  if (this.email==null || this.email==undefined || this.email=='' || this.email.trim()==''){
    this.toastr.warning("Email is Mandatory","Warning")
    return
}

if (this.address==null || this.address==undefined || this.address=='' || this.address.trim()==''){
  this.toastr.warning("Address is Mandatory","Warning")
  return
} 
if (this.country==null || this.country==undefined){
  this.toastr.warning("Country is Mandatory","Warning")
  return
} 
if (this.state==null || this.state==undefined){
  this.toastr.warning("State is Mandatory","Warning")
  return
} 
if (this.city==null || this.city==undefined || this.city=='' || this.city.trim()==''){
  this.toastr.warning("City is Mandatory","Warning")
  return
} 
if (this.zip==null || this.zip==undefined || this.zip=='' || this.zip.trim()==''){
  this.toastr.warning("Zip Code is Mandatory","Warning")
  return
}
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to APPLY ?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        this.update()
      }
    });
  }
  update() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.PostMethod("Admin/UpdateAdminCompanyDetailsByID",
      {
        "ID": this.actualData.ID,
        "Name": this.companyname,
        "CountryID": this.countryId,
        "Country": this.country,
        "StateID": this.stateId,
        "State": this.state,
        // "CityID": 142436,
        "City": this.city,
        "Zipcode": this.zip,
        "Address1": this.address,
        "Address2": null,
        "Phone": this.phone,
        "Ext": this.ext,
        "Fax": this.fax,
        "PeplinkOrgId": this.pepling,
        "AdminID": this.actualData.AdminID,
        "AdminName": this.adminname,
        "AdminPhone": this.phone,
        "AdminExt": "112",
        "AdminEmail": this.email,
      }).subscribe(data => {
        this.loader = false;
        let body = data.json();
        if (body.Status) {
          parent.toastr.success(body.Message, 'Success!')
          parent.close();
        }
        else {
          parent.toastr.warning(body.Message, "Warning");
        }
      });

  }
  loadAdminList() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.GetMethod("Admin/GetAdminList").subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.adminList = body.Data
    });
  }
  countryArray() {
    this.loader = true;
    this.assetprohelperService.GetMethod('Admin/GetAdminCountryList').subscribe(response => {
      this.loader = false;
      let body = response.json();
      this.countryList = body.Data
    })
  } 
  countryChange(data) {
    this.countryId = data.UniqueID; this.country = data.Name;
    this.statesArray(this.countryId)
  }
  stateChange(data) {
    this.stateId = data.UniqueID;
    this.state = data.Name
  }
  statesArray(id) {
    this.loader = true;
    this.stateId=null
    this.state=''
    this.assetprohelperService.PostMethod('Admin/GetAdminStateListByCountryID', { "CountryID": id }).subscribe(response => {
      this.loader = false;
      let body = response.json();
      this.statesList = body.Data
    })
  }
}
