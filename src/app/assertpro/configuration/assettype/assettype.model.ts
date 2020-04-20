export class AssetType {
    "ID":any=  null;
    "Name":any=  "";
    "Classification":any=  null;
    "eqClassification":any=  null;
    "PoweredBy":any=  null;
    "UsageThreshold":any=  70;
    "ComThreshold":any=  48;
    "Comments":any=  '';
    "SensorLocation":any=  null;
    "ImpactAlarmThresholdX":any=  4;
    "ImpactAlarmThresholdY":any=  4;
    "ImpactAlarmThresholdZ":any=  4;
    "ImpactAlertThresholdX":any=  3;
    "ImpactAlertThresholdY":any=  3;
    "ImpactAlertThresholdZ":any=  3;
    "SamplingX":any=  1000;
    "SamplingY":any=  1000;
    "SamplingZ":any=  1000;
    "ProximityThreshold":any=  null;
    "ProximityDuration":any=  null;
    "AggressiveThreshold":any=  70;
    "AggressiveDuration":any=  500;
    "InspectionMinTime":any=  null;
    "InspectionMaxTime":any=  500;
    "InspectionFrequency":any=  8;
    "SpeedAllowedPerHour":any=  25.749504;
    "SpeedAllowedDuration":any=  5;
    "MiniCheckList":any=  "0";
    "IdlingOperator":any=  "Y";
    "OperatorTimer":any=  180;
    "IdlingAsset":any=  "N";
    "AssetTimer":any=  "300";
    "Frequency":any=  500;
    "PM":any=  true;
    "LowVoltageThreshold":any=  null;
    "NumericBadgeEntry":any=  "Y";
    "LowFuel":any=  null;
    "DebounceTimer":any=  null;
    "AlertForTimer":any=  null;
    "ShortTime":any=  null;
    "NoofShortTime":any=  null;
    "MaintainanceTime":any=  null;
    "Active":any=  "Y";
    "Status":any=  0;
    "InspectionEnable":any=  "N";
    "CheckListEnable":any=  "Y";
    "OverPM":any=  "50";
    "UnderPM":any=  null;
    "FuelCost":any=  "";
    "FuelTracking":any=  "N";
    "FuelAlert":any=  null;
    "FuelTotalTime":any=  null;
    "ImpactLearning":any=  null;
    "CheckListEnableMaint":any=  "N";
    CheckListRandomlyEnabled;
    "Icon":any=  "/includes/images/AssetTypeIcons/Ground Support Equipment (GSE)/tug-circle.png                                                                                                                                                                                  ";
    "CheckListID";
    "Voltage":any=  null;
    "Temperature":any=  -17.77777777777778;
    "OverrideVoltage":any=  null;
    "OverrideTemperature":any=  null;
    "SensorEnabled":any=  "Y";
    "EngineOffEnabled":any=  "N";
    "AlertForSpeedThresholdAlarm":any=  1;
    "SenseInputsAlertEnabled":any=  "N";
    "MinDurationAlertEnabled":any=  "N";
    "LoadSensorEnabled":any=  "N";
    "LoadSensorMassUnit":any=  null;
    "LoadSensorDebounceTimer":any=  "30";
    "LoadSensorPressureChange":any=  "50";
    "LoadSensorWeightThreshold":any=  3000;
    "LoadSensorOverWeightTimeThreshold":any=  "15";
    "LogOnOptionEnabled":any=  "N";
    "LogOnOptionAllowedTimeToChoose":any=  null;
    "LogOnOption1":any=  null;
    "LogOnOption2":any=  null;
    "LogOnOption3":any=  null;
    "LogOnOption4":any=  null;
    "IdlingOptionEnabled":any=  "N";
    "IdlingAllowedTime":any=  null;
    "IdlingAllowedTimeToChoose":any=  null;
    "IdlingOption1":any=  null;
    "IdlingOption2":any=  null;
    "IdlingOption3":any=  null;
    "IdlingOption4":any=  null;
    "HighSeverity":any=  7;
    "MediumSeverity":any=  5;
    "LowVoltageEnabled":any=  "N";
    "SpeedEnabled":any=  "Y";
    "System":any=  null;
    "HMRIntegrationSetting":any=  "Y";
    "SiteID":any=  null;
    "Battery_NoofCells":any=  null;
    "Battery_AHCapacity":any=  null;
    "Battery_DelayToOpen":any=  null;
    "Battery_EQStartRate":any=  "5";
    "Battery_EQFinishRate":any=  null;
    "Battery_OverVoltage_Threshold":any=  "60"
    "Battery_LowVoltage_Threshold":any= "11";
    "Battery_OverCurrent_Threshold":any=  "600";
    "Battery_OverTeperature_Threshold":any= "105";
    "Battery_CableTempSensor":any=  "N";
    "Battery_CableTempAlarm_Threshold":any=  null;
    "Battery_CableTempAlert_Threshold":any=  null;
    "Battery_LowSoc":any=  "Y";
    "Battery_LowSoCAlertThreshold":any=  "20";
    "Battery_SoCCutoff":any=  null;
    "Battery_LowWater":any=  "N";
    "Battery_ChargeToOpen":any=  null;
    "Battery_DischargeToOpen":any=  null;
    "Battery_EQFrequency":any=  "7";
    "Battery_LowVoltageAlarm":any=  null;
    "Battery_MisPick":any=  null;
    "Battery_OverCurrentAlarm":any=  "Y"
    "Battery_OverTeperatureAlarm":any=  "N";
    "Battery_OverVoltageAlarm":any=  null;
    "Battery_BatteryVoltage":any=  null;
    "Battery_CapacityType":any=  null;
    "CommunicationType":any=  1;
    "Battery_BatteryLife":any=  null;
    "Battery_ExpectedEOL":any=  null;
    "Battery_Debounce":any=  "30";
    "Battery_LowWaterDays":any=  "1";
    "Battery_LowSoCAlarmThreshold":any=  "15";
    "Battery_CoolingTemperature":any=  "35";
    "Battery_PickAcceleration_ThresholdX":any=  "1";
    "Battery_PickAcceleration_ThresholdY":any=  "1";
    "Battery_PickAcceleration_ThresholdZ":any=  "1";
    "Charger_PowerUsageReporting":any=  null;
    "Charger_PowerUsageReporting_Frequency":any=  0;
    "Battery_ReferenceVoltage_PerCell":any=  "2.40";
    "Battery_MinCharge_Voltage_PerCell":any=  "1.80";
    "Battery_MaxCharge_Voltage_PerCell":any=  "3.30";
    "Battery_MinStart_Voltage_PerCell":any=  "1.70";
    "Battery_MaxStart_Voltage_PerCell":any= "2.35";
    "Battery_Max_StartRate":any=  "50";
    "Battery_Finish_Current":any=  "5";
    "Battery_Min_EqualizationTime":any=  "60";

    "Battery_Max_Resistance":any=  "200";
    "Battery_Min_Temperature":any=  "0";
    "Battery_Max_Temperature":any=  "149";
    "Battery_Warn_Temperature":any=  "140";
    "Battery_Max_Current_AboveWarn":any=  "300";
    "Battery_AH_FullCharge":any=  "500";
    "Battery_AH_Equalization":any=  "3500";
    "Battery_Hrs_FullCharge":any=  "24";
    "Battery_Hrs_Equalization":any=  "144";
    "Battery_ChargeCycles_FullCharge":any=  "3";
    "Battery_ChargeCycles_Equalization":any=  "50";
    "MISCSettingsJson":any=  null;
    "ApplyToAllSites":any=  null;
    "InstallationAlertEnabled":any=  "Y";
    "Battery_MisPickBuzzerDuration":any=  null


    key:string='Key'
    occupancy:string='Seat'
    travel:string='Travel'
    lowFule:string='Lift'
    seatBelt:string='Seat belt'
    Auxiliary:string='Auxiliary'
    input1:string='Other 1'
    input2:string='Other 2'
    input3:string='Other 3'
    
    
    discThres:any='';
    hmrInputName:any;
    visible1:boolean=true
    visible2:boolean=true
    visible3:boolean=true
    visible4:boolean=true
    visible5:boolean=true
    visible6:boolean=true
    visible7:boolean=true
    visible8:boolean=true
    keyalarmTogglerButton: boolean=false;
    keyproductivityTogglerButton = false;
    occupancyalarmTogglerButton = false;
    occupancyproductivityTogglerButton: boolean;
    travelalarmTogglerButton: boolean=false;
    travelproductivityTogglerButton = true;
    lowfuelalarmTogglerButton: boolean=false;
    lowfuelproductivityTogglerButton = true;
    seatbeltalarmTogglerButton: boolean=false;
    seatbeltproductivityTogglerButton: boolean=false;
    input_one_alarmTogglerButton: boolean=false;
    input_one_productivityTogglerButton = false;
    input_two_alarmTogglerButton = false;
    input_two_productivityTogglerButton = false;
    input_three_alarmTogglerButton: boolean=false;
    input_three_productivityTogglerButton = false;
    keyCheckbox: boolean=true;
    occupancyCheckbox: boolean=true;
    travelCheckbox = true;
    lowfuelCheckbox: boolean=true;
    seatbeltCheckbox = true;
    input_one_Checkbox = false;
    input_two_Checkbox: boolean=false;
    input_three_Checkbox = false;
    keyInput: boolean = true;
    input_threeInput: boolean = false;
    input_twoInput: boolean = false;
    input_oneInput: boolean = false;
    seatbeltInput: boolean = false;
    lowFuel_Input: boolean = true;
    occupancyInput: boolean = true;
    travelInput: boolean = true;
    key_toggler = 'Y';
    occupancy_toggler = 'Y';
    travel_toggler = 'Y';
    low_fuel_toggler = 'Y';
    seat_belt_toggler = 'Y';
    input_one_toggler = 'N';
    input_two_toggler = 'N';
    input_three_toggler = 'N';
    unoccupied = "Y"
    idling = "Y";
    //operational
    threshold:boolean=false;
    operationalhr:string='500';
    underpm:string='50'
    overpm:string='50'
    HMR1
    HMR2
    HMR3
    HMR4
    HMR5
    HMR6
    HMR7
    HMR8
    sense_inputToggler:boolean=true
    
    //operationEnd
    //billing Rates
    startDate:Date=new Date();
    occupancyCost_per_hour:string=''
    costPer_kwh:string = '';
    adminPercentage:string ='';
    includeCharge_time:boolean=false;
    //billing Rates End
    //Alarm

    
    
    
    

    
    
    
    
    
    
    //AlarmEnd
    //Interrel Configuration
    alarmlogout:boolean=false
    alarmLogImpact
    alarmLogSkip
    alarmLogWrong
    alarmLogGeof
    alarmLogInput

    LogoutType="";
    logoutTypeName
    welcome
    Code
    DOPValue
    modeAccess:boolean=false
    modeMainAcg:boolean=false;
    modeMainMaintenance:boolean=false;
    modeMainSuper:boolean=false;
    modeMainAdmin
    modeByAcg
    modeByMain
    modeBySuper
    modeByAdmin
    alarmTo:boolean=false
    alarmToInput
    alarmToImpact
    alarmToPM
    alarmToInput1
    alarmToInput2
    alarmToInput3
    alarmToInput4
    alarmToInput5
    alarmToInput6
    alarmToInput7
    alarmToInput8
    inputDedicated:boolean=false
    pmApproching:boolean=false
    temperatureOver
    configurationmenu:boolean=false
    confMainInput
    confMainCheck
    confMainPm
    confMainIsensor
    confMainMode
    confMainMisc
    confMainNetwork
    confMainLoadSensor
    confSupInput
    confSupCheck
    confSupPm
    confSupIsensor
    confSupMode
    confSupMisc
    confSupNetwork
    confSupLoadSensor
    confSup2Input
    confSup2Check
    confSup2Pm
    confSup2Isensor
    confSup2Mode
    confSup2Misc
    confSup2Network
    confSup2LoadSensor
    commuUltimate
    commuAdv
    commuCell
    commuChar
    EBisFrequnecy
    //InterrnelConfiguration End
    checkList=true;
    maintenance_modeToggler=false
    
    //sensor start

    
    sharpTurningDuration:string='500';

    loadTrck: boolean = true;
    
    
    
    
    //sensor end

    //general start
    powerusage
    operators
    general_input1="Yes"
    general_keyHmr=true;
    g_keyalarmTogglerButton=false
    g_keyproductivityTogglerButton=false
    g_keyCheckbox=true;
    g_keyVisibleCheckbox=true;
    
    g_input2='Yes'
    g_seatHmr=true;
    g_seatAlarmTogglerButton=false
    g_seatProd_TogglerButton=false;
    g_seatCheckbox=true;
    g_visibleSeatCheckbox=true;

    g_input3="Yes";
    g_travelHmr=true;
    g_travelalarmTogglerButton=false;
    g_travelProd_TogglerButton=true;
    g_travelCheckbox=true;
    g_visibleTravelCheckbox=true;

    g_input4="Yes"
    g_auxilaryHmr=false;
    g_auxilaryAlarmTogglerButton=false;
    g_auxilaryProd_TogglerButton=false;
    g_auxilaryCheckbox=false;
    g_visibleAuxilaryCheckbox=true;
    g_unoccupied='No'
    g_PM=true;
    g_frequencyHr=500
    g_underPm=50;
    g_overPm=50;
    EBisTime
    
    //general end
    DirectionThreshold:string='';
    DistanceThreshold:string='';
    TimeFrequency:string='';
    seatId;
    seatValue;
    fuelId;
    fuelValue;
    fluidId;
    fluidValue;
    HoursBeforeForAlert
    gpsFunction=false;
    relay=false;
    AccessControl
    InputSelected=false;
    TimeInMinutes="00"
    temperatureEnabled=false;
    Message
    detailed=false;
    input1option
    input2option
    input3option
    input4option
    input5option
    input6option
    input7option
    input8option
    checklist
    impact
    lowfule
    pmdue
    hrm1Id
    hrm2Id
    hrm3Id
    hrm4Id
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}