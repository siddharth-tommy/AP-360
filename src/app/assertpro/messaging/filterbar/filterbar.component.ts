import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';

export interface Fruit {
  name: string;
  index: any;
}
@Component({
  selector: 'app-filterbar',
  templateUrl: './filterbar.component.html',
  styleUrls: ['./filterbar.component.css']
})
export class FilterbarComponent implements OnInit, OnDestroy {
  fromtimeBy_Asset: any
  to_timeBy_Asset: any
  fromtimeBy_Operator: any
  to_timeBy_Operator: any

  @ViewChild('myDiv') myDiv: ElementRef;
  asset: boolean;
  private serviceSubscription: Subscription;
  @ViewChild('side') side: ElementRef;
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
      this.GetOperatorList();
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
  public sidebar: any = false;
  opensideBar1() {
    document.body.style.overflowY="hidden";
    this.side.nativeElement.style.width = "100%";
    this.asset = true;
    this.myDiv.nativeElement.style.width = "60%";
    if (screen.availWidth == 1280) {
      this.myDiv.nativeElement.style.width = "70%";
    }
  //   this.assetSelected = []
  //   this.assetTypeSelected = []
  //   this.departmentSelectionList = []
  //   this.departmentSelectionList2 = []
  //   this.operatorSelectionList = []
  //   this.tabIndex = 0;
  //   this.department = '';
  //   this.assettypetxt = '';
  //   this.assettxt = '';
  //   this.department2txt = '';
  //   this.operatortxt = '';
   }
  clear() {
   
    let parent = this;
      
        this.clearDatas();
        let datas: any = {
          asset: [],
          assetFromDate: null,
          assetToDate: null,
          operatorFromDate: null,
          timeByToDate: null,
          opeator: []
        }
        this.saveEmit.emit(datas);
      
  }
  clearDatas() {
    this.assetSelected = []
    this.assetsList=[]
    this.assetTypeSelected = []
    this.departmentSelectionList = []
    this.departmentSelectionList2 = []
    this.operatorSelectionList = []
    this.department = '';
    this.assettypetxt = '';
    this.assettxt = '';
    this.department2txt = '';
    this.operatortxt = '';
    this.fromtimeBy_Asset = ''
    this.to_timeBy_Asset = ''
    this.fromtimeBy_Operator = ''
    this.to_timeBy_Operator = ''

  }
  cancelSidebar() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to cancel ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.closeHelpcontainer()
        this.clear()
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
        this.clear()
      }
    })
  }
  closeHelpcontainer() {
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    document.body.style.overflowY="auto";
  }
  @Output() saveEmit = new EventEmitter();
  apply() {
    if(this.tabIndex==0){
    if (this.departmentSelectionList.length == 0) {
      this.toastr.warning("Department is Mandatory", "Warning");
      return;
    }
    if (this.fromtimeBy_Asset == undefined || this.fromtimeBy_Asset == '' || this.fromtimeBy_Asset == null) {
      this.toastr.warning("FromDate is Mandatory", "Warning");
      return;
    }
    if (this.to_timeBy_Asset == undefined || this.to_timeBy_Asset == '' || this.to_timeBy_Asset == null) {
      this.toastr.warning("ToDate is Mandatory", "Warning");
      return;
    }
    if (this.fromtimeBy_Asset>=this.to_timeBy_Asset) {
      this.toastr.warning("To Date and Time Should be Greater", "Warning");
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
    }else{
    if (this.departmentSelectionList2.length == 0) {
      this.toastr.warning("Department is Mandatory", "Warning");
      return;
    }
    if (this.fromtimeBy_Operator == undefined || this.fromtimeBy_Operator == '' || this.fromtimeBy_Operator == null) {
      this.toastr.warning("FromDate is Mandatory", "Warning");
      return;
    }
    if (this.to_timeBy_Operator == undefined || this.to_timeBy_Operator == '' || this.to_timeBy_Operator == null) {
      this.toastr.warning("ToDate is Mandatory", "Warning");
      return;
    }
    if (this.fromtimeBy_Operator>=this.to_timeBy_Operator) {
      this.toastr.warning("To Date and Time Should be Greater", "Warning");
      return;
    }
    if (this.operatorSelectionList.length == 0) {
      this.toastr.warning("Operator is Mandatory", "Warning");
      return;
    }
    }
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to apply ?' }
    });
    let parent = this;
    subdialogRef.afterClosed().subscribe(result => {

      if (result == 'Yes') {
        parent.toastr.success("Filter is Applied Successfully", 'Success!');
        let opeatorList = []
        let assetsList = []
        let fromDate=null
        let toDate=null;
        if(parent.tabIndex==0){
          parent.assetSelected.forEach(element => {
            assetsList.push(element.Id)
          })
          fromDate= parent.fromtimeBy_Asset
          toDate= parent.to_timeBy_Asset
        }else{
          parent.operatorSelectionList.forEach(element => {
            opeatorList.push(element.Id)
          })
          fromDate= parent.fromtimeBy_Operator
          toDate= parent.to_timeBy_Operator
        }
        let datas: any = {
          asset: assetsList,
          assetFromDate: fromDate,
          assetToDate: toDate,
          opeator: opeatorList
        }
        parent.saveEmit.emit(datas);
        parent.closeHelpcontainer();
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

  GetOperatorList() {
    let url = 'TrackingHistory/operatorlistwithsite?id=' + localStorage.getItem('selectitemId');
    this.operatorList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
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
    this.assetSort()
  }
  selectAllAssetType() {
    this.assettypetxt='';
    this.assetTypeSelected = []
    this.assetsList = []
    this.assets.forEach((a, index) => {
      this.assetTypeSelected.push({ 'name': a.assetstype, 'index': index });
      let data = a.assets
      data.forEach(b => { this.assetsList.push(b); });
    });
    this.assetSort()
  }
  assetSelection(index, record) {
    //let name = this.assetsList[index].name;
    let index2 = this.assetsList.indexOf(record)
    let name = this.assetsList[index2].name;
    let res = this.assetSelected.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.assetSelected.push({ 'name': name, Id: record.ID });
    }
  }
  selectAllAssets() {
    this.assettxt='';
    this.assetSelected = []
    this.assetsList.forEach(a => {
      this.assetSelected.push({ 'name': a.name, Id: a.ID });
    });
  }
  tabIndex = 0;
  loader=false
  departmentList = []
  departmentSelectionList = []
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
    this.department = '';
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
  departmentList2 = []
  departmentSelectionList2 = []
  departmentSelection2(index, record) {
    // let name = this.departmentList2[index].NAME;
    let index2 = this.departmentList2.indexOf(record)
    let name = this.departmentList2[index2].NAME;
    let res = this.departmentSelectionList2.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.departmentSelectionList2.push({ 'name': name, 'index': index2 });
    }
  }
  selectAllDepartment2() {
    this.department2txt='';
    this.departmentSelectionList2 = []
    this.departmentList2.forEach((a, index) => {
      this.departmentSelectionList2.push({ 'name': a.NAME, 'index': index });
    });
  }
  removedeparment2(fruit: Fruit): void {
    const index = this.departmentSelectionList2.indexOf(fruit);

    if (index >= 0) {
      this.departmentSelectionList2.splice(index, 1);
    }
  }
  operatorList = []
  operatorSelectionList = []
  operatorSelection(index, record) {
    //let name = this.operatorList[index].OperatorName;
    let index2 = this.operatorList.indexOf(record)
    let name = this.operatorList[index2].OperatorName;
    let res = this.operatorSelectionList.filter(a => { return name == a.name })
    if (res.length == 0) {
      this.operatorSelectionList.push({ 'name': name, 'index': index2, Id: record.ID });
    }
  }
  selectAlloperator() {
    this.operatortxt='';
    this.operatorSelectionList = []
    this.operatorList.forEach((a, index) => {
      this.operatorSelectionList.push({ 'name': a.OperatorName, 'index': index, Id: a.ID });
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
