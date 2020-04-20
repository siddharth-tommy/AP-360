import { SinglesiteComponent } from './../../../reports/components/singlesite/singlesite.component';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDailog } from 'src/app/assertpro/usersdirectory/usersdirectory.component';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { QuestionsList } from './cheklistquestion';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'checklistsidebarcomponent',
  templateUrl: './checklistsidebar.component.html',
  styleUrls: ['./checklistsidebar.component.css']
})
export class ChecklistsidebarComponent implements OnInit {
  model: any = []
  checklistArray = [
    // {name:'a'},{name:'b'},{name:'c'},{name:'D'},
  ]
  @ViewChild('side') side: ElementRef;
  type
  setasDefault_TogglerButton=false

  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('singlesitecomponent') singlesitecomponent: SinglesiteComponent
  sitesList: any;
  tableValue: any;
  ChecklistsidebarComponent: any;
  nativeElement: any;
  selectdropdownitem: string;
  stepper: any;
  selectedTab: any;
  sentDepartmentList: any;
  commondepartment: any;
  commonasset: any;
  lang_English: boolean;
  lang_Espanol: boolean;
  editShow: boolean=false;
  enabled: any;
  chacklistName = ''
  messageBox = ''
  three: boolean = false;
  four: boolean = false;
  four_a: boolean = false;
  five_a: boolean;
  three_b: boolean;
  four_b: boolean;
  thirdQuestion: boolean = false;
  three_a: boolean = false;
  question_one: string;
  answerOne: string;
  answerTwo: string;
  question_two: string;
  q_two_answerOne: string;
  q_two_answerTwo: string;
  answerThree: string;
  answerFour: string;
  q_two_answerThree: string;
  q_two_answerFour: string;
  question_Three: string;
  q_three_answerOne: string;
  q_three_answerTwo: string;
  q_three_answerThree: string;
  q_three_answerFour: string;
  tabIndex = 0;
  Questions: any = [];
  sidebarActive(info) {

  }

