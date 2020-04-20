import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { MatSort, MatPaginator, MatTableDataSource, getMatIconFailedToSanitizeUrlError } from '@angular/material';
import { Subscription } from 'rxjs';


@Component({
  selector: 'header-component',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['GatewayName', 'GatewayAcgName', 'LastOnline', 'NumberOfClients', 'SerialNo'];
  displayedColumns2: string[] = ['AssetName', 'UnitName'];

  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private toastr: ToastrService, private assetprohelperService: AssetprohelperService, ) {
    //this.dataSource.data = ELEMENT_DATA;
    this.dataSource.data = []
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource2.sort = this.sort2;
    this.dataSource2.paginator = this.paginator2;
  }
  siteId;
  refreshtime = new Date();
  ngOnInit() {
    this.serviceSubscription = this.assetprohelperService.SiteAction$.subscribe(() => {
      if (localStorage.getItem('selectitemId') != null && localStorage.getItem('selectitemId') != 'null') {
        this.siteId = localStorage.getItem('selectitemId');
        this.loadTable();
        this.overAllFunction()
      } else {
        this.siteId = '';
      }
    })
  }
  tableDatas = []
  loader: boolean = false;
  loadTable() {
    this.loader = true;
    this.subTable = []
    this.dataSource = new MatTableDataSource<any>();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource2.data = []
    this.dataSource2.sort = this.sort;
    this.dataSource2.paginator = this.paginator;
    this.assetprohelperService.PostMethod('Asset/GetGatewayTableBySiteID', {
      "SiteID": this.siteId,
    }).subscribe(response => {
			try {
				this.loader = false;
			  let body = response.json();
			  if (body.Status) {
          this.tableDatas = body.Data;
          this.tableDatas.forEach(a => {
            a.editMode = true;
          })
          if(body.Data.length==0){
            this.dataSource.data =[]
          } else{
            this.dataSource.data = this.tableDatas;
          }         
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.refreshtime = new Date();
			  }
			  else {
				this.toastr.warning(body.Message, "Warning")
			  }
			}
			catch (apierror) {
			  console.log(apierror)
			}
  
   
    });
  }
  private serviceSubscription: Subscription;
  ngOnDestroy() {
    // empty
    this.serviceSubscription.unsubscribe();
  }
  subTable = []
  rowSelected(value) {
    // if(value.checked)
    //{ 
    //let data = [{ position: 1, GatewayName: 'PB775', ACGnumber: '', serial: '2932-ED14-6F7D', clients: '8612FE68', lasttimeonline: '27 days ago 01/16/2019 15:53' }
    // , { position: 1, GatewayName: 'BT2240', ACGnumber: '', serial: '2932-ED14-6F7D', clients: '8612F38A', lasttimeonline: '27 days ago 01/16/2019 15:53' }]
    //this.dataSource2.data = data
    // }
    // else{
    this.dataSource2.data = [];
    // }
    this.assetprohelperService.PostMethod('Asset/GetGatewayTableDetailsByID', {
      "ID": value.ID,
    }).subscribe(data => {
      
      let body: any = JSON.parse(data['_body']);
      this.subTable = body.Data;
      this.dataSource2.data = this.subTable
      this.dataSource2.sort = this.sort2;
      this.dataSource2.paginator = this.paginator2;
    });
    this.dataSource2.sort = this.sort2;
    this.dataSource2.paginator = this.paginator2;
  }
  filters: any = []
  tableFilter: string = '';
  filters2: any = []
  tableFilter2: string = '';
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }
  disableOtherEditOption(result, value) {
    let index = this.dataSource.data.indexOf(value);
    if (index >= 0) {
      //  this.dataSource.data[index].editMode = false;
      this.dataSource.data.forEach((a, b) => {
        if (b != index) {
          a.editMode = true;
        }
      });
    }
  }
  updateAcgNo(dumy, data) {
    this.loader = true;
    
    let parent=this;
    this.assetprohelperService.PostMethod('Asset/UpdateGatewayACGUsingID', { "ID": data.ID, AGC: data.GatewayAcgName })
      .subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        if (body.Status) {
          parent.toastr.success(body.Message, 'Success!')
        }
        else {
          parent.toastr.warning(body.Message, "Warning");
        }
        this.loadTable()
      });
  }
  overAllList:any = []
  overAllFunction() {
    this.loader = true;
    try {
      let { startDates, endDates, startYear, startMonth, startDate, endYear, endMonth, endDate } = this.newFunction('WEEK');

      this.assetprohelperService.PostMethod('Asset/GetAssetGatewayCommunication', {
        "SiteID": this.siteId,
        "StartDate": startYear + '-' + startMonth + '-' + startDate,
        "EndDate": endYear + '-' + endMonth + '-' + endDate
      }).subscribe(data => {
        this.loader = false;
        let body: any = JSON.parse(data['_body']);
        this.overAllList = body.Data[0];
      });
    } catch (exception) {
      console.log(exception);
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

export interface PeriodicElement {
  GatewayName: string;
  position: number;
  ACGnumber: string;
  serial: string;
  clients: number;
  lasttimeonline: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, GatewayName: 'Gateway # 6F7D', ACGnumber: '', serial: '2932-ED14-6F7D', clients: 0, lasttimeonline: '27 days 10 hours ago 01/16/2019 15:53' },
  { position: 2, GatewayName: 'Gateway # 5224', ACGnumber: '', serial: '2932-ED14-6F7D', clients: 42, lasttimeonline: '15 days 20 hours ago 01/16/2019 15:53' },
  { position: 2, GatewayName: 'Gateway # D251', ACGnumber: '', serial: '2932-ED14-6F7D', clients: 30, lasttimeonline: '26 days 18 hours ago 01/16/2019 15:53' },
  { position: 2, GatewayName: 'Gateway # C342', ACGnumber: '', serial: '2932-ED14-6F7D', clients: 11, lasttimeonline: '26 days 18 hours ago 01/16/2019 15:53' },
  { position: 2, GatewayName: 'Gateway # A582', ACGnumber: '', serial: '2932-ED14-6F7D', clients: 5, lasttimeonline: '6 days 39 hours ago 01/16/2019 15:53' },
  { position: 2, GatewayName: 'Gateway # 05SS', ACGnumber: '', serial: '2932-ED14-6F7D', clients: 2, lasttimeonline: '12 days 19 hours ago 01/16/2019 15:53' },
  { position: 2, GatewayName: 'Gateway # 35SS', ACGnumber: '', serial: '2932-ED14-6F7D', clients: 2, lasttimeonline: '12 days 19 hours ago 01/16/2019 15:53' },
  { position: 2, GatewayName: 'Gateway # 63SS', ACGnumber: '', serial: '2932-ED14-6F7D', clients: 2, lasttimeonline: '12 days 19 hours ago 01/16/2019 15:53' },

];

const ELEMENT_DATA2: PeriodicElement[] = [
  //{position: 1, GatewayName : 'Gateway # 6F7D' , ACGnumber: '' , serial: '2932-ED14-6F7D', clients: 0,lasttimeonline:'27 days ago 01/16/2019 15:53'},

];