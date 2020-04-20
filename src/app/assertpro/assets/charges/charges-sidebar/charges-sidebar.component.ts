import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { ConfirmationDailog } from 'src/app/assertpro/usersdirectory/usersdirectory.component';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Charges } from './charges.model';

@Component({
  selector: 'charges-sidebar-component',
  templateUrl: './charges-sidebar.component.html',
  styleUrls: ['./charges-sidebar.component.css']
})
export class ChargesSidebarComponent implements OnInit {

  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('side') side: ElementRef;
  datas: any;

  vendor: string = 'Modern Handing Group';
  make: string = '';
  //model: string = '';
  logtitude: string = '';
  latitude: string = '';
  serialNO: string = '765-97654-9765';
  installDate: Date = new Date('04/11/2018 03:48 PM');
  leastRendal: string = '';
  aquationDate: Date = new Date('12/09/2018');
  acuationCost: string = '$5,987';
  acuationType: string = 'buy';
  deviceModelList = [];
  unitId:string = 'F0986564';
  unitType:string = 'Advanced';
  modemType:any = 'N/A';

  sidebarActive(info) {
    this.sidebarmenu = info;
    this.editEnabled = false;
  }

  sidebarmenu: string = 'asset';
  fwVersion: string = '1.35';
  icicdNo: string = '';
  serialNo: string = '987654437890';
  constructor(private toastr: ToastrService, private assetprohelperService: AssetprohelperService, public dialog: MatDialog) {
  }
  siteName
  siteId
  model=new Charges()
  ngOnInit() {
    this.getuserSites();
    this.departmentListFun(undefined)
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
  
        this.departmentListFun(undefined);
      } else {
        this.siteId = '';
        return;
      }
    });
  }
  private serviceSubscription: Subscription;
  @Output() saveEmit = new EventEmitter();
  ngOnDestroy() {

    this.serviceSubscription.unsubscribe();
  }
  departmentList = []
  assetList: any;
  assetTypeList = []

  GetAssetsList(siteID) {
    this.model.assetTypeID = ''
    this.model.assetTypeName = ''
    //var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    let url = 'TrackingHistory/assetlistwithsite?id=' + siteID;
    this.assetList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {

        let body: any = JSON.parse(data['_body']);
        this.assetList = body.Data;
      })
  }


  departmentListFun(id) {
    var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    if (id != undefined) {
      computedID = id;
    }
    let url = 'TrackingHistory/departmentlistwithsite?id=' + computedID;
    this.departmentList = [];
    this.Department=''
    this.DepartmentId=''
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.departmentList = body.Data;

      })
  }
  assetSelection(data, index) {

    this.model.assetTypeName = data.assetstype
    this.model.assetTypeID=data.ID
  }
  assetName;
  AssetType;
  Department = '';
  DepartmentId=''
  asset: boolean = true;
  tabChange(value) {
    this.asset = value;
  }
  public sidebar: any = false;
  mainDataList
  vendorList = ['Modern Handing Group']
  aquationList = [{ key: 0, value: 'Buy' }, { key: 1, value: 'Rent' }, { key: 2, value: 'Lease' }, { key: 3, value: 'Borrow' }]
  opensideBar(data, mainData, subGrid) {
    this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    document.body.style.overflowY="hidden"
    this.model = new Charges()
    this.mainDataList = mainData
    this.sidebar = !this.sidebar;
    this.editEnabled = false
    this.editHomeEnabled = false
    this.sidebarmenu = 'asset';
    this.AssetType = mainData.name;
    this.assetName = mainData.AssetTypeName
    if(mainData.ID!=null && mainData.ID!=undefined && mainData.ID!=''){
      this.assignedDeparment(mainData.ID)
    }
    this.asset = true;
    //this.model.vendorName = 'Modern Handing Group';
    this.make = '';
    
    this.Department = 'Klins'
    this.serialNO = '';
    this.installDate = new Date('04/11/2018 03:48 PM');
    this.leastRendal = '';
    this.aquationDate = new Date('12/09/2018');
    this.acuationCost = '$5,987';
    this.acuationType = 'buy';
    this.fwVersion = '1.35';
    this.icicdNo = '';
    this.serialNo = '987654437890';
    this.selectdropdownitem = localStorage.getItem('sitename')
    //if (!this.sidebar) {
    this.myDiv.nativeElement.style.width = "0";
    
    this.side.nativeElement.style.width = "100%";
    // }
    //if (this.sidebar) {
    if (screen.availWidth >= 1920) {
      this.myDiv.nativeElement.style.width = "55%";
    }
    let width = '55%'
    if (screen.availWidth <= 576) {
      width = '98%'
      this.myDiv.nativeElement.style.right = 'unset';
    }
    else if (screen.availWidth <= 768) {
      width = '90%'
    }
    else if (screen.availWidth <= 992) {
      width = '80%'
    }
    else if (screen.availWidth <= 1200) {
      width = '66%'
    }
    this.myDiv.nativeElement.style.width = width;
    this.myDiv.nativeElement.style.width = "60%";
    // }
    this.loadOtherDeatails(mainData)
  }
  actuationChange(data) {
    this.model.acquisitionType = data.key
    this.model.acquisition = data.value
  }
  loader=false
  assignedDeparment(assetID) {
    try {
      this.loader = true
      this.DepartmentId=null
      this.Department=''
      this.assetprohelperService.PostMethod("Asset/GetDepartmentUsingAssetID", { "AssetID": assetID }).subscribe(response => {
        this.loader = false;
        try {
          let body = response.json();
          if (body.Status) {
            if(body.Data!=null && body.Data!=undefined && body.Data.length!=0){
              this.DepartmentId=body.Data[0].SiteID
              this.Department=body.Data[0].Name
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
  departmentChange(data){
    
    this.Department=data.NAME
    this.DepartmentId=data.ID
    this.model.departmentName.push(data.NAME)
    this.model.departmentId.push(data.ID)
  }
  subGridDatas
  loadOtherDeatails(element) {
    this.loader = true;
    this.subGridDatas = undefined
    this.assetprohelperService.PostMethod('Asset/GetAssetTableDetailsByID', { "ID": element.ID })
      .subscribe(data => {
        
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Data != null && body.Data != undefined && body.Data.length != 0) {
          this.subGridDatas = body.Data[0];
          if (body.Data[0].RentalTimerDataJSON != undefined) {
            var RentalTimerDataJSON = body.Data[0].RentalTimerDataJSON
            RentalTimerDataJSON = RentalTimerDataJSON.substr(8);
            RentalTimerDataJSON = RentalTimerDataJSON.substring(0, RentalTimerDataJSON.length - 1);
            this.subGridDatas.RentalTimerDataJSON = JSON.parse(RentalTimerDataJSON);
          } else {
            this.subGridDatas.RentalTimerDataJSON = undefined
          }
          this.assignModel(this.subGridDatas)
        }
      });
  }
  goBack(){
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        this.editHomeEnabled = false;
        this.closeHelpcontainer()
      }
    });
  }
  closeHelpcontainer() {
    document.body.style.overflowY="auto"
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.paddingLeft = "0";
  }
  editEnabled: boolean = false;
  onEditClilck() {
    this.editEnabled = true;
    if (this.asset) {

    } else {

    }

  }
  cancelEdit() {
    let parent = this;
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to Cancel ?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        parent.editHomeEnabled = false;
        this.editEnabled = false;
        this.vendor = 'Modern Handing Group';
        this.make = '';
        //this.model = '';
        this.serialNO = '765-97654-9765';
        this.installDate = new Date('04/11/2018 03:48 PM');
        this.leastRendal = '';
        this.aquationDate = new Date('12/09/2018');
        this.acuationCost = '$5,987';
        this.acuationType = 'buy';
        this.fwVersion = '1.35';
        this.icicdNo = '';
        this.serialNo = '987654437890';
        this.logtitude = ''
        this.closeHelpcontainer();
      }
    });
  }
  save() {
    let parent = this;
    if (this.sidebarmenu != 'asset') {
      if (this.serialNo == undefined || this.serialNo == '' || this.serialNo.trim() == '') {
        this.toastr.warning("SerialNo is Mandatory", "Warning");
        return;
      }
      if (this.model.model == undefined || this.model.model == '' || this.model.model.trim() == '') {
        this.toastr.warning("Model is Mandatory", "Warning");
        return;
      }
    }
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to APPLY this Action?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        this.saveAPI();
      }
    });


  }
  saveAPI() {
    
    this.assetprohelperService.PostMethod('Asset/UpdateAssetUsingID', {
      "ID": this.model.id,
      "VendorID": this.model.vendorId,
      "Make": this.model.make,
      "Model": this.model.model,
      "SerialNo": this.model.serialNo,
      "InstallDate": this.model.installDate,
      "LeaseRental": this.model.leaseRental,
      "LeaseRentalDate": this.model.leaseRentalDate,
      "LeaseRentalHours": this.model.leaseRentalHours,
      "AcquisitionType": this.model.acquisitionType,
      "AcquisitionDate": this.model.acquisitionDate,
      "AcquisitionCost": this.model.acquisitionCost,
      "UnitID": this.model.unitID,
      "UnitSerialNo": this.model.unitSerialNo,
      "UnitModel": this.model.unitModel
    }).subscribe(response => {
      
      let body: any = response.json();
      if (body.Status) {
        this.toastr.success(body.Message, 'Success!');
        this.editEnabled = false;
        this.saveEmit.emit(true)
        this.closeHelpcontainer();
      }
      else {
        this.toastr.warning(body.Message, "Warning");
      }
    });
  }
  editHomeEnabled: boolean = false;
  editHome() {
    this.editHomeEnabled = true;
  }
  cancelHomeEdit() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to Cancel?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        this.editHomeEnabled = false;
        this.editHomeEnabled = false;
        this.AssetType = this.mainDataList.name;
        this.assetName = this.mainDataList.AssetTypeName
        this.selectdropdownitem = localStorage.getItem('sitename')
        this.getuserSites();
        this.closeHelpcontainer()
      }
    });
  }
  saveHome() {
    if (this.model.assetTypeID == undefined || this.model.assetTypeID == '' || this.AssetType == null) {
      this.toastr.warning("AssetType is Mandatory", "Warning");
      return;
    }
    if (this.model.name == undefined || this.model.name == '' || this.model.name == null || this.model.name.trim() == '') {
      this.toastr.warning("Name is Mandatory", "Warning");
      return;
    }
    if (this.DepartmentId == undefined || this.DepartmentId == '' || this.DepartmentId == null || this.DepartmentId.trim() == '') {
      this.toastr.warning("Department is Mandatory", "Warning");
      return;
    }
    let parent = this;
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to APPLY this Action?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        //parent.editHomeEnabled = false;
        //parent.toastr.success("Updated Successfully", 'Success!');
        //this.closeHelpcontainer()
        this.saveHomeAPI()
      }
    });

  }
  saveHomeAPI() {
    
    this.assetprohelperService.PostMethod('Asset/UpdateAssetSiteUsingIDs', {
      "AssetTypeID": this.model.assetTypeID,
      "AssetID": this.model.id,
      "name": this.model.name,
      "SiteID": this.model.siteId,
      "DepartmentIds": [this.DepartmentId]
    }).subscribe(response => {
    
      let body: any = response.json();
      if (body.Status) {
        this.toastr.success(body.Message, 'Success!');
        this.editEnabled = false;
        this.saveEmit.emit(true)
        this.closeHelpcontainer();
      }
      else {
        this.toastr.warning(body.Message, "Warning");
      }
    });
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
        this.usersites = this.usersites.filter(a => { return a.SiteID != null; })
        for (var i = 0; i < this.usersites.length; i++) {
          if (this.usersites[i].SiteID == localStorage.getItem('selectitemId')) {
            this.selectdropdownitem = this.usersites[i].Name;
            this.model.siteName = this.usersites[i].Name;
            this.model.siteId = this.usersites[i].SiteID
            this.GetAssetsList(this.usersites[i].SiteID);
          }
        }
        if (this.usersites.length == 0) {
          this.disabled = true;
        }
      })
  }
  SelectSiteMenu(site) {

    this.selectdropdownitem = site.Name;
    this.Department = ''
    this.model.siteId = site.SiteID
    this.model.siteName = site.Name
    this.departmentListFun(site.SiteID);
    this.GetAssetsList(site.SiteID);
  }
  assignModel(data) {
    this.model.siteName = this.siteName
    this.model.siteId = this.siteId
    this.model.id = this.mainDataList.ID
    this.model.assetTypeID = this.mainDataList.AssetTypeID
    this.model.assetTypeName = this.mainDataList.AssetTypeName
    this.model.name = this.mainDataList.name
    this.model.acquisitionCost = data.AcquisitionCost
    this.model.acquisitionDate = new Date(data.AcquisitionDate)
    this.model.acquisitionType = data.AcquisitionType
    this.model.acquisition = data.AcquisitionName
    this.model.iCCID = data.ICCID
    this.model.installDate = new Date(data.InstallDate)
    this.model.leaseRental = data.LeaseRental
    this.model.make = data.Make
    this.model.model = data.Model
    this.model.modemTypeCode = data.ModemTypeCode
    this.model.modemTypeName = data.ModemTypeName
    this.model.unitID = data.UnitID
    this.model.unitModel = data.UnitModel
    this.model.vendorId = data.VendorID
    this.model.unitName=data.UnitTypeName
    this.model.vendorName = data.VendorName
    this.model.version = data.Version
    this.model.serialNo=data.SerialNo
    this.model.unitSerialNo=data.UnitSerialNo
    if(data.LeaseRentalDate!=null && data.LeaseRentalDate!=undefined){
      this.model.leaseRentalDate=new Date(data.LeaseRentalDate)
    }else{
      this.model.leaseRentalDate=null;
    }
    this.model.leaseRentalHours=data.LeaseRentalHours

  }
}