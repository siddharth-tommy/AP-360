import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';

export interface Fruit {
  name: string;
  index: any;
}
@Component({
  selector: 'app-messagebar',
  templateUrl: './messagebar.component.html',
  styleUrls: ['./messagebar.component.css']
})
export class MessagebarComponent implements OnInit, OnDestroy {

  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('side') side: ElementRef;
  asset: boolean;
  private serviceSubscription: Subscription;
  @Output() saveSucces = new EventEmitter();
  loader: boolean;
  constructor(private toastr: ToastrService, public assetprohelperService: AssetprohelperService, public dialog: MatDialog) { }

  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      if (localStorage.getItem('selectitemId') == undefined || localStorage.getItem('selectitemId') == null ||
        localStorage.getItem('selectitemId') == 'null') {
        //  this.toastr.warning("Single Site Is Mandatory", 'Warning!');
        return;
      }
      this.GetAssetsList();
      this.departmentListFun();
      this.clear();
    });

  }
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  public sidebar: any = false;
  department;
  assettypetxt;
  assettxt;
  department2txt;
  operatortxt;
  clear() {
    this.assetsList = []
    this.assetSelected = []
    this.assetTypeSelected = []
    this.departmentSelectionList = []
    this.departmentSelectionList2 = []
    this.operatorSelectionList = []
    this.operatorList = []
    this.tabIndex = 0;
    this.department = '';
    this.assettypetxt = '';
    this.assettxt = '';
    this.department2txt = '';
    this.operatortxt = undefined;
    this.assetMessage = '';
    this.assetAnswer1 = '';
    this.assetAnswer2 = '';
    this.assetAnswer3 = '';
    this.assetAnswer4 = '';
    this.assetAnswer3Enable = false;
    this.assetAnswer4Enable = false;
    this.operatorMessage = '';
    this.operatorAnswer1 = '';
    this.operatorAnswer2 = '';
    this.operatorAnswer3 = '';
    this.operatorAnswer4 = '';
    this.operatorAnswer3Enable = false
    this.operatorAnswer4Enable = false
  }
  opensideBar() {
    this.myDiv.nativeElement.style.overflowY = "auto";
    this.tabIndex = 0
    this.sidebar = !this.sidebar;
    this.asset = true;
    this.side.nativeElement.style.width = "100%"; 
    this.myDiv.nativeElement.style.width = "57%";
    document.body.style.overflowY="hidden";
    if (screen.availWidth == 1280) {
      this.myDiv.nativeElement.style.width = "70%";
    }
    this.clear()
  }
  cancelSidebar() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to cancel ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.clear();
        this.closeHelpcontainer()
      }
    })
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
  closeHelpcontainer() {
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    document.body.style.overflowY="auto";
  }
  apply() {
    this.createMessage();
  }
  assetMessage;
  assetAnswer1
  assetAnswer2
  assetAnswer3
  assetAnswer4
  assetAnswer3Enable: boolean = false;
  assetAnswer4Enable: boolean = false;
  tabIndex = 0
  assetAns() {
    if (this.assetAnswer3Enable) {
      this.assetAnswer4Enable = true
    } else {
      this.assetAnswer3Enable = true
    }
  }

  operatorMessage;
  operatorAnswer1
  operatorAnswer2
  operatorAnswer3
  operatorAnswer4
  operatorAnswer3Enable: boolean = false
  operatorAnswer4Enable: boolean = false
  addOperatorAns() {
    if (this.operatorAnswer3Enable) {
      this.operatorAnswer4Enable = true
    } else {
      this.operatorAnswer3Enable = true
    }
  }
  createMessage() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you want to apply?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        let assetIds = []
        if (this.tabIndex == 0) {
          if (this.departmentSelectionList.length == 0) {
            this.toastr.warning("Department is Mandatory", "Warning");
            return;
          }
          if (this.assetTypeSelected.length == 0) {
            this.toastr.warning("AssetType is Mandatory", "Warning");
            return;
          }
          if (this.assetSelected.length == 0) {
            this.toastr.warning("Asset is Mandatory", "Warning");
            return;
          }
          if (this.assetMessage == null || this.assetMessage == undefined || this.assetMessage.trim() == '') {
            this.toastr.warning("Message is Mandatory", "Warning");
            return;
          }
          if (this.assetAnswer1 == null || this.assetAnswer1 == undefined || this.assetAnswer1.trim() == '') {
            this.toastr.warning("Answer 1 is Mandatory", "Warning");
            return;
          }
          this.assetSelected.forEach(a => {
            assetIds.push(a.assetId)
          })
          this.loader = true;
          this.assetprohelperService.PostMethod('Message/CreateMessageByAssetIDs',
            {
              "AssetIDs": assetIds,
              // "WebUserID": "B72DC7B2-A3FC-432C-9696-0441741B1FBF",
              "Message": this.assetMessage,
              "Answer1": this.assetAnswer1,
              "Answer2": this.assetAnswer2,
              "SiteID": localStorage.getItem('selectitemId')
            }).subscribe(data => {
              try {
                let body: any = data.json();
                this.loader = false;
                if (body.Status) {
                  this.toastr.success(body.Message, 'Success!');
                  this.saveSucces.emit();
                  this.closeHelpcontainer();
                }
                else {
                  this.toastr.warning(body.Message, "Warning");
                }
              }
              catch (apierror) {
                console.log(apierror)
              }
            });
        } else {
          if (this.departmentSelectionList2.length == 0) {
            this.toastr.warning("Department is Mandatory", "Warning");
            return;
          }
          if (this.operatorSelectionList.length == 0) {
            this.toastr.warning("Operator is Mandatory", "Warning");
            return;
          }
          if (this.operatorMessage == null || this.operatorMessage == undefined || this.operatorMessage.trim() == '') {
            this.toastr.warning("Message is Mandatory", "Warning");
            return;
          }
          if (this.operatorAnswer1 == null || this.operatorAnswer1 == undefined || this.operatorAnswer1.trim() == '') {
            this.toastr.warning("Answer 1 is Mandatory", "Warning");
            return;
          }
          let operatorIds = []
          this.operatorSelectionList.forEach(row => { operatorIds.push(row.id) });
          this.loader = true;
          this.assetprohelperService.PostMethod('Message/CreateMessageByOperatorIDs',
            {
              "OperatorIDs": operatorIds,
              // "WebUserID": "B72DC7B2-A3FC-432C-9696-0441741B1FBF",
              "Message": this.operatorMessage,
              "Answer1": this.operatorAnswer1,
              "Answer2": this.operatorAnswer2,
              "SiteID": localStorage.getItem('selectitemId')
            }).subscribe(data => {
              try {
                let body: any = data.json();
                this.loader = false;
                if (body.Status) {
                  this.toastr.success(body.Message, 'Success!');
                  this.saveSucces.emit();
                  this.closeHelpcontainer();
                }
                else {
                  this.toastr.warning(body.Message, "Warning");
                }
              }
              catch (apierror) {
                console.log(apierror)
              }
            });
        }
      }
    })
  }
  assets = []
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

  GetOperatorList(ids) {
    let url = 'UsersDirectory/GetOperatorsByDepartmentIDs';
    this.operatorList = [];
    this.operatorSelectionList = []
    this.assetprohelperService.PostMethod(url, { DepartmentIDs: ids }).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        if (body.Data.length != 0) {
          this.operatorList = body.Data;
          this.operator()
        }
      })
  }
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  assetTypeSelected: Fruit[] = [];
  assetSelected = []
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
    ///this.assetsList = []
    let res = this.assetTypeSelected.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.assetsList = []
      this.assetTypeSelected.push({ 'name': name, 'index': index2 });
      this.assetTypeSelected.forEach(a => {
        let data = this.assets[a.index].assets
        data.forEach(b => {
          this.assetsList.push(b);
        });
      });

    }
    this.assetSort();
  }
  selectAllAssetType() {
    this.assettypetxt = '';
    this.assetTypeSelected = []
    this.assetsList = []
    this.assets.forEach((a, index) => {
      this.assetTypeSelected.push({ 'name': a.assetstype, 'index': index });
      let data = a.assets
      data.forEach(b => { this.assetsList.push(b); });
    });
    this.assetSort();

  }
  assetSelection(index, record) {
    //let name = this.assetsList[index].name;
    let index2 = this.assetsList.indexOf(record)
    let name = this.assetsList[index2].name;
    let res = this.assetSelected.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.assetSelected.push({ 'name': name, 'assetId': record.ID });
    }
  }
  selectAllAssets() {
    this.assettxt = '';
    this.assetSelected = []
    this.assetsList.forEach(a => {
      this.assetSelected.push({ 'name': a.name, 'assetId': a.ID });
    });
  }
  sidebarActive(info) {

  }
  departmentList = []
  departmentSelectionList = []
  departmentSelection(index, record) {
    //  let name = this.departmentList[index].NAME;
    let index2 = this.departmentList.indexOf(record)
    let name = this.departmentList[index2].NAME;
    let res = this.departmentSelectionList.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.departmentSelectionList.push({ 'name': name, 'index': index2, id: record.ID });
    }
    let deptIds = []
    this.departmentSelectionList.forEach(row => {
      deptIds.push(row.id)
    })
  }
  callOperator() {
    let deptIds = []
    this.departmentSelectionList2.forEach(row => {
      deptIds.push(row.id)
    })
    this.GetOperatorList(deptIds);
  }
  selectAllDepartment() {
    this.department = '';
    this.departmentSelectionList = []
    this.departmentList.forEach((a, index) => {
      this.departmentSelectionList.push({ 'name': a.NAME, 'index': index, id: a.ID });
    });
  }
  removedeparment(fruit: Fruit): void {
    const index = this.departmentSelectionList.indexOf(fruit);

    if (index >= 0) {
      this.departmentSelectionList.splice(index, 1);
    }

  }
  departmentList2 = []
  departmentSelectionList2 = []
  departmentSelection2(index, record) {
    // let name = this.departmentList2[index].NAME;
    let index2 = this.departmentList2.indexOf(record)
    let name = this.departmentList2[index2].NAME;
    let res = this.departmentSelectionList2.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.departmentSelectionList2.push({ 'name': name, 'index': index2, id: record.ID });
    }
    this.callOperator()
  }
  selectAllDepartment2() {
    this.department2txt = '';
    this.departmentSelectionList2 = []
    this.departmentList2.forEach((a, index) => {
      this.departmentSelectionList2.push({ 'name': a.NAME, 'index': index, id: a.ID });
    });
    this.callOperator()
  }
  removedeparment2(fruit: Fruit): void {
    const index = this.departmentSelectionList2.indexOf(fruit);

    if (index >= 0) {
      this.departmentSelectionList2.splice(index, 1);
    }
    this.callOperator()
  }
  operatorList = []
  operatorSelectionList = []
  operatorSelection(index, record) {
    //let name = this.operatorList[index].Name;
    let index2 = this.operatorList.indexOf(record)
    let name = this.operatorList[index2].Name;
    let res = this.operatorSelectionList.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.operatorSelectionList.push({ 'name': name, 'index': index2, id: record.OperatorID });
    }
  }
  selectAlloperator() {
    this.operatortxt = '';
    this.operatorSelectionList = []
    this.operatorList.forEach((a, index) => {
      this.operatorSelectionList.push({ 'name': a.Name, 'index': index, id: a.OperatorID });
    });
  }
  removeoperator(fruit: Fruit): void {
    const index = this.operatorSelectionList.indexOf(fruit);

    if (index >= 0) {
      this.operatorSelectionList.splice(index, 1);
    }
  }
  assetSort(){
    this.assetsList.sort((a: any, b: any) => {
      if (a['name'] < b['name']) {
        return -1;
      } else if (a['name'] > b['name']) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  operator(){
    this.operatorList.sort((a: any, b: any) => {
      if (a['Name'] < b['Name']) {
        return -1;
      } else if (a['Name'] > b['Name']) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
