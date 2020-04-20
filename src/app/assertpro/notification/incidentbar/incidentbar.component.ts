import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';

import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { debug } from 'util';
import { CommonDailog } from '../../common/commondailog/commondailog.component';

@Component({
  selector: 'incidentbar-component',
  templateUrl: './incidentbar.component.html',
  styleUrls: ['./incidentbar.component.css']
})
export class IncidentBarComponent implements OnInit, OnDestroy {

  @ViewChild('incidentbar') incidentbar: ElementRef;
  @Output() valueChange = new EventEmitter();
  datas: any;

  vendor: string = 'Modern Handing Group';
  make: string = '';
  model: string = '';
  serialNO: string = '765-97654-9765';
  installDate: string = '04/11/2018 03:48 PM';
  leastRendal: string = '';
  aquationDate: string = '12/09/2018';
  acuationCost: string = '$5,987';
  acuationType: string = 'buy';
  departmentList = []
  assetList = []
  dept: string = '';
  deptId: string = ''
  operatorName: string = ''
  operatorId: string = '';
  operatorList = [];
  incidenKindList = ['No Incident Report', 'Collision with fixed object', 'Collision with another type of equipment',
    'Collision with a person', 'Equipment for personal use', 'Near miss', 'Safety Violation', 'Other']
  correctiveActionList = ['No Action', 'Verbal Coaching', 'Written Warning', 'Final Written Warning', 'Suspension', 'Discharged']
  incident: string = '';
  injury: string = ''
  drug: string = '';
  assetval: string = ''
  assetId: string = ''
  incidentDate: any = '';
  cost1: string = '';
  corrective: string = '';
  suspend: string = ''
  comment: string = ''
  damage: string;
  sidebarActive(info) {
    this.sidebarmenu = info;
  }

