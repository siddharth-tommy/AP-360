export class Batteries {
    id: string = null;
    siteId:string=''
    siteName:string=''
    vendorId: string = '';
    vendorName: string = '';
    assetTypeID: string = '';
    assetTypeName: string = '';
    name: string = '';
    acquisitionCost: string = '';
    acquisitionDate: any = null;
    acquisitionType: string = '';
    iCCID: string = '';
    installDate: any = null;
    leaseRental: string = '';
    leaseRentalDate:any=null;
    leaseRentalHours:any=null;
    make: string = '';
    model: string = '';
    // serialNumber: any = '';
    modemTypeCode: string = '';
    modemTypeName: string = '';
    unitID: string = '';
    unitModel: string = '';
    unitName:string=''
    acquisition:string=''
    version: string = '';
    serialNo:string=''
    unitSerialNo:string=''
    departmentName:any=[]
    departmentId:any=[]
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}