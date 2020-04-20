import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'stockimport',
  templateUrl: './stockimport.component.html',
  styleUrls: ['./stockimport.component.css']
})
export class StockImportComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<StockImportComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService,
    public assetprohelperService: AssetprohelperService) {

  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  files: any;
  onFileSelect(event) {
    let filename = event.files[0].name
    let filesize=event.files[0].size
    let filenamelist = filename.split('.');
    if (filenamelist.length > 0 && (filenamelist[1] == 'csv' || filenamelist[1] == 'CSV')) {
      if(filesize>0){
       this.files=event;
      }else{
        this.toastr.warning("File is Empty", 'Warning!');
        this.myInputVariable.nativeElement.value = '';
      }
    } else {
      this.toastr.warning("CSV File is Mandatory", 'Warning!');
      this.myInputVariable.nativeElement.value = '';
    }
  }
  @ViewChild('inputFile') myInputVariable: ElementRef;
  onSubmit() {
    let event = this.files;
    if (this.files != null && this.files != undefined) {
      let filesize=event.files[0].size
      let filename = event.files[0].name
      let filenamelist = filename.split('.');
      if (filenamelist.length > 0 && (filenamelist[1] == 'csv' || filenamelist[1] == 'CSV')) {
        if(filesize>0){
          
          this.updateloadFiled()
         // this.toastr.success("File Uploaded Successfully", 'Success!');
          //this.dialogRef.close();
        }else{
          this.toastr.warning("File is Empty", 'Warning!');
          this.myInputVariable.nativeElement.value = '';
        }
      } else {
        this.toastr.warning("CSV File is Mandatory", 'Warning!');
        this.myInputVariable.nativeElement.value = '';
      }
    }else{
      this.toastr.warning("Please select a file to upload", 'Warning!');
    }
  }
  updateloadFiled(){
    
    var  formData=new FormData(); 
    formData.append('SampleCSV',this.files.files[0]);
    this.assetprohelperService.PostMethod('Vendor/UploadCSV',formData).subscribe(data=>{
       this.toastr.success("File Uploaded Successfully", 'Success!');
 		this.dialogRef.close();
    })
  }
}