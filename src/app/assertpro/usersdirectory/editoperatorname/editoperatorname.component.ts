import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { MatDialog } from '@angular/material';
import { CertificationComponent } from '../certification/certification.component';;


const ELEMENT_DATA = [
  { Timestamps: '03/30/2018', time: '05:00 PM', Kinds: 'Impact', Assets: 'Asset_name', Locations: 'Location_name', Comments: '-', costs: '', Reports: '' },
  { Timestamps: '03/30/2018', time: '05:00 PM', Kinds: 'Impact', Assets: 'Asset_name', Locations: 'Location_name', Comments: '-', costs: '', Reports: '' },
  { Timestamps: '03/30/2018', time: '05:00 PM', Kinds: 'Impact', Assets: 'Asset_name', Locations: 'Location_name', Comments: '-', costs: '', Reports: '' },
  { Timestamps: '03/30/2018', time: '05:00 PM', Kinds: 'Impact', Assets: 'Asset_name', Locations: 'Location_name', Comments: '-', costs: '', Reports: '' },
];

@Component({
  selector: 'editoperatorname-component',
  templateUrl: './editoperatorname.component.html',
  styleUrls: ['./editoperatorname.component.css']
})
export class EditoperatorName implements OnInit {
  
  displayedColumns3: string[] = ['Date', 'Kind', 'AssetName', 'Location', 'Comment', 'Cost', 'Reports'];
  dataSource3:any = ELEMENT_DATA;
  @Output() valueChange = new EventEmitter();
  @ViewChild('myDiv') myDiv: ElementRef;
  datas: any;
  @ViewChild('side') side: ElementRef;
  vendor: string = 'Modern Handing Group';
  make: string = '';
  model: string = '';
  serialNO: string = '765-97654-9765';
  installDate: string = '04/11/2018 03:48 PM';
  leastRendal: string = '';
  aquationDate: string = '12/09/2018';
  acuationCost: string = '$5,987';
  acuationType: string = 'buy';


  sidebarActive(info) {
    this.sidebarmenu = info;
  }

