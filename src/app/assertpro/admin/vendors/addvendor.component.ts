import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import { MatDialog } from '@angular/material';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'addvendorscreen',
  templateUrl: './addvendor.component.html',
  styleUrls: ['./addvendor.component.css']
})
export class AddVendorComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public email: AbstractControl;

  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService, public dialog: MatDialog,fb: FormBuilder) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required])]
      })
      this.email = this.form.controls['email'];
  }
  @ViewChild('side') side: ElementRef;
  ngOnInit() {
    this.countryArray()
  }

  ngOnDestroy() {

  }

  @ViewChild('myDiv') myDiv: ElementRef;
  actualData: any;
  type: boolean = false;
  vendorName: string = "";
  contactPersonName: string = "";
  phoneNumber: any;
  id=null
  extNo: any;
  emailid: any;
  address: any;
  mainPhoneNumber: any;
  mainphoneExtNo: any;
  country: string;
  fax: any;
  stateNmae: string;
  cityName: string;
  zipCode: any;
  countryList
  statesList
  countryId
  stateId

  editMode = false
  loader
  opentoCreate(enabled, element) {
    try {
      this.clear()
      this.side.nativeElement.style.width = "100%";
      this.editMode = this.editShow = enabled
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
        width = '73%'
      }
      this.myDiv.nativeElement.style.width = width;
      if (element != undefined) {
        this.contactPersonName = element.Contact;
        this.phoneNumber = element.Mobile;
        this.zipCode = element.Zipcode;
        this.cityName = element.City;
        this.stateNmae = element.State;
        this.fax = element.Fax;
        this.country = element.Country;
        this.mainphoneExtNo = element.Ext;
        this.mainPhoneNumber = element.Phone;
        this.address = element.Address1;
        this.emailid = element.Email;
        this.extNo = element.Ext;
        this.vendorName = element.Name
        this.id=element.ID
        this.stateId=element.StateID
        this.countryId=element.CountryID
      }
    }
    catch (sidebarerror) {
      console.log(sidebarerror)
    }
  }
  
  onEditClilck() {
    let parent = this;
    parent.editShow = true;
  }
  cancelEdit() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: "Are you sure you want to Cancel ?"}
    });
    subdialogRef.afterClosed().subscribe(result => {
      if(result=='Yes'){
        this.closeSidebar()
      }
    });
  }
  saveEdit() {
    if (this.vendorName == undefined || this.vendorName == '' || this.vendorName.trim() == '') {
      this.toastr.warning("Vendor Name is Mandatory", "Warning");
      return;
    }
    if (this.contactPersonName == undefined || this.contactPersonName == '' || this.contactPersonName.trim() == '') {
      this.toastr.warning("Contact Person Name is Mandatory", "Warning");
      return;
    }
    if (this.phoneNumber == undefined || this.phoneNumber == '' || this.phoneNumber.trim() == '') {
      this.toastr.warning("PhoneNo is Mandatory", "Warning");
      return;
    }
    if (this.emailid == undefined || this.emailid == '' || this.emailid.trim() == '') {
      this.toastr.warning("Email is Mandatory", "Warning");
      return;
    }
    if(this.email.invalid && (this.email.dirty || this.email.touched)){
      if (this.email.errors.email) {
        this.toastr.warning("Valid Email Only Allowed", "Warning");
        return;
      }
    }
    if (this.address == undefined || this.address == '' || this.address.trim() == '') {
      this.toastr.warning("Address is Mandatory", "Warning");
      return;
    }
    if (this.country == undefined || this.country == '') {
      this.toastr.warning("Country Selection is Mandatory", "Warning");
      return;
    }
    if (this.stateNmae == undefined || this.stateNmae == '') {
      this.toastr.warning("State Selection is Mandatory", "Warning");
      return;
    }
    if (this.cityName == undefined || this.cityName == '' || this.cityName.trim() == '') {
      this.toastr.warning("City is Mandatory", "Warning");
      return;
    }
    if (this.zipCode == undefined || this.zipCode == '' || this.zipCode.trim() == '') {
      this.toastr.warning("Zip Code is Mandatory", "Warning");
      return;
    }
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: "Are you sure you want to APPLY ?"}
    });
    subdialogRef.afterClosed().subscribe(result => {
      if(result=='Yes'){
        this.saveApi()
        this.closeSidebar()
      }
    });
   
    
  }
  clear() {
    this.editShow = false;
    this.id=null
    this.vendorName = "";
    this.contactPersonName = "";
    this.phoneNumber = "";
    this.extNo = "";
    this.emailid = "";
    this.address = "";
    this.mainPhoneNumber = "";
    this.mainphoneExtNo = "";
    this.country = "";
    this.fax = "";
    this.stateNmae = "";
    this.cityName = "";
    this.zipCode = "";
    this.countryId=null
    this.stateId=null
  }
  editShow: boolean = false;
  @Output() saveEmit = new EventEmitter();
  countryArray() {
    this.loader = true;
    this.assetprohelperService.GetMethod('Admin/GetAdminCountryList').subscribe(response => {
      this.loader = false;
      let body = response.json();
      this.countryList = body.Data
    })
  }
  countryChange(data) {
   this.countryId=data.UniqueID; this.country=data.Name;
    this.statesArray(this.countryId)
  }
  stateChange(data){
    this.stateId=data.UniqueID;
    this.stateNmae=data.Name
  }
  statesArray(id) {
    this.loader = true;
    this.stateId=null
    this.stateNmae=''
    this.assetprohelperService.PostMethod('Admin/GetAdminStateListByCountryID', { "CountryID": id }).subscribe(response => {
      this.loader = false;
      let body = response.json();
      this.statesList = body.Data
    })
  }
  saveApi() {
    
    this.loader = true;
    let body:any={
      "Name": this.vendorName,
      "Email": this.emailid,
      "Address1": this.address,
      "Address2": null,
      "City": this.cityName,
      "State": this.stateId,
      "Zipcode": this.zipCode,
      "Country": this.countryId,
      "Phone": this.phoneNumber,
      "Ext": this.extNo,
      "Mobile": this.mainPhoneNumber,
      "Fax": this.fax,
      "Contact": this.contactPersonName,
      "SiteID": localStorage.getItem('selectitemId')
    }
    if(!this.editMode){
      body.ID=this.id
    }
    this.assetprohelperService.PostMethod('Vendor/CreateVendor', body)
      .subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Status) {
          this.toastr.success(body.Message, 'Success!')
          this.clear();
          this.saveEmit.emit(true)
        }
        else {
          this.toastr.warning(body.Message, "Warning");
        }
      });
  }
  goBack(){
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: "Are you sure want to to back ?"}
    });
    subdialogRef.afterClosed().subscribe(result => {
      if(result=='Yes'){
        this.closeSidebar()
      }
    });
  }
  closeSidebar() {
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0"
  }
}


