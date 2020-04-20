import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { Operator } from './operator';
import { MatDialog } from '@angular/material';
import { CommonDailog } from '../../common/commondailog/commondailog.component';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-addoperator',
  templateUrl: './addoperator.component.html',
  styleUrls: ['./addoperator.component.css']
})
export class AddOperatorComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public email: AbstractControl;
  model = new Operator()
  @Output() operatorSave = new EventEmitter();
  @Output() cancelEdit = new EventEmitter();
  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('side') side: ElementRef;
  accesLevelList = ['Operator', 'Maintenance', 'Supervisor', 'Admin']
  constructor(private _router: Router, public dialog: MatDialog, private assetprohelperService: AssetprohelperService, private toastr: ToastrService,fb: FormBuilder) {
    this.getuserprofile();
    this.getuserSites();
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required])]
      })
      this.email = this.form.controls['email'];
  }
  editHomeEnabled: boolean = true;
  editHome() {
    this.model.editHomeEnabled = true;
  }
 
  cancelHomeEdit() {
      // this.toastr.warning("Save Properly else your data will lost", "Warning");
     let subdialogRef= this.dialog.open(CommonDailog, {
        data: { name: 'Are you sure you want to cancel ?' }
      });
      subdialogRef.afterClosed().subscribe(result => {
        if (result == 'Yes') {
          //this.model = new Operator();
          this.closeHelpcontainer();
        }
      })
    
    
  }
  resetEdit() {
    this.model = new Operator();
    if(this.editMode){
      this.assignData(this.previsousData)
    }
  }
  checkValidate(value) {
    return (value == null || value == undefined || value == ''
      || value.trim() == '')
  }
  saveHome() {
    try {
      if (this.checkValidate(this.model.input_batch)) {
        this.toastr.warning("Badge Number is Mandatory", "Warning");
        return;
      }
      if (this.model.input_batch.length <= 2) {
        this.toastr.warning("Minimum 3 characters required for batch number", "Warning");
        return;
      }
      if (this.model.input_batch.length >= 9) {
        this.toastr.warning("Maximum 8 characters only required for batch number", "Warning");
        return;
      }
      if (this.checkValidate(this.model.input_firstNmae)) {
        this.toastr.warning("First Name is Mandatory", "Warning");
        return;
      }
      if (this.checkValidate(this.model.input_lastName)) {
        this.toastr.warning("Last Name is Mandatory", "Warning");
        return;
      }
      if (this.checkValidate(this.model.input_email)) {
        this.toastr.warning("Email is Mandatory", "Warning");
        return;
      }
      if (this.model.input_email == null || this.model.input_email == undefined || this.model.input_email == '' || this.model.input_email.trim() == '') {
        this.toastr.warning("Email is Mandatory", "Warning");
        return;
      }
      if(this.email.invalid && (this.email.dirty || this.email.touched)){
      if (this.email.errors.email) {
        this.toastr.warning("Valid Email Only Allowed", "Warning");
        return;
      }
      }
      
      if (this.checkValidate(this.model.input_usageTh)) {
        this.toastr.warning("Usage Threshold field is Mandatory", "Warning");
        return;
      }
      let url='UsersDirectory/AddOperatorUsingSiteID'
      let body:any={
        "SiteID": this.model.siteId,
        "Batch": this.model.input_batch,
        "FName": this.model.input_firstNmae,
        "LName": this.model.input_lastName,
        "NName": this.model.input_nickName,
        "UploadNName": this.model.input_matCheckbox == true ? "Y" : "N",
        "Mobile": this.model.input_mobile,
        "Email": this.model.input_email,
        "UsageTh": this.model.input_usageTh,
        "suspended": this.model.input_suspend == true ? "Y" : "N",
        "MonthlyInciTh": this.model.input_monthlyIncident,
        "BurdenRate": this.model.input_burdenRate,
        "AccessLevel": 3,
        "DepartmentIDs": ["B02A51FE-2248-E611-A64E-782BCB72ACED"],
        "MonthlyAlarmTh": this.model.input_monthlyAlarms,
        "ComplianceTh": this.model.input_complianceTh
      }
      if(this.editMode){
        body.ID=this.previsousData.ID
        url='UsersDirectory/UpdateOperatorByID'
      }
      this.assetprohelperService.PostMethod(url,body).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!') 
            this.side.nativeElement.style.width = "0";
            document.getElementById("addoperator").style.width = "0";
            this.editHomeEnabled = false;
            this.operatorSave.emit();
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
    
    catch (saveError) {
      console.log(saveError)
    }
  }
  public href: string = "";
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  private serviceSubscription: Subscription;
  ngOnInit() {
    this.getuserSites();
    this.href = this._router.url;
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.model.siteId=localStorage.getItem('selectitemId')
      if (localStorage.getItem('sitename') == undefined || localStorage.getItem('sitename') == null)
        this.selectdropdownitem = 'All sites';
      else {
        this.selectdropdownitem = localStorage.getItem('sitename');
      }
    })
  }
  public disabled = false;
  selectdropdownitem: any = 'All sites';
  public userdetails: any = [];
  public usersites: any = {};
  logout() {
    this.assetprohelperService.logout();
    this.toastr.success("Successfully logout", 'Success!');
    this._router.navigate(['']);
  }
  getuserprofile() {
    let url = 'Account/userProfile';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.userdetails = body.Data;
      })
  }
  getuserSites() {
    let url = 'Account/UserSites';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.usersites = body.Data;
        this.usersites = this.usersites.filter(a => { return a.SiteID != null; })
        for (var i = 0; i < this.usersites.length; i++) {
          if (this.usersites[i].SiteID == localStorage.getItem('selectitemId')) {
            this.selectdropdownitem = this.usersites[i].Name;
          }
          this.usersites[i].Name = this.usersites[i].Name.trim()
        }
        if (this.usersites.length == 0) {
          this.disabled = true;
        }
      })
  }
  public isIfopen: any = false;
  editMode: boolean = false;
  previsousData:any;
  openHelpcontainer(data) {
    document.body.style.overflowY="hidden"
    this.model=new Operator();
    this.side.nativeElement.style.width = "100%";
    document.getElementById("addoperator").style.width = "52.57%";
    if (screen.availWidth == 1440 || screen.availWidth == 1280) {
      document.getElementById("addoperator").style.width = "56.57%";
    }
    if (screen.availWidth >=1900) {
      document.getElementById("addoperator").style.width = "40.57%";
    }
    if (screen.availWidth <=500) {
      document.getElementById("addoperator").style.width = "90%";
    }
    
    this.editMode = false;
    this.previsousData=data;
    this.resetEdit();
   document.getElementById("addoperator").style.paddingLeft="4.17%";
   document.body.style.overflowY="hidden"
  }
  assignData(data){
    this.model.id = data.ID
    this.model.input_batch = data.BadgeNo
    this.model.input_role = "";
    this.model.input_department = data.Department;
    this.model.input_status = "";
    this.model.input_monthlyAlarms = data.YTDAlarm
    this.model.input_complianceTh = data.YTDCompliance
    this.model.input_subStation = "";
    this.model.siteId = localStorage.getItem('selectitemId')
    this.model.siteName = localStorage.getItem('sitename');
    this.model.input_accessLevel= data.AccessLevel; 
    this.model.accessLevelName= data.AccessLevelName;
    this.model.input_burdenRate = "";
    this.model.input_monthlyIncident = data.YTDIncidents;
    this.model.input_suspend = false;
    this.model.input_usageTh = data.YTDUsage
    this.model.input_email = "";
    this.model.input_mobile = "";
    this.model.input_nickName = "";
    this.model.input_lastName = "";
    this.model.input_firstNmae = data.OperatorName
       this.model.input_productivity = "";
    this.model.input_matCheckbox = false;
  }
  savecontainer() {
    this.toastr.success("Record Added Successfully", 'Success!');
    document.getElementById("addoperator").style.width = "0";
    this.resetEdit();
  }
  
  confirmBack() {
   let subdialogRef= this.dialog.open(CommonDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.model = new Operator();
        this.closeHelpcontainer();
      }
    })
}
  closeHelpcontainer() {
    this.side.nativeElement.style.width = "0";
    document.getElementById("addoperator").style.paddingLeft="0";
    // document.body.style.overflowY="auto"
    document.getElementById("addoperator").style.width = "0";
    document.body.style.overflowY="auto";
    if(this.editMode){
      this.cancelEdit.emit();
    }
  }
  public sidebar: any = false;
  opensideBar() {
    try {
      // if (!this.sidebar) {
      //   (<HTMLInputElement>document.getElementById("additional-bar")).style.width = "0";
      // }
      this.side.nativeElement.style.width = "100%";
      document.body.style.overflowY="hidden";
      document.getElementById("addoperator").style.paddingLeft="4.17%";
      document.getElementById("addoperator").style.width = "52.57%";
      if (screen.availWidth == 1440 || screen.availWidth == 1280) {
        document.getElementById("addoperator").style.width = "56.57%";
      }
      if (screen.availWidth >=1900) {
        document.getElementById("addoperator").style.width = "40.57%";
      }
      if (screen.availWidth <=500) {
        document.getElementById("addoperator").style.width = "90%";
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  siteChange(data) {
    this.model.siteName = data.Name
    this.model.siteId = data.SiteID;
    this.departmentListFun()
  }
  departmentList = []
  departmentListFun() {
    try {
      var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
      let url = 'TrackingHistory/departmentlistwithsite?id=' + this.model.siteId;
      this.departmentList = [];
      this.assetprohelperService.GetMethod(url).subscribe(
        data => {
          try {
            let body: any = JSON.parse(data['_body']);
            this.departmentList = body.Data;
          }
          catch (apierror) {
            console.log(apierror)
          }
        })
    }
    catch (error) {
      console.log(error)
    }
  }

}
