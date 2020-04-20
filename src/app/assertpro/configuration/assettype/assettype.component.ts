import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AssetprohelperService } from "src/app/share/services/assetprohelper.service";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { CommonanDepartmentComponent } from "./commondepartment/commondepartment.component";
import { CommonassetComponent } from "./commonasset/commonasset.component";
import { AssetType } from './assettype.model';

@Component({
  selector: "assettypecomponent",
  templateUrl: "./assettype.component.html",
  styleUrls: ["./assettype.component.css"],
  providers: [
    {
      provide: MAT_STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class AssettypeComponent implements OnInit, OnDestroy {
  acgAdminShow: boolean;
  constructor(
    public toastr: ToastrService,
    public assetprohelperService: AssetprohelperService,
    private _formBuilder: FormBuilder
  ) { }
  ProfileNameselected = 'Select Profile';
  profileName_id: any;
  profileList = []
  currency = "Select Currency"
  currencyList = []
  billingType = "AC";
  billingTypeList = ['DC', 'AC']
  ngOnInit() {
    this.getSystemUsedList();
    this.getProfile();
    this.acgTest();
    this.getComTypeList();
    this.geteqClassificationList('3')
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(
      () => {
        this.showTabs = false
        this.heightAdj = false
        this.siteName = localStorage.getItem("sitename");
        if (
          localStorage.getItem("selectitemId") != null &&
          localStorage.getItem("selectitemId") != "null"
        ) {
          this.siteId = localStorage.getItem("selectitemId");
        } else {
          this.siteId = "";
          return;
        }
      }
    );


    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
    this.currencyData();
    this.safetyChecklistData(); 
  }
  currencyData() {
    this.loader = true;
    this.assetprohelperService.PostMethod("Configuration/GetAllCurrencies",{}).subscribe(response => {
      try {
        let body = response.json();
        this.loader = false;
        if (body.Status) {
          this.currencyList = body.Data;
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (error) {
        console.log(error)
      }
    });
  }
  safetyChecklistData(){
    this.loader = true;
    this.assetprohelperService.PostMethod("Configuration/GetAllCheckListBySiteIDs",{
      "SiteIDs": [this.siteId]
    }).subscribe(response => {
      try {
        let body = response.json();
        this.loader = false;
        if (body.Status) {
          this.saftyCheckList = body.Data;
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (error) {
        console.log(error)
      }
    });
  }
  acgTest() {
    if (localStorage.getItem('role') == 'AcgAdmin') {
      this.acgAdminShow = true;
    }
    else {
      this.acgAdminShow = false
    }
  }
  profileName(data) {
    this.ProfileNameselected = data.ProfileName;
    this.profileName_id = data.ProfileID
  }
  getProfile() {
    //this.loader = true;
    this.assetprohelperService.GetMethod('Configuration/GetProfileList').subscribe(response => {
      try {
        //   this.loader = false;
        let body = response.json();
        if (body.Status) {
          this.profileList = body.Data;
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (error) {
        console.log(error)
      }
    });

  }
  siteName: string;
  siteId: string = "";
  private serviceSubscription: Subscription;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  saftyCheckList = []
  @ViewChild("stepper") stepper;
  checkList = 'Safety checklist'
  frequencyList = [{key:1,value:'Per Shift'}, {key:2,value:'Per Operator'}]
  freqency = 'Per Shift'
  freqencyid=1;
  frequencyCh(data){
   this.freqencyid = data.key;
   this.freqency = data.value;
  }
  consecutiveList = ['None', 'Repeat Whole Checklist']
  consecutive = 'Repeat Whole Checklist'
  typeList = ['Regular', 'Smart']
  typevalue = 'Smart'
  inputHrmList = ['Travel and lift']
  hrm1 = ''
  hrm1Id = ''

  hrm2 = ''
  hrm2Id = ''

  hrm3 = ''
  hrm3Id = ''

  hrm4 = ''
  hrm4Id = ''

  hrmList = [
    { key: '0', value: 'None' },
    { key: '1', value: 'Key' },
    { key: '2', value: 'Occupancy' },
    { key: '3', value: 'Travel' },]
  inputList = ['Input 1', 'Input 2', 'Input 3', 'Input 4', 'Input 5', 'Input 6', 'Input 7', 'Input 8']

  listofInputs = [{ key: "128", value: 'Input 1' }, { key: "64", value: 'Input 2' }, { key: "32", value: 'Input 3' },
  { key: "16", value: 'Input 4' }, { key: "8", value: 'Input 5' }, { key: "4", value: 'Input 6' },
  { key: "2", value: 'Input 7' }, { key: "1", value: 'Input 8' },]

  inputtypes1 = 'Input 1'
  inputtypes2 = 'Input 1'
  inputtypes3 = 'Input 1'
  seatChange(data) {
    this.model.seatValue = data.value
    this.model.seatId = data.key
  }
  fuelChange(data) {
    this.model.fuelValue = data.value
    this.model.fuelId = data.key
  }
  fluidChange(data) {
    this.model.fluidValue = data.value
    this.model.fluidId = data.key
  }
  hmrChange1(value) {
    this.model.hrm1Id = value.key
    this.hrm1 = value.value
  }
  hmrChange2(value) {
    this.model.hrm2Id = value.key
    this.hrm2 = value.value
  }
  hmrChange3(value) {
    this.model.hrm3Id = value.key
    this.hrm3 = value.value
  }
  hmrChange4(value) {
    this.model.hrm4Id = value.key
    this.hrm4 = value.value
  }
  frequencyId = ''
  frequency = ''
  frequencyList2 = [
    { key: 1, value: 'Daily' },
    { key: 2, value: 'Weekly' },
    { key: 3, value: 'Bi-Weekly' },
    { key: 4, value: 'Monthly' },]
  ebis: string = 'N';
  tma: string = 'N';
  atTime;

  frequencyChange(value) {
    this.model.EBisFrequnecy = value.key
    this.frequency = value.value
  }
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
  tabIndex = 0;
  @ViewChild("commondepartment") commondepartment: CommonanDepartmentComponent;
  @ViewChild("commonasset") commonasset: CommonassetComponent;
  selectedSites=[]
  selectedTab = "BASIC INFO";
  selectionChange(event) {
    this.tabIndex = event.selectedIndex;
    this.stepper.selected.completed = false;
    this.selectedTab = event.selectedStep.label;
  }
  sentDepartmentList = [];
  departmentChange() {
    this.clear2();
    this.heightAdj = false;
    this.sentDepartmentList = this.commondepartment.bubbles;
    if (this.sentDepartmentList.length > 0) {
      this.heightAdj = true;
    }
    if (this.commonasset != undefined) {
      this.commonasset.departmentList = this.commondepartment.bubbles;
      this.commonasset.GetAssetsList();
    }
    this.showTabs = false;
  }
  applyFunction() {

    if (this.commondepartment.bubbles.length == 0) {
      this.toastr.warning("Deparment is Mandatory", "Warning");
      return;
    }
    if (this.commonasset.bubbles.length == 0) {
      this.toastr.warning("Asset is Mandatory", "Warning");
      return;
    }
    this.showTabs = true;
   
    this.enableBasicInfo = false;
    this.selectedTab = "USAGE";
    this.commonasset.bubbles.forEach(data => {
      if (data.value.indexOf("All") > -1) {
        this.enableBasicInfo = true;
        this.selectedTab = "BASIC INFO";
      }
    });
    if (!this.enableBasicInfo) {
      this.selectedTab = "USAGE";
    }
    // let value=''+this.commonasset.bubbles[0].value
    // if(value.indexOf('All')>-1){
    //   this.enableBasicInfo=true;
    // }else{
    //   this.enableBasicInfo=false;
    // }
    this.parentDetails = [
      this.commondepartment.bubbles,
      this.commonasset.bubbles
    ];
    let type = "assetType";
    if (this.commonasset.bubbles.length == 1) {
      if (this.commonasset.bubbles[0].assetTypeID) {
        type = "singleAsset";
      }
    } else {
      type = "moreAssets";
    }
    this.type = type;
    
    if (this.type != "assetType") {
      this.billingRates = false;
      this.integrationEnable = false;
      this.enableBasicInfo = false
      this.selectedTab = "USAGE";
    } else {
      //this.billingRates = true
      this.integrationEnable = true
    }
    let parent = this;
    setTimeout(() => {
      parent.stepper.reset();
    }, 100);
    let assetId = []
    let assetTypeId = []
    this.commonasset.bubbles.forEach(row => {
      if (row.assetTypeID != null) {
        assetId.push(row.id);
      } else {
        assetTypeId.push(row.id);
      }
    });
    if (assetTypeId.length == 0 && this.commonasset.bubbles[0].assetTypeID != null) {
      assetTypeId.push(this.commonasset.bubbles[0].assetTypeID)
    }

    this.loadAllTabDatas(assetTypeId, assetId);

    //this.defaultFields()
    this.profileName_id = null;
    this.ProfileNameselected = 'Select Profile';
  }
  type: string = "";
  showTabs = false;
  clear() {
    this.loader = true;
    this.heightAdj = false
    this.showTabs = false;
    this.selectedTab = "BASIC INFO";
    this.commondepartment.bubbles = [];
    this.commondepartment.searchText = "";
    this.commonasset.bubbles = [];
    this.commonasset.searchText = "";
    this.enableBasicInfo = true;
    this.usageEnable = true;
    this.oprationalEnable = true;
    this.sesorEnable = true;
    this.billingRates = true;
    this.integrationEnable = true;
    this.internelConfiguration = true;
    this.commonasset.assets = [];

    this.createMode = false;

    this.profileName_id = null;
    this.ProfileNameselected = 'Select Profile';
    this.loader = false;
  }
  clear2() {
    this.createMode = false;
    this.selectedTab = "BASIC INFO";
    this.commonasset.bubbles = [];
    this.commonasset.searchText = "";
    this.enableBasicInfo = true;
    this.usageEnable = true;
    this.oprationalEnable = true;
    this.sesorEnable = true;
    this.billingRates = true;
    this.integrationEnable = true;
    this.internelConfiguration = true;
    this.commonasset.assets = [];

    let parent = this;
    setTimeout(() => {
      if (parent.stepper != undefined)
        parent.stepper.reset();
    }, 100);
    this.profileName_id = null;
    this.ProfileNameselected = 'Select Profile';
  }
  parentDetails = [];
  createMode: boolean = false;
  createAssetType() {
    // if (this.commondepartment.bubbles.length == 0) {
    //   this.toastr.warning("Deparment is Mandatory", "Warning");
    //   return;
    // }
    // if (this.commonasset.bubbles.length == 0) {
    //   this.toastr.warning("Asset is Mandatory", "Warning");
    //   return;
    // }
    try {
      this.disableAll();
      this.type = 'assetType';
      this.heightAdj = false;
      this.commondepartment.bubbles = [];
      this.commondepartment.searchText = "";
      this.commonasset.bubbles = [];
      this.commonasset.searchText = "";
      this.commonasset.assets = []
      this.selectedSites=[]
      if(this.commonsite!=undefined){
        this.commonsite.bubbles=[]
        this.commonsite.selectedSites=[]
      }
      
      this.createMode = true;
      this.showTabs = true;
      this.enableBasicInfo = true;
      this.usageEnable = true;
      this.oprationalEnable = true;
      this.sesorEnable = true;
      this.billingRates = true;
      this.integrationEnable = true;
      this.internelConfiguration = true;
      this.defaultpage = true;
      this.eqclassificationUsed = ''
      this.model.eqClassification = null;
      //this.defaultFields();
      this.sytemUsed = ''
      this.model.System = null;
      this.powerdBy = ''
      this.model.PoweredBy = ''
      this.hmrEnable = false
      this.profileName_id = null;
      this.ProfileNameselected = 'Select Profile';
      this.sytemUsed = ''
      this.classificationUsed = ''
      this.model.Classification = ''
      this.selectedTab = 'BASIC INFO';
      this.model.Name=''
      let parent = this;
      
      this.comType = this.comTypeList[0].Value
      this.comTypeId = this.comTypeList[0].Key
      setTimeout(() => {
        parent.stepper.reset();
      }, 500);
    } catch (e) {
      console.log(e);
    }
  }
  createModeFun() {
    try {
      this.disableAll();
      this.enableBasicInfo = true;
      // this.usageEnable = true;
      // this.oprationalEnable = true;
      // this.sesorEnable = true;
      // this.intenalSettings = true;
      // this.selectedTab = 'BASIC INFO'
      this.createMode = false;
      this.clear();
    } catch (e) {
      console.log(e);
    }
  }
  advanceUltimate = [
    "Basic Info",
    "Usage",
    "Operational ",
    "Sensor ",
    "Billing Rates",
    "Integration",
    "Internal Configurations"
  ];

  vital = [
    "Basic Info",
    "General",
    "Billing Rates",
    "Integration",
    "Internal Configurations"
  ];

  celltrac = [
    "Basic Info",
    "General",
    "Alarms",
    "Charging Profile",
    "Billing Rates",
    "Internal Settings"
  ];

  momentorAtlus = ["Basic Info", "General", "Billing Rates"];

  atlusPlus = ["Internal Settings", "Billing Rates"];

  enableBasicInfo = true;
  usageEnable = true;
  oprationalEnable = true;
  sesorEnable = true;
  intenalSettings = false;
  integrationEnable = true;
  internelConfiguration = true;
  systemTypeValue = "";
  generalEnable = false;
  billingRates = true;
  alarmsEnable = false;
  chargeProfileEnable = false;
  disableAll() {
    this.enableBasicInfo = true;
    this.usageEnable = false;
    this.oprationalEnable = false;
    this.sesorEnable = false;
    this.intenalSettings = false;
    this.integrationEnable = false;
    this.internelConfiguration = false;
    this.systemTypeValue = "";
    this.generalEnable = false;
    this.billingRates = false;
    this.alarmsEnable = false;
    this.chargeProfileEnable = false;
  }

  getSystemType(event) {
    this.enableBasicInfo = false;
    this.usageEnable = false;
    this.oprationalEnable = false;
    this.sesorEnable = false;
    this.intenalSettings = false;
    this.integrationEnable = false;
    this.internelConfiguration = false;
    this.generalEnable = false;
    this.billingRates = false;
    this.alarmsEnable = false;
    this.chargeProfileEnable = false;

    this.systemTypeValue = event;
    if (event.Key == "1" || event.Key == "2") {
      this.enableBasicInfo = true;
      this.usageEnable = true;
      this.oprationalEnable = true;
      this.sesorEnable = true;
      this.billingRates = true;
      this.integrationEnable = true;
      this.internelConfiguration = true;
    } else if (event.Key == "3") {

      this.generalEnable = true;
      if (!this.createMode && this.type != "assetType") {
        this.billingRates = false
        this.integrationEnable = false;
        this.enableBasicInfo = false;
      } else {
        this.enableBasicInfo = true;
        this.billingRates = true;
        this.integrationEnable = true;
      }
      this.integrationEnable = true;
      this.internelConfiguration = true;
    } else if (event.Key == "4") {
      this.enableBasicInfo = true;
      this.generalEnable = true;
      this.chargeProfileEnable = true;
      this.alarmsEnable = true;
       this.intenalSettings = true
      if (this.type != "assetType") {
        this.billingRates = false;
      } else {
        // this.intenalSettings = true
        this.internelConfiguration = true;
        this.integrationEnable = true;
        this.billingRates = true;
      }
      //this.intenalSettings = true;
      // this.internelConfiguration = true;
    } else if (event.Key == "5" || event.Key == "6") {
      if (!this.createMode && this.type != "assetType") {
        this.enableBasicInfo = false;
        this.showTabs = false

      } else {
        this.enableBasicInfo = true;
      }
      this.billingRates = true;
      this.generalEnable = true;
    } else if (event.Key == "7") {
      if (!this.createMode && this.type != "assetType") {
        this.enableBasicInfo = false;
        this.showTabs = false
      } else {
        this.enableBasicInfo = true;
      }
      //this.intenalSettings = true;
      this.internelConfiguration = false;
      this.generalEnable = true;
      this.billingRates = true;
    }
    if (!this.createMode && this.type != "assetType") {
      this.enableBasicInfo = false;

    }
    if (this.enableBasicInfo) {
      this.selectedTab = "BASIC INFO";
    } else if (this.usageEnable) {
      this.selectedTab = "USAGE";
    } else if (this.generalEnable) {
      this.selectedTab = "GENERAL";
    }
  }
  hmr: boolean = false;
  hmrChange(event) {
    if (event == false || event == undefined || event == null || event == "") {
      this.hmr = false;
    } else this.hmr = true;
  }
  power = "";
  powerChange(event) {
    this.power = event;
  }
  classifications = "";
  classification(event) {
    this.classifications = event;
  }
  
  loader: boolean = false;
  loadAllTabDatas(assetType, AssetId) {
    try {
      this.loader = true
      this.assetprohelperService.PostMethod("Configuration/GetAssetTypeOrAssetsByID",
        {
          "AssetTypeID": assetType,
          "AssetIDs": AssetId
        }).subscribe(response => {
          this.loader = false;
          try {
            let body = response.json();
            if (body.Status) {
              let datas = body.Data
              
                if (this.type != "assetType" && (datas.System == 5 || datas.System == 6 || datas.System == 7)) {
                  this.toastr.warning("For chargers search by Asset Type", "Warning");
                  this.showTabs = false;
                  return;
                }else{
                  this.toastr.success("Applied Successfully", "Success!");
                }
              this.model = {
                ...this.model,
                ...datas
              }
              //this.model=datas;
              this.defaultpage = false;
              this.sytemUsed = datas.SystemName;
              this.classificationUsed = datas.ClassificationName
              this.model.Classification=datas.Classification
              this.comType = datas.CommunicationTypeName
              this.powerdBy = datas.PoweredByName
              if (this.model.System != undefined && this.model.System != null) {
                this.getClassificationList(this.model.System);
                if (this.commonsite != undefined) {
                  this.commonsite.SystemID = this.model.System
                  if (datas.SiteID != null && datas.SiteID != undefined && datas.SiteID.length > 0) {

                    this.commonsite.defaultSelection = true;
                    this.commonsite.selectedSiteList = datas.SiteID
                  }
                  this.commonsite.GetAssetsList();
                  
                }
                this.getSystemType({ Key: this.model.System, Value: this.sytemUsed })
              }
              if (datas.BatteryHMREnabled == 'Y') {
                this.hmr = true
                this.hmrEnable = true
              } else {
                this.hmr = false
                this.hmrEnable = false
              }
              this.model.Battery_LowWater=datas.Battery_LowWater=='Y'?'Y':'N'
              this.model.Battery_LowVoltageAlarm=datas.Battery_LowVoltageAlarm=='Y'?'Y':'N'
              this.model.Battery_OverVoltageAlarm=datas.Battery_OverVoltageAlarm=='Y'?'Y':'N'
              this.model.Battery_OverCurrentAlarm=datas.Battery_OverCurrentAlarm=='Y'?'Y':'N'
              this.model.Battery_OverTeperatureAlarm=datas.Battery_OverTeperatureAlarm=='Y'?'Y':'N'
              this.model.Battery_CableTempSensor=datas.Battery_CableTempSensor=='Y'?'Y':'N'
              this.model.Battery_SoCCutoff=datas.Battery_SoCCutoff=='Y'?'Y':'N'
              this.model.Battery_LowSoc=datas.Battery_LowSoc=='Y'?'Y':'N'
              this.model.Battery_MisPick=datas.Battery_MisPick=='Y'?'Y':'N'
              if(datas.InspectionEnable=='N')
              {
                this.freqencyid=1
              }else{
                this.freqencyid=2
              }
              this.model.IdlingAsset=datas.IdlingAsset=='Y'?'Y':'N'
              this.frequencyList.forEach(element=>{
                if(this.freqencyid==element.key){
                  this.frequency=element.value
                }
              })
              if (datas.Charger_PowerUsageReporting == "Y") {
                this.model.powerusage = true
              } else {
                this.model.powerusage = false
              }
              if (this.model.Battery_BatteryVoltage != null) {
                this.voltageList.forEach(data => {
                  if (this.model.Battery_BatteryVoltage == data.key)
                    this.voltage = data.value
                });
              }
              this.selectedSites=[]
              if(datas.SiteArray!=null && datas.SiteArray!=undefined){
                let sites=JSON.parse(datas.SiteArray);
                this.selectedSites=sites;
              }
              this.model.PM = (datas.PM==0 || datas.PM==1)?true:false;
              if(datas.PM==0){
                this.typevalue='Smart' 
              }else if(datas.PM==1){
                this.typevalue='Regular' 
              }
              
              this.model.CheckListID=datas.CheckListID
              this.saftyCheckList.forEach(row=>{
                if(row.ID==datas.CheckListID){
                  this.checkList=row.Name
                }
              });
              this.model.CheckListEnable=(datas.CheckListEnable=='Y');
              this.model.maintenance_modeToggler=(datas.CheckListEnableMaint=='Y');
              this.model.SenseInputsAlertEnabled=(datas.SenseInputsAlertEnabled=='Y');
              this.model.MinDurationAlertEnabled=(datas.MinDurationAlertEnabled=='Y');
              this.model.CheckListRandomlyEnabled=(datas.CheckListRandomlyEnabled=='Y');
              this.model.SpeedEnabled=(datas.SpeedEnabled=='Y');
              this.model.NumericBadgeEntry=(datas.NumericBadgeEntry=='Y');
              this.model.LowVoltageEnabled=(datas.LowVoltageEnabled=='Y');
              this.model.SensorEnabled=(datas.SensorEnabled=='Y');
              this.model.LoadSensorEnabled=(datas.LoadSensorEnabled=='Y');
              this.ebis=datas.HMRIntegrationSetting;
              this.model.Charger_PowerUsageReporting_Frequency=datas.Charger_PowerUsageReporting_Frequency
              
              
            
          
              if (datas.optoInputArray != null) {
                
                let usage = JSON.parse(datas.optoInputArray)
                usage.forEach((data, index) => {
                  if(index==0){
                    this.model.key=data.Name
                    this.model.hmrInputName=data.Name
                    this.model.keyproductivityTogglerButton=data.Productivity=='Y'?true:false;
                    this.model.keyInput= data.HourMeter=='Y'?true:false;
                    this.model.HMR1=data.HMR
                    this.model.keyalarmTogglerButton=data.Alarm=='Y'?true:false;
                    this.model.key_toggler=data.Input==1?'Y':'N'
                    this.model.visible1=data.Visible=='Y'?true:false;
                  }
                  else if(index==1){
                    this.model.occupancy=data.Name
                    this.model.occupancyproductivityTogglerButton=data.Productivity=='Y'?true:false;
                    this.model.occupancyInput= data.HourMeter=='Y'?true:false;
                    this.model.occupancyalarmTogglerButton=data.Alarm=='Y'?true:false;
                    this.model.visible2=data.Visible=='Y'?true:false;
                    this.model.occupancy_toggler=data.Input==1?'Y':'N'
                    this.model.HMR2=data.HMR
                  }
                  else if(index==2){
                    this.model.travel=data.Name
                    this.model.travelproductivityTogglerButton=data.Productivity=='Y'?true:false;
                   this.model.travelInput= data.HourMeter=='Y'?true:false;
                    this.model.travelalarmTogglerButton=data.Alarm=='Y'?true:false;
                    this.model.visible3=data.Visible=='Y'?true:false;
                    this.model.travel_toggler=data.Input==1?'Y':'N'
                    this.model.HMR3=data.HMR
                  }
                  else if(index==3){
                    this.model.lowFule=data.Name
                    this.model.lowfuelproductivityTogglerButton=data.Productivity=='Y'?true:false;
                   this.model.lowFuel_Input= data.HourMeter=='Y'?true:false;
                    this.model.lowfuelalarmTogglerButton=data.Alarm=='Y'?true:false;
                    this.model.visible4=data.Visible=='Y'?true:false;
                    this.model.low_fuel_toggler=data.Input==1?'Y':'N'
                    this.model.HMR4=data.HMR
                  }
                  else if(index==4){
                    this.model.seatBelt=data.Name
                    this.model.seatbeltproductivityTogglerButton=data.Productivity=='Y'?true:false;
                   this.model.seatbeltInput= data.HourMeter=='Y'?true:false;
                    this.model.seatbeltalarmTogglerButton=data.Alarm=='Y'?true:false;
                    this.model.visible5=data.Visible=='Y'?true:false;
                    this.model.seat_belt_toggler=data.Input==1?'Y':'N'
                    this.model.HMR5=data.HMR
                  }
                  else if(index==5){
                    this.model.input1=data.Name
                    this.model.input_one_productivityTogglerButton=data.Productivity=='Y'?true:false;
                   this.model.input_oneInput= data.HourMeter=='Y'?true:false;
                    this.model.input_one_alarmTogglerButton=data.Alarm=='Y'?true:false;
                    this.model.visible6=data.Visible=='Y'?true:false;
                    this.model.input_one_toggler=data.Input==1?'Y':'N'
                    this.model.HMR6=data.HMR
                  }
                  else if(index==6){
                    this.model.input2=data.Name
                    this.model.input_two_productivityTogglerButton=data.Productivity=='Y'?true:false;
                   this.model.input_twoInput= data.HourMeter=='Y'?true:false;
                    this.model.input_two_alarmTogglerButton=data.Alarm=='Y'?true:false;
                    this.model.visible7=data.Visible=='Y'?true:false;
                    this.model.input_two_toggler=data.Input==1?'Y':'N'
                    this.model.HMR7=data.HMR
                  }
                  else if(index==7){
                    this.model.input3=data.Name
                    this.model.input_three_productivityTogglerButton=data.Productivity=='Y'?true:false;
                    this.model.input_threeInput= data.HourMeter=='Y'?true:false;
                    this.model.input_three_alarmTogglerButton=data.Alarm=='Y'?true:false;
                    this.model.visible8=data.Visible=='Y'?true:false;
                    this.model.input_three_toggler=data.Input==1?'Y':'N'
                    this.model.HMR8=data.HMR
                  }
                });
              }
              if (datas.MISCSettingsJson != null && datas.MISCSettingsJson != '') {
                let keys = Object.keys(datas.MISCSettingsJson)
                keys.forEach(element => {
                  let value = datas.MISCSettingsJson[element]

                  if (value.LogoutType != undefined) {
                    this.model.LogoutType = value.LogoutType
                    this.logoutTypeList.forEach(data => {
                      if (data.key == this.model.LogoutType) {
                        this.model.logoutTypeName = data.value
                      }
                    })
                  }
                  if (value.Code != undefined) {
                    this.model.Code = value.Code
                  }
                  if (value.DOPValue != undefined) {
                    this.model.DOPValue = value.DOPValue
                  }
                  if (value.TimeFrequency != undefined) {
                    this.model.TimeFrequency = value.TimeFrequency
                  }
                  if (value.DistanceThreshold != undefined) {
                    this.model.DistanceThreshold = value.DistanceThreshold
                  }
                  if (value.DirectionThreshold != undefined) {
                    this.model.DirectionThreshold = value.DirectionThreshold
                  }
                });
                if (datas.MISCSettingsJson['cmd_1101_1'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1101_1'];
                  this.model.seatId = value.No
                  this.listofInputs.forEach(data => {
                    if (data.key == this.model.seatId) {
                      this.model.seatValue = data.value
                    }
                  })
  
                }
                if (datas.MISCSettingsJson['cmd_1101_2'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1101_2'];
                  this.model.fuelId = value.No
                  this.listofInputs.forEach(data => {
                    if (data.key == this.model.fuelId) {
                      this.model.fuelValue = data.value
                    }
                  })
  
                }
                if (datas.MISCSettingsJson['cmd_1101_3'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1101_3'];
                  this.model.fluidId = value.No
                  this.listofInputs.forEach(data => {
                    if (data.key == this.model.fluidId) {
                      this.model.fluidValue = data.value
                    }
                  })
  
                }
                if (datas.MISCSettingsJson['cmd_1106'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1106'];
                  if (value.Enabled == '01') {
                    this.model.gpsFunction = true
                  } else { this.model.gpsFunction = false }
                }
                if (datas.MISCSettingsJson['cmd_10BC'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_10BC'];
                  if (value.Activate == '01') {
                    this.model.relay = true
                  } else { this.model.relay = false }
                }
                if (datas.MISCSettingsJson['cmd_10BE'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_10BE'];
                  this.model.Message = value.Message
                }
                if (datas.MISCSettingsJson['cmd_1102'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1102'];
                  if (value.AccessControl == '01') {
                    this.model.AccessControl = true
                  } else { this.model.AccessControl = false }
                }
                if (datas.MISCSettingsJson['cmd_1103'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1103'];
                  if (value.InputSelected != '') {
                    let values = value.InputSelected;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '128') {
                        this.model.input1option = true;
                      }
                      if (element == '64') {
                        this.model.input2option = true;
                      }
                      if (element == '32') {
                        this.model.input3option = true;
                      }
                      if (element == '16') {
                        this.model.input4option = true;
                      }
                      if (element == '8') {
                        this.model.input5option = true;
                      }
                      if (element == '4') {
                        this.model.input6option = true;
                      }
                      if (element == '2') {
                        this.model.input7option = true;
                      }
                      if (element == '1') {
                        this.model.input8option = true;
                      }
                    });
                    this.model.InputSelected = true
                  } else { this.model.InputSelected = false }
                }
                if (datas.MISCSettingsJson['cmd_1104'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1104'];
                  this.model.HoursBeforeForAlert = value.HoursBeforeForAlert
                  if (value.HoursBeforeForAlert == null || value.HoursBeforeForAlert == '') {
                    this.model.pmApproching = false
                  } else {
                    this.model.pmApproching = true;
                  }
  
                }
                if (datas.MISCSettingsJson['cmd_1109'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1109'];
                  this.model.TimeInMinutes = value.TimeInMinutes
                }
                if (datas.MISCSettingsJson['cmd_110A'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_110A'];
                  this.model.alarmlogout = true;
                  if (value.MaintLockout != '') {
                    this.model.modeAccess = true;
                    let values = value.MaintLockout;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '1') {
                        this.model.modeMainAcg = true;
                      }
                      if (element == '2') {
                        this.model.modeMainMaintenance = true;
                      }
                      if (element == '4') {
                        this.model.modeMainSuper = true;
                      }
                      if (element == '8') {
                        this.model.modeMainAdmin = true;
                      }
  
                    });
                  } else {
                    this.model.modeAccess = false
                  }
                  if (value.Bypass != '') {
                    let values = value.Bypass;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '16') {
                        this.model.modeByAcg = true;
                      }
                      if (element == '32') {
                        this.model.modeByMain = true;
                      }
                      if (element == '64') {
                        this.model.modeBySuper = true;
                      }
                      if (element == '128') {
                        this.model.modeByAdmin = true;
                      }
  
                    });
  
                  }
                }
  
                if (datas.MISCSettingsJson['cmd_10B5'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_10B5'];
                  if (value.AlarmType != '') {
                    let values = value.AlarmType;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '1') {
                        this.model.alarmLogImpact = true;
                      }
                      if (element == '2') {
                        this.model.alarmLogSkip = true;
                      }
                      if (element == '4') {
                        this.model.alarmLogWrong = true;
                      }
                      if (element == '8') {
                        this.model.alarmLogGeof = true;
                      }
                      if (element == '16') {
                        this.model.alarmLogInput = true;
                      }
                    });
  
                  }
                }
                //ALARM TO LOGOUT
                if (datas.MISCSettingsJson['cmd_110E'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_110E'];
  
                  if (value.AlarmType != '') {
                    this.model.alarmTo = true;
                    let values = value.AlarmType;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '1') {
                        this.model.alarmToInput = true;
                      }
                      if (element == '2') {
                        this.model.alarmToImpact = true;
                      }
                      if (element == '4') {
                        this.model.alarmToPM = true;
                      }
  
                    });
  
                  } else {
                    this.model.alarmTo = true;
                  }
                  if (value.InputType != '') {
                    let values = value.AlarmType;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '128') {
                        this.model.alarmToInput1 = true;
                      }
                      if (element == '64') {
                        this.model.alarmToInput2 = true;
                      }
                      if (element == '32') {
                        this.model.alarmToInput3 = true;
                      }
                      if (element == '16') {
                        this.model.alarmToInput4 = true;
                      }
                      if (element == '8') {
                        this.model.alarmToInput5 = true;
                      }
                      if (element == '4') {
                        this.model.alarmToInput6 = true;
                      }
                      if (element == '2') {
                        this.model.alarmToInput7 = true;
                      }
                      if (element == '1') {
                        this.model.alarmToInput8 = true;
                      }
                    });
                  }
                }
                if (datas.MISCSettingsJson['cmd_110F'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_110F'];
                  if (value.Enabled == '01') {
                    this.model.temperatureEnabled = true
                  } else { this.model.temperatureEnabled = false }
                }
                if (datas.MISCSettingsJson['cmd_1110'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1110'];
                  this.model.configurationmenu = true;
                  if (value.Maintenance != '') {
                    let values = value.Maintenance;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '1') {
                        this.model.confMainInput = true;
                      }
                      if (element == '2') {
                        this.model.confMainCheck = true;
                      }
                      if (element == '4') {
                        this.model.confMainPm = true;
                      }
                      if (element == '8') {
                        this.model.confMainIsensor = true;
                      }
                      if (element == '16') {
                        this.model.confMainMode = true;
                      }
                      if (element == '32') {
                        this.model.confMainMisc = true;
                      }
                      if (element == '64') {
                        this.model.confMainNetwork = true;
                      }
                      if (element == '128') {
                        this.model.confMainLoadSensor = true;
                      }
                    });
                  }
                  if (value.Admin != '') {
                    let values = value.Admin;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '1') {
                        this.model.confSupInput = true;
                      }
                      if (element == '2') {
                        this.model.confSupCheck = true;
                      }
                      if (element == '4') {
                        this.model.confSupPm = true;
                      }
                      if (element == '8') {
                        this.model.confSupIsensor = true;
                      }
                      if (element == '16') {
                        this.model.confSupMode = true;
                      }
                      if (element == '32') {
                        this.model.confSupMisc = true;
                      }
                      if (element == '64') {
                        this.model.confSupNetwork = true;
                      }
                      if (element == '128') {
                        this.model.confSupLoadSensor = true;
                      }
                    });
                  }
                  if (value.Supervisors != '') {
                    let values = value.Supervisors;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '1') {
                        this.model.confSup2Input = true;
                      }
                      if (element == '2') {
                        this.model.confSup2Check = true;
                      }
                      if (element == '4') {
                        this.model.confSup2Pm = true;
                      }
                      if (element == '8') {
                        this.model.confSup2Isensor = true;
                      }
                      if (element == '16') {
                        this.model.confSup2Mode = true;
                      }
                      if (element == '32') {
                        this.model.confSup2Misc = true;
                      }
                      if (element == '64') {
                        this.model.confSup2Network = true;
                      }
                      if (element == '128') {
                        this.model.confSup2LoadSensor = true;
                      }
                    });
                  }
                }
                if (datas.MISCSettingsJson['cmd_1111'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1111'];
                  if (value.Enabled == '01') {
                    this.model.detailed = true
                  } else { this.model.detailed = false }
                }
                if (datas.MISCSettingsJson['cmd_1112'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_1112'];
                  if (value.Devices != '') {
                    let values = value.Devices;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '1') {
                        this.model.commuUltimate = true;
                      }
                      if (element == '2') {
                        this.model.commuAdv = true;
                      }
                      if (element == '4') {
                        this.model.commuCell = true;
                      }
                      if (element == '16') {
                        this.model.commuChar = true;
                      }
  
                    });
  
                  }
  
                }
                if (datas.MISCSettingsJson['cmd_10C1'] != undefined) {
                  let value = datas.MISCSettingsJson['cmd_10C1'];
                  if (value.EnabledAlarm != '') {
                    let values = value.EnabledAlarm;
                    let list = values.split(',');
                    list.forEach(element => {
                      if (element == '1000') {
                        this.model.checklist = true;
                      }
                      if (element == '0010') {
                        this.model.impact = true;
                      }
                      if (element == '0001') {
                        this.model.lowfule = true;
                      }
                      if (element == '0100') {
                        this.model.pmdue = true;
                      }
  
                    });
  
                  }
  
                }
              }
              this.model.inputDedicated = true;
              
              if(datas.IntegrationSettings!=null && datas.IntegrationSettings!=''){
               // this.ebis='Y';
                
                let temp=JSON.parse('['+datas.IntegrationSettings+']')[0]
                
                this.hrmList.forEach(element => {
                  if(element.key==temp.HMR1){
                    this.model.hrm1Id=temp.HMR1
                    this.hrm1=element.value
                  }
                  if(element.key==temp.HMR2){
                    this.model.hrm2Id=temp.HMR2
                    this.hrm2=element.value
                  }
                  if(element.key==temp.HMR3){
                    this.model.hrm3Id=temp.HMR3
                    this.hrm3=element.value
                  }
                  if(element.key==temp.HMR4){
                    this.model.hrm4Id=temp.HMR4
                    this.hrm4=element.value
                  }
                });
              }
              if(datas.EBisFrequnecy!=null){
                this.frequencyList2.forEach(e=>{
                  if(e.key==datas.EBisFrequnecy){
                    this.model.EBisFrequnecy=datas.EBisFrequnecy
                    this.frequency =e.value
                  }
                })
              }
              if(datas.EBisTime!=null){
                let date=new Date(datas.EBisTime)
                this.model.EBisTime= new Date(date.getTime() + date.getTimezoneOffset() * 60000);
              }

            }
            else {
              this.toastr.warning(body.Message, "Warning")
            }
          }
          catch (error) {
            console.log(error)
          }
        })
    } catch (error) {
      console.log(error)
    }
  }
  checklistName(data){
    this.checkList=data.Name
    this.model.CheckListID=data.ID
  }
  
  logoutTypeList = [{ key: '00', value: 'Disable' }, { key: '01', value: 'By Inputs' }, { key: '02', value: 'By Timer' }]
  logoutChange(data) {
    this.model.LogoutType = data.key
    this.model.logoutTypeName = data.value
  }
  model: AssetType = new AssetType();
  applyEdit() {
    // this.model= new AssetType();
    try {

      if (this.type === "" || this.type === 'assetType') {
        if (this.model.Name == '' || this.model.Name == undefined) {
          this.toastr.warning("Type Name is Mandatory", "Warning");
          return;
        }
        if (this.commonsite != undefined && this.commonsite.bubbles.length == 0) {
          this.toastr.warning("Site is Mandatory", "Warning");
          return;
        } else {
          if (this.commonsite != undefined) {
            this.model.SiteID = this.commonsite.bubbles.map(a => { return a.id })
          }
        }
        if (this.powerdBy === "") {
          this.toastr.warning("Powered by is Mandatory", "Warning");
          return;
        }
        if (this.model.System == '1' || this.model.System == '2' || this.model.System == '3') {

          if (this.model.FuelCost === "0") {
            this.toastr.warning("Fuel cost must be greater than zero", "Warning");
            return;
          }
        }
        if (this.model.System == '4' && this.hmrEnable) {
          if (this.model.discThres.trim() == "") {
            this.toastr.warning("Discharge Threshold is Mandatory", "Warning");
            return;
          }
          if (this.model.discThres == "0") {
            this.toastr.warning("Discharge Threshold must be greater than zero", "Warning");
            return;
          }
          if (this.model.hmrInputName == null || this.model.hmrInputName == undefined || this.model.hmrInputName == '' || this.model.hmrInputName.trim() == '') {
            this.toastr.warning("Input Name is Mandatory", "Warning");
            return;
          }
        }
        if (this.model.UsageThreshold === "") {
          this.toastr.warning("Usage Threshold is Mandatory", "Warning");
          return;
        }

        if (this.model.ComThreshold === "") {
          this.toastr.warning("Com Threshold is Mandatory", "Warning");
          return;
        }
        if (this.comType === "") {
          this.toastr.warning("Com Type is Mandatory", "Warning");
          return;
        }

      }
      this.loader = true;
      this.assetprohelperService.PostMethod('Configuration/CreateAssetType', this.model).subscribe(response => {
        this.loader = false;
        try {
          let body = response.json();
          if (body.Status) {
            this.toastr.success(body.Message, "Success!");
          } else {
            this.toastr.warning(body.Message, 'Warning')
          }
        }
        catch (error) {
          console.log(error)
        }
      }, error => {
        this.loader = false;
      })
    } catch (error) {
      console.log(error)
    }
  }
  saveProfile() {

  }
  @ViewChild('commonsite') commonsite: any;
  sytemUsedList = []
  sytemUsed = 'Ultimate'
  hmrEnable = false
  defaultpage: boolean = true;


  defaultFields() {
    this.model = new AssetType();
    if (this.sytemUsedList.length != 0) {
      this.sytemUsed = this.sytemUsedList[0].Value;
      this.model.System = this.sytemUsedList[0].Key
      this.getClassificationList(this.model.System);
      let parent = this;
      setTimeout(() => {
        if (parent.commonsite != undefined) {
          parent.commonsite.SystemID = parent.sytemUsedList[0].Key
          parent.commonsite.GetAssetsList();
        }
      }, 300);

    } else {
      this.getSystemUsedList();
    }
    this.hmrEnable = false
    this.profileName_id = null;
    this.ProfileNameselected = 'Select Profile';
  }
  heightAdj: boolean = false
  systemUsedChange(value) {
    this.defaultpage = true
    this.sytemUsed = value.Value;
    this.model.System = value.Key
    this.getClassificationList(value.Key);
    //this.getComTypeList()
    this.commonsite.SystemID = value.Key
    this.commonsite.GetAssetsList();
    if (this.model.System != '4') {
      this.hmrEnable = false
    }
    this.getSystemType(value)
  }

  inputHrm = ''
  getSystemUsedList() {
    try {
      this.classificationList = []
      this.classificationUsed = ''
      if (this.defaultpage) {
        this.sytemUsed = ''
        this.model.System = ''
      }
      //var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
      let url = 'Configuration/GetSystemList'
      this.sytemUsedList = [];
      this.loader = true;
      this.assetprohelperService.GetMethod(url).subscribe(
        data => {
          this.loader = false;
          let body: any = data.json();
          this.sytemUsedList = body.Data;
          if (this.defaultpage) {
            this.sytemUsed = this.sytemUsedList[0].Value;
            this.model.System = this.sytemUsedList[0].Key
          }
          this.getClassificationList(this.sytemUsedList[0].Key);
          if (this.commonsite != undefined) {
            this.commonsite.SystemID = this.model.System
            this.commonsite.GetAssetsList();
          }
        })
    }
    catch (e) {
      console.log(e)
    }
  }
  eqclassificationList = []
  eqclassificationUsed = ''
  classificationList = []
  classificationUsed = ''
  voltage = ''

  voltageList = [{ key: '12', value: '12V (6 Cell)' },
  { key: '24', value: '24V (12 Cell)' },
  { key: '36', value: '36V (18 Cell)' },
  { key: '48', value: '48V (24 Cell)' },
  { key: '72', value: '80V (36 Cell)' },
  { key: '80', value: '80V (40 Cell)' },
  { key: '84', value: '84V (42 Cell)' },
  { key: '96', value: '96V (48 Cell)' }]
  voltageChange(value) {
    this.model.Battery_BatteryVoltage = value.key
    this.voltage = value.value
  }
  classificationChange(value) {
    this.defaultpage = true
    this.classificationUsed = value.Value;
    this.model.Classification = value.Key
    this.getPoweredBy(this.model.Classification);
  }
  eqclassificationChange(value) {

    this.eqclassificationUsed = value.Value;
    this.model.eqClassification = value.Key

  }
  loader4 = false;
  getClassificationList(id) {
    try {
      if (this.defaultpage) {
        this.classificationUsed = ''
        this.model.Classification = ''
      }
      //var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
      let url = 'Configuration/GetAssetTypeClassificationListBySystemID'
      this.loader4 = true
      this.classificationList = [];
      this.assetprohelperService.PostMethod(url, { SystemID: id, HMR: this.hmrEnable ? "Y" : "N" }).subscribe(
        data => {
          this.loader4 = false;
          let body: any = data.json();
          this.classificationList = body.Data;
          if (this.defaultpage) {
            this.classificationUsed = this.classificationList[0].Value
            this.model.Classification = this.classificationList[0].Key
          }
          this.getPoweredBy(this.model.Classification);
        })
    }
    catch (e) {
      console.log(e)
    }
  }
  loader2 = false
  geteqClassificationList(id) {
    try {

      this.eqclassificationUsed = ''
      this.model.eqClassification = ''

      //var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
      let url = 'Configuration/GetAssetTypeClassificationListBySystemID'
      //this.loader2 = true
      this.eqclassificationList = [];
      this.assetprohelperService.PostMethod(url, { SystemID: id, HMR: this.hmrEnable ? "Y" : "N" }).subscribe(
        data => {
          //    this.loader2 = false
          let body: any = data.json();
          this.eqclassificationList = body.Data;
          this.eqclassificationUsed = this.eqclassificationList[0].Value
          this.model.eqClassification = this.eqclassificationList[0].Key
        })
    }
    catch (e) {
      console.log(e)
    }
  }
  hmrChanged() {
    this.getClassificationList(this.model.System);
  }
  powerdBy: string = '';

  powerdByList = []
  poweredByChange(value) {
    this.defaultpage = true
    this.powerdBy = value.Value;
    this.model.PoweredBy = value.Key
    if (this.powerdBy == 'Electric') {
      this.model.Battery_LowVoltage_Threshold = '40'
    } else {
      this.model.Battery_LowVoltage_Threshold = '11'
    }
  }
  loader3 = false;
  getPoweredBy(id) {
    try {
      let url = 'Configuration/GetPoweredByList'
      this.powerdByList = [];
      this.model.Battery_LowVoltage_Threshold = '11'
      if (this.defaultpage) {
        this.powerdBy = ''
        this.model.PoweredBy = ''
      } this.loader3 = true;
      this.assetprohelperService.PostMethod(url, {
        "Classification": id
      }).subscribe(
        data => {
          this.loader3 = false;
          let body: any = data.json();
          this.powerdByList = body.Data;
          if (this.defaultpage) {
            this.powerdBy = this.powerdByList[0].Value
            this.model.PoweredBy = this.powerdByList[0].Key
            if (this.powerdBy == 'Electric') {
              this.model.Battery_LowVoltage_Threshold = '40'
            } else {
              this.model.Battery_LowVoltage_Threshold = '11'
            }
          }
        })
    }
    catch (e) {
      console.log(e)
    }
  }
  comTypeList = []
  comType: string = ''
  comTypeId: string = ''
  getComTypeList() {
    try {
      //var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
      let url = 'Configuration/GetComTypeList'
      this.comTypeList = [];
      this.comType = ''
      this.comTypeId = ''
      //this.loader = true;
      this.assetprohelperService.GetMethod(url).subscribe(
        data => {
          //  this.loader = false;
          let body: any = data.json();
          this.comTypeList = body.Data;
          this.comType = this.comTypeList[0].Value
          this.comTypeId = this.comTypeList[0].Key
        })
    }
    catch (e) {
      console.log(e)
    }
  }
  comTypeChange(value) {
    this.comType = value.Value;
    this.comTypeId = value.Key
  }
}
