import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDailog } from 'src/app/assertpro/usersdirectory/usersdirectory.component';
@Component({
  selector: 'createsite',
  templateUrl: './createsite.component.html',
  styleUrls: ['./createsite.component.css']
})
export class CreateSiteComponent implements OnInit {
  longDistanceList: any;

  countryList = [];
  statesList = [];
 
  @ViewChild('side') side: ElementRef;
  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService, public dialog: MatDialog,
    private _el: ElementRef) {
  }
  ngOnInit() {
    this.loadAdminList();
    this.loadSupervisorDetails();
    this.loadTemperatureList();
    this.loadLongDistanceList();
    this.loadShortDistanceList();
    this.loadSpeedList();
    this.loadMassList();
    this.loadNotifiThirdPartyList();
    this.countryArray();
    this.getTimezone();  
  }
  loader: boolean = false;
  @Output() saveorupdate = new EventEmitter();
  adminList = [1, 2, 3]
  departmentDetails: any = []
  settingsDetails: any = []
  supervisourList = [];
  timeZone = [1, 2, 3]
  Peplink = []
  temperatureList = []
  longDistance = []
  shortDistanceList = []
  shortDistance: string;
  speedList = []
  massList = []
  notifiThirdParty = []
  checkboxAll: boolean = false;
  checkbox1: boolean = false;
  checkbox2: boolean = false;
  checkbox3: boolean = false;

  @ViewChild('myDiv') myDiv: ElementRef;
  actualData;
  type: boolean = false;
  create: boolean = false
  openSidebar(data, type, create) {    
    this.udmenu = 'COMMON INFO'
    this.type = true;
    this.create = false;
    document.body.style.overflowY="hidden";
    this.myDiv.nativeElement.style.paddingLeft = "4.17%";
    if (type == true) {
      this.type = false;
    }
    if (create == true) {
      this.create = true;
    }
    this.actualData = data;
    this.side.nativeElement.style.width = "100%";
    let width = '55%'
    if (screen.availWidth <= 576) {
      width = '90%'
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
    if (create != null) {
      this.clear();
      return;
    }
    
    this.companyname = data.Name;
    this.adminname = data.AdminName
    this.phone = data.AdminPhone
    this.email = data.AdminEmail
    if (data.Address1 != undefined && data.Address1 != null)
      this.address = data.Address1.trim()
    this.country = data.Country;
    this.state = data.State
    this.city = data.City
    if (data.Zipcode != undefined && data.Zipcode != null && data.Zipcode != '')
      this.zip = data.Zipcode+""
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
    this.altusPlus = false;
    this.pepling = data.PeplinkOrgId
    if(!this.create){
      this.loadDeparmentDetails();
      this.loadSettingsDetails();
      this.countryId=data.CountryID
      this.stateId=data.StateID
      this.adminID=data.AdminID
      this.phone=data.Phone
      this.timezone=data.AssetProTimeZone
      this.timezoneId=data.TimeZoneID
      // this.department2='department'
      // this.adminname2='Sujaira'
      // this.phone2='99424242423'
      // this.email2='admin@gmail.com'
    }
    if (data.PeplinkOrgId != undefined && data.PeplinkOrgId != null) {
      this.gateway = true;
    }
    if(data.ServiceAndProduct!=undefined && data.ServiceAndProduct.length>0){
      let permissions=data.ServiceAndProduct;
      permissions.forEach(element => {
        if(element.UNIQUEKEY=="TRACKASSETS" && element.STATUS== "Y"){
          this.trackAssets = true;
        }
        if(element.UNIQUEKEY=="ANALYTICS" && element.STATUS=="Y"){
          this.analytics = true;
        }
        if(element.UNIQUEKEY=="LOADSETTINGS" && element.STATUS=="Y"){
          this.loadsettings = true;
        }
        if(element.UNIQUEKEY=="IDLINGOPTIONS" && element.STATUS=="Y"){
          this.idlingOptions = true;
        }
        if(element.UNIQUEKEY=="LOGONOPTIONS" && element.STATUS=="Y"){
          this.logonOptions = true;
        }
        if(element.UNIQUEKEY=="GATEWAY" && element.STATUS=="Y"){
          this.gateway = true;
        }
        if(element.UNIQUEKEY=="ULTIMATE" && element.STATUS=="Y"){
          this.ultimate = true;
        }
        if(element.UNIQUEKEY=="ADVANCED" && element.STATUS=="Y"){
          this.advanced = true;
        }
        if(element.UNIQUEKEY=="VITAL" && element.STATUS=="Y"){
          this.vital = true;
        }
        if(element.UNIQUEKEY=="CELLTRAC" && element.STATUS=="Y"){
          this.celltrac = true;
        }
        if(element.UNIQUEKEY=="MOMENTUS" && element.STATUS=="Y"){
          this.momentus = true;
        }
        if(element.UNIQUEKEY=="ATLUS" && element.STATUS=="Y"){
          this.atlus = true;
        }
        if(element.UNIQUEKEY=="ATLUSPLUS" && element.STATUS=="Y"){
          this.altusPlus = true;
        }
      });
    }
  }
  close() {
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    // this.myDiv.nativeElement.style.right = '-100px';
    document.body.style.overflowY="auto";
    this.myDiv.nativeElement.style.paddingLeft = "0";
  }
  companyname: string;
  adminname: string;
  adminID: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  countryId: string;
  state: string;
  stateId: string;
  city: string;
  zip: any;
  timezone: any='';
  timezoneId:any=null;
  phoneNo: string;
  ext: string;
  fax: string;
  trackAssets: boolean;
  analytics: boolean=false;
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
  altusPlus: boolean;
  pepling: string;
  department2: string;
  adminname2: string;
  phone2: string;
  email2: string;
  starttime1: any;
  endtime1: any;
  supervisor1: string;
  starttime2: any;
  endtime2: any;
  supervisor2: string;
  starttime3: any;
  endtime3: any;
  supervisor3: string;
  supervisorId1: string;
  supervisorId2: string;
  supervisorId3: string;
  shiftId1: string;
  shiftId2: string;
  shiftId3: string;
  deparmentAdminId: string=null;

  //Department
  temperature: string;
  temperatureID: string;
  longdistance: string;
  longdistanceID: string;
  mass: string;
  massID: string;
  speed: string;
  speedID: string;
  shortdistance: string;
  shortdistanceID: string;
  impactAlarm: string;
  incident: string;
  minimumSharp: string;
  checklistAlarm: string;
  otherAlarm: string;
  byBass: string;
  maintenanceLogout: string;
  allowSkipped: string;
  checklistComp: string;
  notifiythird: string;
  notifiythirdID: string;
  usageWeight: string;
  complainceWeight: string;
  alarmWeight: string;
  maintenanceWeight: string;
  weeklyMaintenance: string;
  ebiIntegration: boolean;
  
  ebiIntegrationText: string;
  tmaIntegration: boolean;
  deparementId=null;

  clear() {
    this.companyname = '';
    this.adminname = '';
    this.adminID=null;
    this.phone = '';
    this.email = '';
    this.deparementId=null;
    this.address = '';
    this.country = '';
    this.state = '';
    this.city = ''
    this.zip = '';
    this.timezoneId=null;
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
    this.altusPlus = false;
    this.pepling = '';
    this.shortDistance = undefined
    this.clearDepartment();
    this.temperature = '';
    this.temperatureID = ''
    this.longdistance = '';
    this.longdistanceID = ''
    this.mass = '';
    this.massID = ''
    this.speed = '';
    this.speedID = ''
    this.shortdistance = '';
    this.shortdistanceID = ''
    this.impactAlarm = '';
    this.incident = '';
    this.minimumSharp = '';
    this.checklistAlarm = '';
    this.otherAlarm = '';
    this.byBass = '';
    this.maintenanceLogout = '';
    this.allowSkipped = '';
    this.checklistComp = '';
    this.notifiythird = '';
    this.notifiythirdID;
    this.usageWeight = '';
    this.complainceWeight = '';
    this.alarmWeight = '';
    this.maintenanceWeight = '';
    this.weeklyMaintenance = '';
    this.ebiIntegration = false;
    this.ebiIntegrationText=''
    this.tmaIntegration = false;
    this.state="";
    this.country="";
    this.stateId="";
    this.countryId="";
  }
  clearDepartment() {
    this.checkboxAll = false;
    this.checkbox1 = false;
    this.checkbox2 = false;
    this.checkbox3 = false;
    this.department2 = ''
    this.adminname2 = ''
    this.phone2 = ''
    this.email2 = ''
    this.starttime1 = ''
    this.endtime1 = ''
    this.supervisor1 = ''
    this.starttime2 = ''
    this.endtime2 = ''
    this.supervisor2 = ''
    this.starttime3 = ''
    this.endtime3 = ''
    this.supervisor3 = ''
    this.supervisorId1 = '';
    this.supervisorId2 = '';
    this.supervisorId3 = '';
    this.deparmentAdminId = null;
  }
  selectAll() {
    if (this.checkboxAll) {
      this.checkbox1 = true;
      this.checkbox2 = true;
      this.checkbox3 = true;
    } else {
      this.checkbox1 = false;
      this.checkbox2 = false;
      this.checkbox3 = false;
    }
  }
  goBack() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    let parent=this;
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        parent.clear()
        parent.close()
      }
    })
  }
  cancelEditSite() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to Cancel ?' }
    });
    let parent=this;
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        parent.clear()
        parent.close()
      }
    })
  }
  checkValidOrNot(value){
    if(value==null || value==undefined || value=='' || value.trim()==''){
      return true
    }
   return false
  }
  adminChange(data){
    this.adminname=data.Name
    this.adminID=data.ID;
    this.phone=data.Phone
    this.email=data.Email
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  beforeUpdate(){
    if(this.checkValidOrNot(this.companyname)){
      this.toastr.warning("Site Name is Mandatory", "Warning");
        return;
    }
    if(this.companyname.trim().length<3){
      this.toastr.warning("Site Name Minimum 3 Character is Mandatory", "Warning");
       return;
    }
    // if(this.checkValidOrNot(this.email)){
    //   this.toastr.warning("Email is Mandatory", "Warning");
    //     return;
    // }
    if(this.checkValidOrNot(this.address)){
      this.toastr.warning("Address is Mandatory", "Warning");
        return;
    }
    if(this.checkValidOrNot(this.country)){
      this.toastr.warning("country is Mandatory", "Warning");
        return;
    }
    if(this.checkValidOrNot(this.state)){
      this.toastr.warning("State is Mandatory", "Warning");
        return;
    }
    if(this.checkValidOrNot(this.city)){
      this.toastr.warning("City is Mandatory", "Warning");
        return;
    }
    if(this.checkValidOrNot(this.zip)){
      this.toastr.warning("Zip Code is Mandatory", "Warning");
        return;
    }
    if(this.checkValidOrNot(''+this.timezone)){
      this.toastr.warning("Time zone is Mandatory", "Warning");
        return;
    }
    if(this.checkValidOrNot(this.department2)){
      this.toastr.warning("Department Name is Mandatory", "Warning");
        return;
    }
    if(this.department2.trim().length<3){
      this.toastr.warning("Department Name Minimum 3 Character is Mandatory", "Warning");
       return;
    }
    let parent = this;
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure you want to APPLY this Action?' }
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'Yes') {
        parent.save();
      }
    });
  }
  save() {
    let parent = this;
    this.loader = true;
    let url = 'Admin/CreateSite';
    let body: any = ''
    let hideid='';
    let showid=''
    if(this.trackAssets){
      showid='TRACKASSETS,'
    }else{
      hideid='TRACKASSETS,'
    }
    if(this.analytics){
      showid+='ANALYTICS,'
    }else{
      hideid+='ANALYTICS,'
    }
    if(this.loadsettings){
      showid+='LOADSETTINGS,'
    }else{
      hideid+='LOADSETTINGS,'
    }
    if(this.idlingOptions){
      showid+='IDLINGOPTIONS,'
    }else{
      hideid+='IDLINGOPTIONS,'
    }
    if(this.logonOptions){
      showid+='LOGONOPTIONS,'
    }else{
      hideid+='LOGONOPTIONS,'
    }
    if(this.gateway){
      showid+='GATEWAY,'
    }else{
      hideid+='GATEWAY,'
    }
    if(this.ultimate){
      showid+='ULTIMATE,'
    }else{
      hideid+='ULTIMATE,'
    }
    if(this.advanced){
      showid+='ADVANCED,'
    }else{
      hideid+='ADVANCED,'
    }
    if(this.vital){
      showid+='VITAL,'
    }else{
      hideid+='VITAL,'
    }
    if(this.celltrac){
      showid+='CELLTRAC,'
    }else{
      hideid+='CELLTRAC,'
    }
    if(this.atlus){
      showid+='ATLUS,'
    }else{
      hideid+='ATLUS,'
    }
    if(this.momentus){
      showid+='MOMENTUS,'
    }else{
      hideid+='MOMENTUS,'
    }
    if(this.altusPlus){
      showid+='ATLUSPLUS,'
    }else{
      hideid+='ATLUSPLUS,'
    }
    showid = showid.substring(0, showid.length - 1);
    hideid = hideid.substring(0, hideid.length - 1);
    body = {
      "ID":null,
      "Name": this.companyname,
      "AdminName": this.adminname,
      "AdminID":this.adminID,
      "AdminPhone": this.phone,
      "AdminEmail": this.email,
      "Address1": this.address,
      "Address2": null,
      "Country": this.countryId,
      "State": this.stateId,
      "City": this.city,
      "Zipcode": this.zip,
      "Phone": this.phoneNo,
      "Ext": this.ext,
      "Fax": this.fax,
      "Timezone":this.timezoneId,
      "HideData":hideid,
      "ShowData":showid,
      "DEPT_ID":this.deparementId,
      "D_Name": this.department2,
      "D_AdminID": this.deparmentAdminId,
      "D_AdminName": this.adminname2,
      "D_AdminPhone": this.phone2,
      "D_AdminExt": "112",
      "D_AdminEmail": this.email2,
      "D_Timing": [
        {
          "ShiftID": this.shiftId1,
          "ShiftSupervisorID": this.supervisor1,
          "ShiftUniqueID": 1,
          "ShiftStartTime": this.starttime1,
          "ShiftEndTime": this.endtime1,
          "ShiftSupervisor2": null,
          "ShiftActive": this.checkbox1 == true ? "Y" : "N"
        },
        {
          "ShiftID": this.shiftId2,
          "ShiftSupervisorID": this.supervisor2,
          "ShiftUniqueID": 2,
          "ShiftStartTime": this.starttime2,
          "ShiftEndTime": this.endtime2,
          "ShiftSupervisor2": null,
          "ShiftActive": this.checkbox2 == true ? "Y" : "N"
        },
        {
          "ShiftID": this.shiftId3,
          "ShiftSupervisorID": this.supervisor3,
          "ShiftUniqueID": 3,
          "ShiftStartTime": this.starttime3,
          "ShiftEndTime": this.endtime3,
          "ShiftSupervisor2": null,
          "ShiftActive": this.checkbox3 == true ? "Y" : "N"
        }
      ]
     , "S_TemperatureID": this.temperatureID,
      "S_TemperatureName": this.temperature,
      "S_LongDistanceID": this.longdistanceID,
      "S_LongDistanceName": this.longdistance,
      "S_ShortDistanceID": this.shortdistanceID,
      "ShortDistanceName": this.shortDistance,
      "S_MassID": this.massID,
      "S_MassName": this.mass,
      "S_SpeedID": this.speedID,
      "S_SpeedName": this.speed,
      "S_AlarmThreshold": this.alarmWeight,
      "S_IncidentThreshold": this.incident,
      "S_MinimumSharpTurns": this.minimumSharp,
      "S_ChecklistAlarmThreshold": this.checklistAlarm,
      "S_OtherAlarmThreshold": this.otherAlarm,
      "S_BypassDurationAlert": this.byBass,
      "S_MaintLockoutDutationAlert": this.maintenanceLogout,
      "S_AllowedSkippedTests": this.allowSkipped,
      "S_ComplianceThreshold": this.complainceWeight,
      "S_NotifyThirdPartyID": this.notifiythirdID,
      "S_NotifyThirdPartyName": this.notifiythird,
      "S_UsageWeight": this.usageWeight,
      "S_ComplianceWeight": this.complainceWeight,
      "S_AlarmWeight": this.alarmWeight,
      "S_MaintenanceWeight": this.maintenanceWeight,
      "S_WeeklyMaintenanceHourThresh": this.weeklyMaintenance,
      "S_EBisIntegration": this.ebiIntegration == true ? "Y" : "N",
      "S_TMAIntegration": this.tmaIntegration == true ? "Y" : "N",
      "S_EBisPwd": null,
      "S_TMAPwd": null,
      "S_AllowCSVChargerReports": null,
      "S_ChargerReportsCSVFolder": null,
      "S_CelltracUsageWeight": 25,
      "S_CelltracBatteryLifeWeight": 25,
      "S_CelltracAlarmWeight": 25,
      "S_CelltracMaintenanceWeight": 25,
      "S_CellTracIdlingThreshold": 25
    }
    if (!this.create){
      body.ID = this.actualData.ID
    }

    this.assetprohelperService.PostMethod(url, body
    ).subscribe(data => {
      this.loader = false;
      let body = data.json();
      if (body.Status) {
      
         parent.toastr.success(body.Message, 'Success!')
         parent.close()
         this.saveorupdate.emit(true);
         this.assetprohelperService.updateSite(true);
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
  loadDeparmentDetails() {
    let parent = this;
    this.loader = true;
    this.clearDepartment();
    this.assetprohelperService.PostMethod("Admin/GetAdminDepartmentBySiteID2", { SiteID: this.actualData.ID }).subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.checkboxAll = false;
      this.checkbox1 = false;
      this.checkbox2 = false;
      this.checkbox3 = false;
      this.departmentDetails = body.Data[0]
      if (this.departmentDetails == undefined) return;
      this.deparementId=this.departmentDetails.ID
      this.deparmentAdminId=this.departmentDetails.AdminID
      this.department2 = this.departmentDetails.Name
      this.adminname2 = this.departmentDetails.AdminName
      this.phone2 = this.departmentDetails.AdminPhone
      this.email2 = this.departmentDetails.AdminEmail
      /*this.starttime1 = new Date(body.Data[0].Timing[0].ShiftStartTime)
      this.endtime1 = new Date(body.Data[0].Timing[0].ShiftEndTime)
      // this.supervisor1 =  this.departmentDetails
      if (body.Data[0].Timing[1]) {
        this.starttime2 = new Date(body.Data[0].Timing[1].ShiftStartTime)
        this.endtime2 = new Date(body.Data[0].Timing[1].ShiftEndTime)
        this.supervisorId2 = body.Data[0].Timing[1].ShiftSupervisorID;
        this.shiftId2 = body.Data[0].Timing[1].ShiftID
      }
      //this.supervisor2 =  this.departmentDetails
      if (body.Data[0].Timing[2]) {
        this.starttime3 = new Date(body.Data[0].Timing[2].ShiftStartTime)
        this.endtime3 = new Date(body.Data[0].Timing[2].ShiftEndTime)
        this.supervisorId3 = body.Data[0].Timing[2].ShiftSupervisorID;
        this.shiftId3 = body.Data[0].Timing[2].ShiftID
      }
      //this.supervisor3 =  this.departmentDetails

      this.supervisorId1 = body.Data[0].Timing[0].ShiftSupervisorID;


      this.shiftId1 = body.Data[0].Timing[0].ShiftID


      if (this.departmentDetails.Timing[0]) {
        if (this.departmentDetails.Timing[0].ShiftActive == 'Y') {
          this.checkbox1 = true;
        }
      }
      if (this.departmentDetails.Timing[1]) {
        if (this.departmentDetails.Timing[1].ShiftActive == 'Y') {
          this.checkbox2 = true;
        }
      }
      if (this.departmentDetails.Timing[2]) {
        if (this.departmentDetails.Timing[2].ShiftActive == 'Y') {
          this.checkbox3 = true;
        }
      }
      if (this.checkbox1 && this.checkbox2 && this.checkbox3) {
        this.checkboxAll = true;
      }*/
    });
  }
  loadSettingsDetails() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.PostMethod("Admin/GetAdminSettingsBySiteID", { SiteID: this.actualData.ID }).subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.settingsDetails = body.Data[0]
      this.temperature = this.settingsDetails.TemperatureName
      this.temperatureID = this.settingsDetails.TemperatureID
      this.longdistance = this.settingsDetails.LongDistanceName
      this.longdistanceID = this.settingsDetails.LongDistanceID
      this.mass = this.settingsDetails.MassName
      this.massID = this.settingsDetails.MassID
      this.speed = this.settingsDetails.SpeedName
      this.speedID = this.settingsDetails.SpeedID
      this.shortdistance = this.settingsDetails.ShortDistanceName
      this.shortdistanceID = this.settingsDetails.ShortDistanceID
      this.impactAlarm = this.settingsDetails.AlarmThreshold
      this.incident = this.settingsDetails.IncidentThreshold
      this.minimumSharp = this.settingsDetails.MinimumSharpTurns
      this.checklistAlarm = this.settingsDetails.ChecklistAlarmThreshold
      this.otherAlarm = this.settingsDetails.OtherAlarmThreshold
      this.byBass = this.settingsDetails.BypassDurationAlert
      this.maintenanceLogout = this.settingsDetails.MaintLockoutDutationAlert
      this.allowSkipped = this.settingsDetails.AllowedSkippedTests
      this.checklistComp = this.settingsDetails.ChecklistAlarmThreshold
      this.notifiythird = this.settingsDetails.NotifyThirdPartyName
      this.notifiythirdID = this.settingsDetails.NotifyThirdPartyID
      this.usageWeight = this.settingsDetails.UsageWeight
      this.complainceWeight = this.settingsDetails.ComplianceWeight
      this.alarmWeight = this.settingsDetails.AlarmWeight
      this.maintenanceWeight = this.settingsDetails.MaintenanceWeight
      this.weeklyMaintenance = this.settingsDetails.WeeklyMaintenanceHourThresh
      this.ebiIntegration = this.settingsDetails.EBisIntegration == 'Y' ? true : false;
      this.tmaIntegration = this.settingsDetails.TMAIntegration == 'Y' ? true : false;
    });
  }
  temperatureChange(data) {
    this.temperature = data.UnitValue
    this.temperatureID = data.UnitKey
  }
  longDistanceChange(data) {
    this.longdistance = data.UnitValue
    this.longdistanceID = data.UnitKey
  }
  massChange(data) {
    this.mass = data.UnitValue
    this.massID = data.UnitKey
  }
  speedChange(data) {
    this.speed = data.UnitValue
    this.speedID = data.UnitKey
  }
  shortDistanceChange(data) {
    this.shortDistance = data.UnitValue
    this.shortdistanceID = data.UnitKey
  }
  notifyChange(data) {
    this.notifiythird = data.UnitValue
    this.notifiythirdID = data.UnitKey
  }
  udmenu: string = 'COMMON INFO'
  tabChange(val) {
    this.udmenu = val;
  }
  loadSupervisorDetails() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.GetMethod("Admin/GetAdminSupervisorList").subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.supervisourList = body.Data;
    });
  }
  supervisorClick1(data) {
    this.supervisor1 = data.Name
    this.supervisorId1 = data.ID;
  }
  supervisorClick2(data) {
    this.supervisor2 = data.Name
    this.supervisorId2 = data.ID;
  }
  supervisorClick3(data) {
    this.supervisor3 = data.Name
    this.supervisorId3 = data.ID;
  }
  departmentAdmin(data) {
    this.adminname2 = data.Name
    this.deparmentAdminId = data.ID;
    this.phone2=data.Phone
    this.email2=data.Email
  }
  loadTemperatureList() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.GetMethod("Admin/GetTemperature").subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.temperatureList = body.Data
    });
  }
  loadLongDistanceList() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.GetMethod("Admin/GetLongDistance").subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.longDistanceList = body.Data
    });
  }
  loadShortDistanceList() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.GetMethod("Admin/GetShortDistance").subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.shortDistanceList = body.Data
    });
  }
  loadSpeedList() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.GetMethod("Admin/GetSpeed").subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.loadSpeedList = body.Data
    });
  }
  loadMassList() {
    try {
      let parent = this;
      this.loader = true;
      this.assetprohelperService.GetMethod("Admin/GetMass").subscribe(data => {
        try {
          this.loader = false;
          let body = data.json();
          this.massList = body.Data
        } catch (ex) {

        }
      });
    } catch (ex) {
      console.log("Exception loadMassList():" + ex);
    }
  }
  loadNotifiThirdPartyList() {
    let parent = this;
    this.loader = true;
    this.assetprohelperService.GetMethod("Admin/GetNotifyThirdParty").subscribe(data => {
      this.loader = false;
      let body = data.json();
      this.notifiThirdParty = body.Data
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
   this.countryId=data.UniqueID; this.country=data.Name;
    this.statesArray(this.countryId)
  }
  stateChange(data){
    this.stateId=data.UniqueID;
    this.state=data.Name
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
  timeZoneList=[]
  timezoneChange(data){
    this.timezoneId=data.ID
    this.timezone=data.Value
  }

  getTimezone() {
    this.timeZoneList=[]
    this.timeZone
    this.loader = true;
    this.assetprohelperService.GetMethod('Admin/GetTimeZone').subscribe(response => {
      this.loader = false;
      let body = response.json();
      this.timeZoneList = body.Data
    })
  }
}
