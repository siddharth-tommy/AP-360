export class Operator {
    id:string=''
    input_batch: string="";
    input_role: string="";
    input_department: string="";
    input_status: string="";
    input_monthlyAlarms: string="";
    input_complianceTh: string="";
    input_subStation: string="";
    siteId:string=''
    siteName: string="";
    input_accessLevel: string="";
    accessLevelName:string=""
    input_burdenRate: string="";
    input_monthlyIncident: string="";
    input_suspend:boolean=false;
    input_usageTh: string="";
    input_email: string="";
    input_mobile: string="";
    input_nickName: string="";
    input_lastName: string="";
    input_firstNmae: string="";
    input_productivity: string="";
    input_matCheckbox:boolean = false;
    editHomeEnabled:boolean = false;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}