  constructor(public toastr: ToastrService, public assetprohelperService: AssetprohelperService,
    public dialog: MatDialog) {
  }
  displayedColumns: string[] = ['select', 'Name', 'Language', 'TotalQuestions',
    'Description', 'Plan', 'AssetTypeName'];
  ngOnInit() {
    this.lang_English = true;
    this.lang_Espanol = false;
    this.three = false;
    this.four = false;
    this.thirdQuestion = false;
    // this.model.push(new QuestionList());
  }
  onEdit_view: boolean;
  siteName: string;
  siteId: string;
  loader: boolean = false;
  espanollanguageButton: boolean;
  englishlanguageButton: boolean;
  radioOptions: any;
  private serviceSubscription: Subscription;
  // ngOnDestroy() {
  //   this.serviceSubscription.unsubscribe();
  // }
  checklist = []
  createChecklist() {
    this.ChecklistsidebarComponent.createChecklist()
  }
  editMode = false;
  checklistid=null
  checklistdetails;
  opensideBar(checklistEnabled, checklist) {
    this.tabIndex = 0
    this.checklistid=null
    this.thirdQuestion = false;
    this.three_b = false;
    this.four_b = false
    this.clear()
    this.editMode = this.editShow = checklistEnabled
    this.side.nativeElement.style.width = "100%";
    this.myDiv.nativeElement.style.paddingLeft="4.17%";
    if (screen.availWidth >= 1920) {
      this.myDiv.nativeElement.style.width = "54%";
    }
    else if (screen.availWidth <= 576) {
      this.myDiv.nativeElement.style.width = "96%";
    } else if (screen.availWidth <= 768) {
      this.myDiv.nativeElement.style.width = '90%'
    }
    else if (screen.availWidth <= 992) {
      this.myDiv.nativeElement.style.width = '80%'
    }
    else if (screen.availWidth <= 1200) {
      this.myDiv.nativeElement.style.width = '66%'
    } else {
      this.myDiv.nativeElement.style.width = '54%'
    }
    this.checklistdetails=checklist
    this.selectdropdownitem = localStorage.getItem('sitename')
    this.loadEditDetails();
    document.body.style.overflowY="hidden";
  }
loadEditDetails(){
  if (this.editMode) {
    this.checklistid=this.checklistdetails.ID
    this.chacklistName = this.checklistdetails.Name
    this.messageBox = this.checklistdetails.Description;
    if (this.checklistdetails.System == 1) {
      this.radioOptions = "1";
    } else {
      this.radioOptions = "2";
    }
    this.loadQuestions(this.checklistdetails.ID);
    this.loadSites(this.checklistdetails.ID);
  }
}
  checklistInfoapi() {
    let Questions = [];
    this.model.forEach((i, index) => {
      if(i.Name.trim()!='')
      Questions.push({
        "Name": i.Name,
        "NameBi": null,
        "Answer1": i.Answer1,
        "Answer2": i.Answer2,
        "Answer3": i.Answer3,
        "Answer4": i.Answer4,
        "Answer1Bi": null,
        "Answer2Bi": null,
        "Answer3Bi": null,
        "Answer4Bi": null,
        "ExpAnswer": i.ExpAnswer,
        "SequenceNumber": index + 1,
        "QuestionID":i.ID,
        "Action":i.Action,
        "MiniCheckList":i.MiniCheckList
      })
    });
    let siteId = this.singlesitecomponent.bubbles.map(a=>{return a.id})

    this.loader = true
    this.assetprohelperService.PostMethod("Configuration/CreateCheckListInfo", {
      ID:this.checklistid,
      Name: this.chacklistName,
      System: this.radioOptions,
      Bilingual: this.lang_English==true?"N":"Y",
      Description: this.messageBox,
      Sense: null,
      IsProfile: this.setasDefault_TogglerButton,
      Questions: Questions,
      SiteIDs:siteId
    }).subscribe(response => {
      this.loader = false;
      try {
        let body = response.json();
        this.loader = false;
        if (body.Status) {
          this.toastr.success(body.Message, "Success!")
          this.saveEmit.emit(true)
          this.closeSidebar();
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (error) {
        console.log(error)
      }
    }, error => {
      this.loader = false
    })
  }
  @Output() saveEmit = new EventEmitter();
  clear() {
    this.chacklistName = ''
    this.messageBox = ''
    this.singlesitecomponent.bubbles = [];
    this.radioOptions = '';
    this.model = []
    this.model.push(new QuestionsList())
    this.model.push(new QuestionsList())
  }
  goBack() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: "Are you sure want to to back ?" },
      
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.closeSidebar();
      }
    });
  }
  closeSidebar() {
    this.side.nativeElement.style.width = "0";
    this.myDiv.nativeElement.style.width = "0";
    document.body.style.overflowY="auto";
    this.myDiv.nativeElement.style.paddingLeft="0";
  }
  resetEdit() {
    this.tabIndex = 0
    this.chacklistName = '';
    this.radioOptions = '';
    this.messageBox = '';
    this.setasDefault_TogglerButton = false;
    this.model=[]
    this.model.push(new QuestionsList())
    this.model.push(new QuestionsList())
    this.singlesitecomponent.bubbles = [];
    this.loadEditDetails();
  }
  cancelEdit() {
    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: "Are you sure you want to Cancel?" },
      
    });
    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.closeSidebar();
        this.resetEdit();
      }
    });
  }

  saveEdit() {
    let parent = this;
    if (parent.chacklistName == null || parent.chacklistName == undefined || parent.chacklistName == '' || parent.chacklistName.trim() == '') {
      this.toastr.warning("Checklist Name is Mandatory", "warning")
      return
    }
    if (parent.radioOptions == undefined || parent.radioOptions == '' || parent.radioOptions == 0) {
      this.toastr.warning("Selection of System is Mandatory", "warning")
      return
    }
    if (parent.singlesitecomponent == undefined || parent.singlesitecomponent.bubbles.length == 0) {
      this.toastr.warning("Selection of Site is Mandatory", "warning")
      return
    }

    for (let i = 0; i < this.model.length; i++) {
      if (i == 0 || i == 1) {
        if (this.model[i].Name.trim() == '') {
          this.toastr.warning("Question " + (i + 1) + " is mandatory", "warning")
          return
        }
        if (this.model[i].Answer1.trim() == '') {
          this.toastr.warning("Answer 1 is Mandatory in Question" + (i + 1) + "", "warning")
          return
        }
        if (this.model[i].Answer2.trim() == '') {
          this.toastr.warning("Answer 2 is Mandatory in Question" + (i + 1) + "", "warning")
          return
        }
        if (this.model[i].ExpAnswer == undefined) {
          this.toastr.warning("Answer Selection is Mandatory for Question" + (i + 1) + "", "warning")
          return
        }
        if (this.model[i].Answer3.trim() == '' && this.model[i].ExpAnswer == 3) {
          this.toastr.warning("Answer Selection Should Be Usable for Valid Answers", "warning")
          return
        }
        if (this.model[i].Answer4.trim() == '' && this.model[i].ExpAnswer == 4) {
          this.toastr.warning("Answer Selection Should Be Usable for Valid Answers", "warning")
          return
        }
      }

      else {
        if (this.model[i].Name.trim() != '') {
          if (this.model[i].Answer1.trim() == '') {
            this.toastr.warning("Answer 1 is Mandatory in Question" + (i + 1) + "", "warning")
            return
          }
          if (this.model[i].Answer2.trim() == '') {
            this.toastr.warning("Answer 2 is Mandatory in Question" + (i + 1) + "", "warning")
            return
          }
          if (this.model[i].ExpAnswer == undefined) {
            this.toastr.warning("Answer Selection is Mandatory for Question" + (i + 1) + "", "warning")
            return
          }
          if (this.model[i].Answer3.trim() == '' && this.model[i].ExpAnswer == 3) {
            this.toastr.warning("Answer Selection Should Be Usable for Valid Answers", "warning")
            return
          }    
          if (this.model[i].Answer4.trim() == '' && this.model[i].ExpAnswer == 4) {
            this.toastr.warning("Answer Selection Should Be Usable for Valid Answers", "warning")
            return
          }
        }
      }

    }



    let subdialogRef = this.dialog.open(ConfirmationDailog, {
      data: { name: "Are you sure you want to APPLY ?" },
      
    });

    subdialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {

        this.checklistInfoapi();
        
        // this.editShow = false
      }
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.model, event.previousIndex, event.currentIndex);
  }
  languageButton() {
    this.lang_English = !this.lang_English;
    this.lang_Espanol = !this.lang_Espanol
  }
  addAnswer(i) {
    if (this.model[i].answer3show) {
      this.model[i].answer4show = true;
      return;
    }
    this.model[i].answer3show = true;
  }

  addQuestion() {
    this.model.push(new QuestionsList())
  }
  loadQuestions(id){
    
    this.loader = true
    this.assetprohelperService.PostMethod("Configuration/GetCheckListQuestionsByCheckListID", {
      CheckListID: id
    }).subscribe(response => {
      this.loader = false;
      try {
        let body = response.json();
        this.loader = false;
        if (body.Status) {
          this.model = body.Data
          this.model.forEach(element => {
            element.ExpAnswer+=""
            if(element.Answer1Bi!=null){
              element.Answer1=element.Answer1Bi
            }
            if(element.Answer2Bi!=null){
              element.Answer2=element.Answer2Bi
            }
            if(element.Answer3Bi!=null){
              element.Answer3=element.Answer3Bi
            }
            if(element.Answer4Bi!=null){
              element.Answer4=element.Answer4Bi
            }
            if(element.Answer3!=''){
              element.answer3show=true
            }
            if(element.Answer4!=''){
              element.answer4show=true
            }
            
          });
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (error) {
        console.log(error)
      }
    }, error => {
      this.loader = false
    })
  }
  loadSites(id){
    
    this.loader = true
    this.assetprohelperService.PostMethod("Configuration/GetSitesByCheckListID", {
      CheckListID: id
    }).subscribe(response => {
      this.loader = false;
      try {
        let body = response.json();
        this.loader = false;
        if (body.Status && this.singlesitecomponent!=undefined) {
          let values=body.Data
          values.forEach(row=>{
            this.singlesitecomponent.usersites.forEach(row2=>{
              if(row.SiteID==row2.SiteID){
                this.singlesitecomponent.bubbles.push({
                  id: row2.SiteID,
                  value: row2.Name
                });
              }
            })
          });
     
        }
        else {
          this.toastr.warning(body.Message, "Warning")
        }
      }
      catch (error) {
        console.log(error)
      }
    }, error => {
      this.loader = false
    })
  }
}