  sidebarmenu: string = 'asset';
  fwVersion: string = '1.35';
  icicdNo: string = '';
  serialNo: string = '987654437890';
  constructor(private toastr: ToastrService, private assetprohelperService: AssetprohelperService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getuserSites();
  }
  asset: boolean = true;
  tabChange(value) {
    this.asset = value;
  }
  public sidebar: any = false;
  details
  opensideBar(data) {
    this.sidebar = !this.sidebar;
    this.asset = true;
    this.side.nativeElement.style.width = "100%";
    this.myDiv.nativeElement.style.width = "56%";
    document.body.style.overflowY="hidden";
    this.myDiv.nativeElement.style.paddingLeft="4.17%";
    if (data != undefined) {
      this.details = data
      if (this.details.CertDate != null && this.details.CertDate != undefined) {
        this.details.CertDate = new Date(this.details.CertDate)
      }
      this.loadIncident(data);
    }
  }
  goBack() {
     this.closeHelpcontainer();
  }
  closeHelpcontainer() {
    this.asset = false;
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    document.body.style.overflowY="auto";
    this.myDiv.nativeElement.style.paddingLeft="0";
  }
  editEnabled: boolean = false;
  onEditClilck() {
    this.editEnabled = true;
    if (this.asset) {

    } else {

    }
  }
  cancelEdit() {
    this.editEnabled = false;
  }
  save() {
    this.editEnabled = false;
    this.toastr.success("Updated Successfully", 'Success!');
  }
  editHomeEnabled: boolean = false;
  editHome() {
    this.editHomeEnabled = true;
    this.closeHelpcontainer();
    this.valueChange.emit(true);
  }
  cancelHomeEdit() {
    this.editHomeEnabled = false;
  }
  saveHome() {
    this.editHomeEnabled = false;
    this.toastr.success("Updated Successfully", 'Success!');
  }
  disabled: boolean = false;
  usersites = []
  selectdropdownitem: string = '';
  getuserSites() {
    let url = 'Account/UserSites';
    this.assetprohelperService.GetMethod(url).subscribe(
      data => {
        let body: any = JSON.parse(data['_body']);
        this.usersites = body.Data;
        // if(this.selectdropdownitem != 'All sites'){

        // }
        for (var i = 0; i < this.usersites.length; i++) {
          if (this.usersites[i].SiteID == localStorage.getItem('selectitemId')) {
            this.selectdropdownitem = this.usersites[i].Name;
          }
        }
        if (this.usersites.length == 0) {
          this.disabled = true;
        }
      })
  }
  SelectSiteMenu(site) {

    this.selectdropdownitem = site.Name;
  }
  openCertification(name) {
    let popupHeight = '90%'
    let width = '55%'
    if (screen.availWidth > 1800) {
      popupHeight = '56%'
      width = '35%'
    }
    let parent = this;
    let dialogRef = this.dialog.open(CertificationComponent, {

      data: { name: name,data:this.details },
      height: popupHeight,
      width: width,

    });
    dialogRef.afterClosed().subscribe(a => {
      if (a != undefined && a == 'Yes') {
        parent.toastr.success("Updated Successfully", 'Success!');
      }
    });
  }
  loadIncident(data) {
    let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction('WEEK');
    try {
      let body = {
        "ID": data.ID,        
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
        // "ID": "823B734D-4FD4-4A9E-B022-5D589EA0584C",        
        // "StartDate": "1970-05-20",
        // "EndDate": "1970-05-27"
      }
      this.dataSource3=[]
      this.assetprohelperService.PostMethod('UsersDirectory/GetUsersDirectoryOperatorIncidentsByID', body).subscribe(data => {
        try {
          let body: any = data.json();
          if (body.Status) {
            if(body.Data!=undefined && body.Data!=null && body.Data.length!=0){
              this.dataSource3=body.Data
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
  newFunction(value) {
    let startDates = new Date();
    startDates.setDate(startDates.getDate() - 7);
    let startDate = '' + startDates.getDate();
    let startMonth = '' + (startDates.getMonth() + 1);
    let startYear = '' + startDates.getFullYear();
    let endDates = new Date();
    let endDate = '' + new Date().getDate();
    let endMonth = '' + (new Date().getMonth() + 1);
    let endYear = '' + new Date().getFullYear();
    let endOldMonth = new Date().getMonth() - 1;
    let endMonths = new Date();
    endMonths.setMonth(endOldMonth);
    if (value==null ||value == 'WEEK') {
       startDates.setDate(startDates.getDate()+1)
       startMonth = '' + (startDates.getMonth() + 1);
       startDate = '' +startDates.getDate()
    }
    else if (value == 'PAST 2 WEEKS') {
      startDates = new Date();
      startDates.setDate(startDates.getDate() - 13);
      startDate = '' + startDates.getDate();
      startMonth = '' + (startDates.getMonth() + 1);
      startYear = '' + startDates.getFullYear();
    }
    else if (value == 'MONTH') {
      startDates = new Date();
      startDate = '1'
      startMonth = ''+(new Date().getMonth()+1);
      startYear = '' + startDates.getFullYear();
      endDate='' + startDates.getDate();
      endMonth =''+(new Date().getMonth()+1);
      endYear = '' + startDates.getFullYear();
    }
    if (value == 'PREVIOUS MONTH') {
      startDates=new Date();
      startDate = '1';
      startMonth = ''+(startDates.getMonth());
      startYear = endYear;
      endDate = ''+ new Date(startDates.getFullYear(),startDates.getMonth(), 0).getDate();
      endMonth =''+(startDates.getMonth());
      endYear = endYear
    }
    else if (value == 'LAST THREE MONTHS') {
      startDate = '1';
      startMonth =  ''+(new Date().getMonth()-1);
      startYear = endYear;
      endOldMonth = new Date().getMonth() - 3;
      endMonths = new Date();
      endMonths.setMonth(endOldMonth);
      endDate = '' + endMonths.getDate();
      endMonth =''+(new Date().getMonth()+1);
      endYear = '' + endMonths.getFullYear();
    }

    if (parseInt(startMonth) < 10) {
      startMonth = '0' + startMonth;
    }
    if (parseInt(startDate) < 10) {
      startDate = '0' + startDate;
    }
    if (parseInt(endMonth) < 10) {
      endMonth = '0' + endMonth;
    }
    if (parseInt(endDate) < 10) {
      endDate = '0' + endDate;
    }
    return { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate };
  }
}