import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
import { MatDialog } from '@angular/material';
import { Equipment } from './equipment.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'sidebar-component',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('side') side: ElementRef;

  @Output() saveEmit = new EventEmitter();
  datas: any;
  make: string = '';
  models: string = '';
  serialNO: string = '765-97654-9765';
  installDate: Date = new Date('04/11/2018 03:48 PM');
  leastRendal: string = '';
  aquationDate: Date = new Date('12/09/2018');
  acuationCost: string = '$5,987';
  acuationType: string = 'buy';
  departmentList = []
  assetList: any;
  assetTypeList = []
  unitId: any = 'F0986564';
  unitType: string = 'Advanced';
  modemType: any = 'N/A';
  siteId: string;


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
    //this.assetTypeList = []
    //this.AssetType = '';
    //let row = this.assetList[index].assets
    //row.forEach(a => { this.assetTypeList.push(a) });
    //this.GetAssetsList(data.SiteID);

  }
  sidebarActive(info) {
    this.sidebarmenu = info;
    this.editEnabled = false;
  }

  sidebarmenu: string = 'asset';
  fwVersion: string = '1.35';
  icicdNo: string = '1';
  serialNo: string = '987654437890';
  constructor(private toastr: ToastrService, private assetprohelperService: AssetprohelperService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.model = new Equipment()
    this.getuserSites();
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      this.siteName = localStorage.getItem('sitename');
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
        this.loadVendor()
        this.departmentListFun(undefined);
      } else {
        this.siteId = '';
        return;
      }
    });
  }
  
  private serviceSubscription: Subscription;
  ngOnDestroy() {

    this.serviceSubscription.unsubscribe();
  }
  siteName
  asset: boolean = true;
  tabChange(value) {
    this.asset = value;
  }
  assetName;
  AssetType;
  public sidebar: any = false;
  Department = '';
  DepartmentId=''
  mainDataList
  vendorList = ['Modern Handing Group']
  aquationList = [{ key: 0, value: 'Buy' }, { key: 1, value: 'Rent' }, { key: 2, value: 'Lease' }, { key: 3, value: 'Borrow' }]
  opensideBar(data, mainData, subGrid) {
    document.body.style.overflowY="hidden";
    document.getElementById("additional-box").style.paddingLeft="4.17%"
    this.model = new Equipment()
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
    this.models = '';
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
      width = '60%'
    }
    this.myDiv.nativeElement.style.width = width;
    this.myDiv.nativeElement.style.width = "55%";
    // }
    this.loadOtherDeatails(mainData)
  }
  actuationChange(data) {
    this.model.acquisitionType = data.key
    this.model.acquisition = data.value
  }
  GetDepartmentUsingAssetID
  loadVendor() {
    try {
      this.loader = true
      this.assetprohelperService.PostMethod("Vendor/GetVendorList", { "SiteID": this.siteId }).subscribe(response => {
        this.loader = false;
        try {
          let body = response.json();
          if (body.Status) {
            this.vendorList = body.Data
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
  loader = false;
  subGridDatas: any;
  model = new Equipment();
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
  vendorChange(data) {
    this.model.vendorName = data.Name
    this.model.vendorId = data.ID
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
    // this.model.serialNumber = data.SerialNum
    this.model.modemTypeCode = data.ModemTypeCode
    this.model.modemTypeName = data.ModemTypeName
    this.model.unitID = data.UnitID
    this.model.unitModel = data.UnitModel
    this.model.unitName=data.UnitTypeName
    this.model.vendorId = data.VendorID
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
  goBack() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    let parent=this;
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        parent.closeHelpcontainer()
        document.body.style.overflowY="scroll";
        document.body.style.display="block";
      }
    })
  }
  closeHelpcontainer() {
    this.asset = false;
    document.body.style.overflowY="scroll";
    document.body.style.display="block";
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    document.getElementById("additional-box").style.paddingLeft="0"
  }
  editEnabled: boolean = false;
  onEditClilck() {
    //this.editEnabled=true;
    let parent = this;
    // let subdialogRef = this.dialog.open(ConfirmationDailog, {
    //   data: { name: 'Are you sure you want to Edit?' }
    // });

    // subdialogRef.afterClosed().subscribe(result => {
    //   if (result != undefined && result == 'Yes') {
    parent.editEnabled = true;
    // }
    // });
  }
  cancelEdit() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to Cancel ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.editEnabled = false;
        this.AssetType = this.model.name;
        this.assetName = this.model.assetTypeName
        this.asset = true;
        this.model.vendorName = 'Modern Handing Group';
        this.make = '';
        this.models = '';
        this.Department = 'Klins'
        this.serialNO = '765-97654-9765';
        this.installDate = new Date('04/11/2018 03:48 PM');
        this.leastRendal = '';
        this.aquationDate = new Date('12/09/2018');
        this.acuationCost = '$5,987';
        this.acuationType = 'buy';
        this.fwVersion = '1.35';
        this.icicdNo = '';
        this.serialNo = '987654437890';
        this.selectdropdownitem = localStorage.getItem('sitename')
        this.closeHelpcontainer()
      }
    })
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
  editHomeEnabled: boolean = false;
  editHome() {
    let parent = this;
    // let subdialogRef = this.dialog.open(ConfirmationDailog, {
    //   data: { name: 'Are you sure you want to Edit?' }
    // });

    // subdialogRef.afterClosed().subscribe(result => {
    //   if (result != undefined && result == 'Yes') {
    parent.editHomeEnabled = true;
    //   }
    // });
    // this.editHomeEnabled=true;
  }
  cancelHomeEdit() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to Cancel ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.editEnabled = false;
        this.editHomeEnabled = false;
        this.Department = 'Klins'
        this.AssetType = this.mainDataList.name;
        this.assetName = this.mainDataList.AssetTypeName
        this.selectdropdownitem = localStorage.getItem('sitename')
        this.closeHelpcontainer()
      }
    })

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
  departmentChange(data){
    
    this.Department=data.NAME
    this.DepartmentId=data.ID
    this.model.departmentName.push(data.NAME)
    this.model.departmentId.push(data.ID)
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
}