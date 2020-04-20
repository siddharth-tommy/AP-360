import { Component, OnInit, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.css'],
})


export class CertificationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['AssetTypeName', 'CertDate', 'ExpDate', 'RecertDate', 'Trainee', 'del'];
  position: string;
  certification_date: string;
  expiration_date: string;
  recertification_date: string;
  trainee: boolean;
  addrow = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  input_position: string;
  input_certificationdate: string;
  input_recertificationdate: string;
  input_trainee: string;
  input_expiredate: string;

  details: any;
  constructor(public dialogRef: MatDialogRef<CertificationComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService,
    private assetprohelperService: AssetprohelperService) {
    this.details = data.data
    this.loadCertification(this.details.ID);
  }
  assetTypeList=[]
  GetAssetsList() {

    var computedID = (localStorage.getItem('selectitemId') == null || localStorage.getItem('selectitemId') == undefined) ? "null" : localStorage.getItem('selectitemId');
    let url = 'TrackingHistory/assetlistwithsite?id=' + computedID;
    this.assetTypeList = [];
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.assetTypeList = body.Data;

      })
  }
  loadCertification(data) {

    try {
      let body = {
        "OperatorID": data,
      }
      this.assetprohelperService.PostMethod('UsersDirectory/GetCertificationsByOperatorID', body).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {            
            if (body.Data != undefined && body.Data != null && body.Data.length != 0) {
              let details = body.Data
              let datas = []
              details.forEach(element => {
                datas.push(
                  {
                    AssetTypeID: element.AssetTypeID,
                    AssetTypeName: element.AssetTypeName,
                    OperatorID: element.OperatorID,
                    System: element.System,
                    CertDate: new Date(element.CertDate).toDateString(),
                    ExpDate: new Date(element.ExpDate).toDateString(),
                    RecertDate: new Date(element.RecertDate).toDateString(),
                    trainee: element.trainee == 'Y' ? 'Yes' : 'No',
                    del: '',
                    ID: element.ID
                  }
                )
              });

              this.dataSource.data = datas;
            }
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (error) {
          console.log(error)
        }
      });
    }
    catch (saveError) {
      console.log(saveError)
    }
  }
  save() {
    if(this.dataSource.data.length==0){
      this.toastr.warning("Please Add Certificates", "Warning");
      return;
    }
    try {
      let data=this.dataSource.data 
      let details=[]
      data.forEach(element => {
        element.Trainee=element.Trainee=='Yes'?'Y':'N'
        element.CertDate=new Date(element.CertDate)
        element.ExpDate=new Date(element.ExpDate)
       element.RecertDate=new Date(element.RecertDate);
       element.ID=''
        details.push(element)
      })
      let body = {
        "Certificates": details,
      }
      this.assetprohelperService.PostMethod('UsersDirectory/UpdateCertificationByID', body).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!');
            this.dialogRef.close('Yes');
          }
          else {
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (error) {
          console.log(error)
        }
      });
    }
    catch (saveError) {
      console.log(saveError)
    }
  }
  message;
  answer1
  answer2
  asset: any;
  assetId=null
  id=null
  operatorId=null
  selected: string = '';
  certification: any;
  recertificationAlert: string;
  System=null
  expiry: any;
  // trainee:string;
  assetType = [
  ];
  certificationAlart = [
    { value: '2 Months' },
    { value: '1 Months' },
    { value: '6 Months' }
  ];
  onNoClick(): void {
    this.selected = '';
    this.dialogRef.close();
  }
  ngOnInit() {
    //this.certification = new Date('2018-04-28');
    //this.expiry = new Date('2018-04-28');
   // this.asset = this.assetType[0].value;
    this.recertificationAlert = this.certificationAlart[0].value;
    this.dataSource.paginator = this.paginator;
    this.GetAssetsList();
  }
  ngAfterViewInit() {

  }
  msg = '';
  onSubmit() {
    // if (this.message != undefined && this.message != '' && this.answer1!=undefined && this.answer1!='') {
    this.dialogRef.close('Yes');
    // } else {
    //     if (this.message == undefined || this.message == '')
    //     this.toastr.warning("Message is Empty", "Warning");
    //    else if (this.answer1 == undefined || this.answer1 == '')
    //     this.toastr.warning("Answer1 is Empty", "Warning");

    //     this.msg = 'Please Choose any option'
    // }
  }

  add_row() {
    let data = this.dataSource.data
    if (this.asset == undefined || this.asset == '') {
      this.toastr.warning("Asset is Mandatory", "Warning");
      return;
    }
    if (this.certification == undefined || this.certification == '') {
      this.toastr.warning("Certification Date is Mandatory", "Warning");
      return;
    }
    if (this.expiry == undefined || this.expiry == '') {
      this.toastr.warning("Expiry Date is Mandatory", "Warning");
      return;
    }
    let trainee = 'Yes'
    if (!this.trainee) {
      trainee = 'No'
    }
    let recerdat=new Date();
    data.push(
      {
        AssetTypeName: this.asset.assetstype,
        AssetTypeID: this.asset.ID,
        CertDate: this.certification.toDateString(),
        ExpDate: this.expiry.toDateString(),
        RecertDate: recerdat.toDateString(),
        trainee: trainee,
        del: '',
        ID:this.id, 
        OperatorID: this.operatorId,
        System: this.System,
        assets:this.asset
      }
    )
    this.asset = '';
    this.assetId=null;
    this.certification = undefined;
    this.recertificationAlert = '';
    this.expiry = undefined;
    this.trainee = false
    //this.operatorId = null
    this.dataSource.data = data
    this.dataSource.paginator = this.paginator
    this.assetId = null
  //  this.id = null
  }
  index = "";
  assetChange(){

//this.assetId = this.asset.ID;
//this.asset =  this.asset.assetstype;
  }
  deleterow(i) {
    let data = this.dataSource.data;
    data.splice(i, 1)
    this.dataSource.data = data
    this.dataSource.paginator = this.paginator
  }
  editrow(row, index) {
  return true;
    // this.asset = row.position;
    // this.certification = new Date(row.certification_date);
    // this.recertificationAlert = row.recertification_date;
    // this.expiry = new Date(row.expiration_date);
    // this.trainee = false
    // if (row.trainee == 'Yes') {
    //   this.trainee = true
    // }

    this.assetId = row.AssetTypeID,
      this.asset = row.AssetTypeName,
      ///this.operatorId = row.OperatorID,
      //   System:element.System,
      this.certification = new Date(row.CertDate).toDateString(),
      this.expiry = new Date(row.ExpDate).toDateString(),
      this.recertificationAlert = new Date(row.RecertDate).toDateString(),
      this.trainee = row.trainee == 'Yes' ? true : false
    //this.id = row.ID

  }
}




const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'acs', certification_date: new Date().toDateString(), expiration_date: new Date().toDateString(), recertification_date: '2 Months', trainee: 'No', del: '1' },
]
export interface PeriodicElement {
  position: string, certification_date: string, expiration_date: string, recertification_date: string, trainee: string, del: string;
}
