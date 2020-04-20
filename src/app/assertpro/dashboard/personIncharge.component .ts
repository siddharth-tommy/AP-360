import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { Inject, Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'person-incharge-popup',
  templateUrl: './personIncharge.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class PersonInchargepopupComponent {
  siteId:any;
  loader: boolean=false;
  constructor(private spinner: NgxSpinnerService, private assetprohelperService: AssetprohelperService,  public dialogRef: MatDialogRef<PersonInchargepopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService,public dialog: MatDialog) {     
    this.siteId=data.data
  }
  ngOnInit(){
    
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

    subject;
    messages;

    
    sendMail(){
      if(this.subject==undefined|| this.subject==''||this.subject.trim()==''){
        this.toastr.warning("Subject is Mandatory", "Warning");
        return
      }
      if(this.messages==undefined|| this.messages==''||this.messages.trim()==''){
        this.toastr.warning("Message is Mandatory", "Warning");
        return
      }
     if(this.siteId!=''){
      this.loader = true;
      this.assetprohelperService.PostMethod('Account/SentMail',
      {
        "SiteID": this.siteId,
       "Message": this.messages,
       "Subject": this.subject
      }).subscribe(data => {
        try {
          let body: any = data.json();
          this.loader = false
          if (body.Status) {
            this.dialogRef.close();
            this.toastr.success(body.Message, "Success");
          }
          else {
            this.dialogRef.close();
            this.toastr.warning(body.Message, "Warning");
          }
        }
        catch (mailerror) {
          console.log(mailerror)
        }
      });
     }
    }

   
}