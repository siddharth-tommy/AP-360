import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';

export interface Fruit {
  name: string;
  index: any;
};

@Component({
  selector: 'app-adddelivery',
  templateUrl: './adddelivery.component.html',
  styleUrls: ['./adddelivery.component.css']
})
export class AdddeliveryComponent implements OnInit, OnDestroy {

  @ViewChild('side') side: ElementRef;
  constructor(private toastr: ToastrService, public assetprohelperService: AssetprohelperService, public dialog: MatDialog) { }

  private serviceSubscription: Subscription;
  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      if (localStorage.getItem('selectitemId') == undefined || localStorage.getItem('selectitemId') == null ||
        localStorage.getItem('selectitemId') == 'null') {
        //  this.toastr.warning("Single Site Is Mandatory", 'Warning!');
        return;
      }
      this.GetAssetsList();
      this.departmentListFun();
      this.GetOperatorList();
      this.GetAlarmList();
      this.GetRecipientList();
    });
  }
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  department;
  assettypetxt;
  assettxt;
  department2txt;
  operatortxt;
  alarmtxt;
  recipienttxt;
  assets = []
  assetTypeSelected: any = []
  departmentList = [];
  departmentSelectionList: any = []
  departmentList2 = [];
  departmentSelectionList2 = [];
  assetSelected = []
  operatorList = []
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  smsCheckbox: boolean;
  emailCheckbox: boolean;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  GetAssetsList() {

    var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    let url = 'TrackingHistory/assetlistwithsite?id=' + computedID;
    this.assets = [];
    this.assetTypeSelected = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.assets = body.Data;

      })
  }

  departmentListFun() {

    var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    let url = 'TrackingHistory/departmentlistwithsite?id=' + computedID;
    this.departmentList = [];
    this.departmentSelectionList = []
    this.departmentList2 = [];
    this.departmentSelectionList2 = []
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.departmentList = body.Data;
        this.departmentList2 = body.Data;

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

  GetAlarmList() {
    let url = 'Notification/AlarmListWithSite?id=' + localStorage.getItem('selectitemId');
    this.alarmList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        if (body.Data.length != 0) {
          this.alarmList = body.Data;
        }
      })
  }
  GetRecipientList() {
    let url = 'Notification/RecipientListWithSite?id=' + localStorage.getItem('selectitemId');
    this.recipientList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        if (body.Data.length != 0) {
          this.recipientList = body.Data;
        }
      })
  }

  @Output() valueChange = new EventEmitter();

  @ViewChild('addDelivery') myDiv: ElementRef;
  asset: boolean;
  editHomeEnabled: boolean;
  // dialog: any;
  name: string = ''


  public sidebar: any = false;
  opensideBar1(data) {
    this.asset = true;

    this.side.nativeElement.style.width = "100%";
    if (screen.availWidth == 1280) {
      this.myDiv.nativeElement.style.width = "70%";
    } else
      this.myDiv.nativeElement.style.width = "60%";
    this.department = '';
    this.assettypetxt = '';
    this.assettxt = '';
    this.department2txt = '';
    this.operatortxt = '';
    this.alarmtxt = '';
    this.recipienttxt = '';
    this.EmailList = []
    this.tempEmail = ''
    this.assignData(data)
  }
  tempEmail
  addemail() {
    if (this.tempEmail != null && this.tempEmail != undefined && this.tempEmail != '' && this.tempEmail.trim() != '') {
      this.EmailList.push(this.tempEmail);
      this.tempEmail = ''
    }
  }
  assignData(data) {
    if (data != undefined) {
      this.name = data.Name
      this.EmailList = data.Emails
      this.smsCheckbox = data.SMS == 'Y' ? true : false
      this.emailCheckbox = data.Email == 'Y' ? true : false
      data.Operators.forEach(element => {
        let res = this.operatorList.filter(a => { return element.name == a.name })
        if (res.length != 0) {
          let index2 = this.operatorList.indexOf(res)
          if (res.length == 0) {
            this.operatorSelectionList.push({ 'name': name, 'index': index2 });
          }
        }
      });
      data.Assets.forEach(element => {
        this.assetSelected.push({ 'name': element.name,'ID':element.ID });
      })
    }
  }
  goBack() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.closeHelpcontainer()
      }
    })
  }
  cancel() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to cancel ?' }
    });
    let parent=this;
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        parent.closeHelpcontainer()
      }
    })
  }
  EmailList = []
  closeHelpcontainer() {
    this.asset = false;
    //this.name='';
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    //this.closeHelpcontainer()
  }
  reSet() {
    this.name = ''
    this.department = ''
    this.assettypetxt = ''
    this.assettxt = ''
    this.department2txt = ''
    this.operatortxt = ''
    this.alarmtxt = ''
    this.recipienttxt = '';
    this.smsCheckbox = false;
    this.emailCheckbox = false;
    this.departmentSelectionList = [];
    this.operatorSelectionList = [];
    this.assetTypeSelected = [];
    this.assetSelected = [];
    this.alarmSelectionList = [];
    this.recipientSelectionList = []
  }
  apply() {
    if (this.name == '') {
      this.toastr.warning("Notification Name is Mandatory", "Warning");
      return
    }

    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to APPLY this Action ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.toastr.success("Created Successfully", 'Success!');
        this.valueChange.emit(true);
        this.closeHelpcontainer()
      }
    })
  }
  remove(fruit: Fruit): void {
    const index = this.assetTypeSelected.indexOf(fruit);
    if (index >= 0) {
      this.assetsList = []
      this.assetSelected = []
      this.assetTypeSelected.splice(index, 1);
      this.assetTypeSelected.forEach(a => {
        let data = this.assets[a.index].assets
        data.forEach(b => {
          this.assetsList.push(b);
        });
      });
    }
  }
  remove2(fruit: Fruit): void {
    const index = this.assetSelected.indexOf(fruit);

    if (index >= 0) {
      this.assetSelected.splice(index, 1);
    }
  }
  assetsList = []
  assetTypeSelection(index, record) {
    // let name = this.assets[index].assetstype;
    let index2 = this.assets.indexOf(record)
    let name = this.assets[index2].assetstype;
    this.assetsList = []
    let res = this.assetTypeSelected.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.assetTypeSelected.push({ 'name': name, 'index': index2 });
      this.assetTypeSelected.forEach(a => {
        let data = this.assets[a.index].assets
        data.forEach(b => {
          this.assetsList.push(b);
        });
      });

    }
  }
  selectAllAssetType() {
    this.assetTypeSelected = []
    this.assetsList = []
    this.assets.forEach((a, index) => {
      this.assetTypeSelected.push({ 'name': a.assetstype, 'index': index });
      let data = a.assets
      data.forEach(b => { this.assetsList.push(b); });
    });
  }
  assetSelection(index, record) {
    //let name = this.assetsList[index].name;
    let index2 = this.assetsList.indexOf(record)
    let name = this.assetsList[index2].name;
    let res = this.assetSelected.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.assetSelected.push({ 'name': name });
    }
  }
  selectAllAssets() {
    this.assetSelected = []
    this.assetsList.forEach(a => {
      this.assetSelected.push({ 'name': a.name });
    });
  }
  departmentSelection(index, record) {
    //  let name = this.departmentList[index].NAME;
    let index2 = this.departmentList.indexOf(record)
    let name = this.departmentList[index2].NAME;
    let res = this.departmentSelectionList.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.departmentSelectionList.push({ 'name': name, 'index': index2 });
    }
  }
  selectAllDepartment() {
    this.departmentSelectionList = []
    this.departmentList.forEach((a, index) => {
      this.departmentSelectionList.push({ 'name': a.NAME, 'index': index });
    });
  }
  removedeparment(fruit: Fruit): void {
    const index = this.departmentSelectionList.indexOf(fruit);

    if (index >= 0) {
      this.departmentSelectionList.splice(index, 1);
    }
  }
  operatorSelectionList: any = []
  operatorSelection(index, record) {
    //let name = this.operatorList[index].OperatorName;
    let index2 = this.operatorList.indexOf(record)
    let name = this.operatorList[index2].OperatorName;
    let res = this.operatorSelectionList.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.operatorSelectionList.push({ 'name': name, 'index': index2 });
    }
  }
  selectAlloperator() {
    this.operatorSelectionList = []
    this.operatorList.forEach((a, index) => {
      this.operatorSelectionList.push({ 'name': a.OperatorName, 'index': index });
    });
  }
  removeoperator(fruit: Fruit): void {
    const index = this.operatorSelectionList.indexOf(fruit);

    if (index >= 0) {
      this.operatorSelectionList.splice(index, 1);
    }
  }
  alarmList = []
  alarmSelectionList = []
  alarmSelection(index, record) {
    //let name = this.operatorList[index].OperatorName;
    let index2 = this.alarmList.indexOf(record)
    let name = this.alarmList[index2].AlarmTypeName;
    let res = this.alarmSelectionList.filter(a => { return name == a.AlarmTypeName })
    if (res.length == 0) {
      this.alarmSelectionList.push({ 'AlarmTypeName': name, 'index': index2 });
    }
  }
  selectAllselection() {
    this.alarmSelectionList = []
    this.alarmList.forEach((a, index) => {
      this.alarmSelectionList.push({ 'AlarmTypeName': a.AlarmTypeName, 'index': index });
    });
  }
  removeselection(fruit: Fruit): void {
    const index = this.alarmSelectionList.indexOf(fruit);

    if (index >= 0) {
      this.alarmSelectionList.splice(index, 1);
    }
  }
  recipientList = []
  recipientSelectionList = []
  recipientSelection(index, record) {
    //let name = this.operatorList[index].OperatorName;
    let index2 = this.recipientList.indexOf(record)
    let name = this.recipientList[index2].WebUserName;
    let res = this.recipientSelectionList.filter(a => { return name == a.WebUserName })
    if (res.length == 0) {
      this.recipientSelectionList.push({ 'WebUserName': name, 'index': index2 });
    }
  }
  selectAllrecipient() {
    this.recipientSelectionList = []
    this.recipientList.forEach((a, index) => {
      this.recipientSelectionList.push({ 'WebUserName': a.WebUserName, 'index': index });
    });
  }
  removerecipient(fruit: Fruit): void {
    const index = this.recipientSelectionList.indexOf(fruit);

    if (index >= 0) {
      this.recipientSelectionList.splice(index, 1);
    }
  }
  alertSelected = []
  alerttxt;
  alertList = []
  alertSelection() { }
}