  sidebarmenu: string = 'asset';
  constructor(private toastr: ToastrService, private assetprohelperService: AssetprohelperService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getuserSites();
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      if (localStorage.getItem('selectitemId') == undefined || localStorage.getItem('selectitemId') == null ||
        localStorage.getItem('selectitemId') == 'null') {
        //  this.toastr.warning("Single Site Is Mandatory", 'Warning!');
        return;
      }
      this.GetAssetsList();
      this.departmentListFun();
      this.GetOperatorList();
    });

  }
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  private serviceSubscription: Subscription;
  asset: boolean = true;
  tabChange(value) {
    this.asset = value;
  }
  public sidebar: any = false;
  @ViewChild('side') side: ElementRef;
  addMode: boolean = false;
  opensideBar() {
    this.addMode = true;
    this.sidebar = !this.sidebar;
    this.asset = true;
    this.side.nativeElement.style.width = "100%";
    document.body.style.overflowY="hidden";
    this.incidentbar.nativeElement.style.paddingLeft = "4.17%";
    this.incidentbar.nativeElement.style.width = "55%";
    if (screen.availWidth == 1440) {
      this.incidentbar.nativeElement.style.top = "10%";
    }
    else if (screen.availWidth == 1280) {
      this.incidentbar.nativeElement.style.top = "10%";
    }

    this.dept = '';
    this.operatorName = ''
    this.incident = '';
    this.injury = ''
    this.drug = '';
    this.assetval = ''
    this.cost1 = '';
    this.corrective = '';
    this.suspend = ''
    this.comment = ''
    this.incidentDate=new Date()
  }
  editedData;
  opensideBarEditMode(data) {
    this.addMode = false;
    this.sidebar = !this.sidebar;
    this.asset = true;
    this.side.nativeElement.style.width = "100%";
    this.incidentbar.nativeElement.style.width = "55%";
    document.body.style.overflowY="hidden";
    this.incidentbar.nativeElement.style.paddingLeft = "4.17%";
    if (screen.availWidth == 1440) {
      this.incidentbar.nativeElement.style.top = "10%";
    }
    else if (screen.availWidth == 1280) {
      this.incidentbar.nativeElement.style.top = "10%";
    }
    this.dept = 'ACG Test & Production';
    this.operatorName = 'Maintenance Test';
    this.incident = '';
    this.assetval = ''
    this.incidentDate = new Date();
    this.corrective = '';
    this.comment = ''
    this.editedData=data;
    if(data!=undefined){
      this.operatorList.forEach(row=>{
        if(row.ID==data.ID){
        this.operatorId=row.ID
        this.operatorName=row.OperatorName
        }
      })
    }
  }
  departmentChange(data) {
    this.dept = data.NAME
    this.deptId = data.ID
  }
  operatorChange(data) {
    this.operatorName = data.OperatorName
    this.operatorId = data.ID
  }
  assetChange(data) {
    this.assetval = data.assetstype
    this.assetId = data.ID
  }
  incidentKindChange(data) {

  }
  resetEdit(){
    this.dept='';
    this.operatorName='';
    this.injury='';
    this.drug='';
    this.assetval='';
    this.incidentDate='';
    this.cost1='';
    this.incident='';
    this.corrective='';
    this.suspend='';
    this.damage='';
    this.comment='';
    if(!this.addMode){
      this.operatorList.forEach(row=>{
        if(row.ID==this.editedData.ID){
        this.operatorId=row.ID
        this.operatorName=row.OperatorName
        }
      })
    }
  }
  apply() {
    if (this.injury == null || this.injury == undefined || this.injury == '') {
      this.toastr.warning("Injury is Mandatory", "Warning");
      return;
    }
    if (this.incidentDate == null || this.incidentDate == undefined || this.incidentDate == '') {
      this.toastr.warning("Incident Date and time is Mandatory", "Warning");
      return;
    }
    if (this.cost1 == null || this.cost1 == undefined || this.cost1 == '' || this.cost1.trim() == '') {
      this.toastr.warning("Cost is Mandatory", "Warning");
      return;
    }
    if (this.suspend == null || this.suspend == undefined || this.suspend == '' || this.suspend.trim() == '') {
      this.toastr.warning("Suspend field is Mandatory", "Warning");
      return;
    }
    if (this.damage == null || this.damage == undefined || this.damage == '' || this.damage.trim() == '') {
      this.toastr.warning("Damage field is Mandatory", "Warning");
      return;
    }
 
    this.assetprohelperService.PostMethod('UsersDirectory/CreateIncident', {
      "AssetID": this.assetId,
      "SiteID": localStorage.getItem('selectitemId'),
      "OperatorID": this.operatorId,
      "DrugTest": this.drug == "Yes" ? "Y" : "N",
      "Suspend": this.suspend == "Yes" ? "Y" : "N",
      "Injury": this.injury == "Yes" ? "Y" : "N",
      "Action": "",
      "Description": "",
      "Date": this.incidentDate,
      "Cost": this.cost1,
      "Comment": this.comment,
      "Damage": this.damage
    }).subscribe(data => {
      try {
        let body: any = data.json();
        if (body.Status) {
            this.editEnabled = false;
          // let subdialogRef = this.dialog.open(CommonDailog, {
          //   data: { name: 'Are you sure wnt to Apply ?' }
          // });
          // subdialogRef.afterClosed().subscribe(result => {
          //   if (result == 'Yes') {
          //     this.closeHelpcontainer();
          //   }
          // })
          this.toastr.success(body.Message, 'Success!')

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
  goBack() {
    let subdialogRef = this.dialog.open(CommonDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.closeHelpcontainer();
      }
    })
  }
  closeHelpcontainer() {
    document.body.style.overflowY="auto";
    this.incidentbar.nativeElement.style.paddingLeft = "0";
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.incidentbar.nativeElement.style.width = "0";
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
        this.dept = '';
        this.operatorName = ''
        this.incident = '';
        this.injury = ''
        this.drug = '';
        this.assetval = ''
        this.incidentDate = '';
        this.cost1 = '';
        this.corrective = '';
        this.suspend = ''
        this.comment = ''
        this.closeHelpcontainer();
      }
    })


  }

  editHomeEnabled: boolean = false;
  editHome() {
    this.editHomeEnabled = true;
  }
  cancelHomeEdit() {
    this.editHomeEnabled = false;
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
  SelectSiteMenu(site) {

    this.selectdropdownitem = site.Name;
  }
  clickHistory() {
    this.valueChange.emit(true);
  }
  GetAssetsList() {

    var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    let url = 'TrackingHistory/assetlistwithsite?id=' + computedID;
    this.assetList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.assetList = body.Data;

      })
  }

  departmentListFun() {
    var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    let url = 'TrackingHistory/departmentlistwithsite?id=' + computedID;
    this.departmentList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.departmentList = body.Data;

      })
  }

  GetOperatorList() {
    let url = 'TrackingHistory/operatorlistwithsite?id=' + localStorage.getItem('selectitemId');
    this.operatorList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        if (body.Data.length != 0) {
          this.operatorList = body.Data;
        }
      })
  }
}