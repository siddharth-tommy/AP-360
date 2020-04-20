import { AssetprohelperService } from './../../../share/services/assetprohelper.service';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  // @ViewChild('deliveryComponent') deliveryComponent: DeliveryComponent
  asset: boolean;
  @ViewChild('side') side: ElementRef;
  @Output() valueChange = new EventEmitter();
  @ViewChild('myDiv') myDiv: ElementRef;
  v1 = true;
  v2 = true;
  v3 = false;
  v4 = true;
  items=[{value:'Impact alarm',type:true},
  {value:'Out of geofence',type:true},
  {value:'Checklist lockout',type:false},
  {value:'Low fuel',type:true}]
  items2=[{value:'Impact alarm',type:true},
  {value:'Out of geofence',type:true},
  {value:'Checklist lockout',type:false},
  {value:'Low fuel',type:true}]
  items3=[{value:'Impact alarm',type:true},
  {value:'Out of geofence',type:true},
  {value:'Checklist lockout',type:false},
  {value:'Low fuel',type:true}]

  constructor(private assetprohelperService:AssetprohelperService,private toastr:ToastrService,public dialog: MatDialog) { }

  ngOnInit() {
    //this.loadDelivery();
  }
  public sidebar: any = false;
  opensideBar() {
    this.sidebar = !this.sidebar;
    this.myDiv.nativeElement.style.overflowY="auto";
    document.body.style.overflowY="hidden"
    this.asset = true;
    this.side.nativeElement.style.width = "100%";
    if(screen.availWidth>=1920){
      this.myDiv.nativeElement.style.width = "50%";
    }else
    this.myDiv.nativeElement.style.width = "55%";
    this.tabIndex = 0;
    this.loadData(4)
  }
  loadData(type) {
    try {
      let body = {
        "System": type
      }
      this.assetprohelperService.PostMethod('Notification/GetDeliveryList', body).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {            
            if (body.Data != undefined && body.Data != null && body.Data.length != 0) {
              this.items=body.Data
          
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
  goBack(){
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: 'Are you sure want to to back ?' }
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.closeHelpcontainer()
      }
    })
  }
  closeHelpcontainer() {
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    document.body.style.overflowY="auto"
  }

  addBtn(val) {
    //this.asset = false;
    //this.myDiv.nativeElement.style.width = "0";
    this.valueChange.emit(val);
  }
  tabIndex = 0;
  sidebarActive(info) {
  }
}
