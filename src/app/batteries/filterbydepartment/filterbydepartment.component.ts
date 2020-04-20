import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonanDepartmentComponent } from 'src/app/assertpro/configuration/assettype/commondepartment/commondepartment.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-filterbydepartment',
  templateUrl: './filterbydepartment.component.html',
  styleUrls: ['./filterbydepartment.component.css']
})
export class FilterbydepartmentComponent implements OnInit {
  @ViewChild("commondepartment") commondepartment: CommonanDepartmentComponent;
  constructor(public dialogRef: MatDialogRef<FilterbydepartmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.sentDepartmentList=data.departmentList
  }

  ngOnInit() {
  }
  sentDepartmentList = [];
  
  closeDialog(){  
    let sentDepartmentList=[]
      this.commondepartment.bubbles.forEach(row=>{
        sentDepartmentList.push(row.id);
    }); 
    this.dialogRef.close(sentDepartmentList);
  }
}
