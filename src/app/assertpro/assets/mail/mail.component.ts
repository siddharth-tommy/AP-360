import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-mail',
    templateUrl: './mail.component.html',
    styleUrls: ['./mail.component.css'],
})
export class MailComponent implements OnInit, AfterViewInit {

    constructor(public dialogRef: MatDialogRef<MailComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr:ToastrService) {

    }
    message;
    answer1
    answer2
    selected: string = '';
    onNoClick(): void {
        this.selected = '';
        this.dialogRef.close();
    }
    ngOnInit() {

    }
    ngAfterViewInit() {

    }
    msg = '';
    onSubmit() {
        if (this.message != undefined && this.message != '' && this.answer1!=undefined && this.answer1!='') {
            this.dialogRef.close('Yes');
        } else {
            if (this.message == undefined || this.message == '')
            this.toastr.warning("Message is Empty", "Warning");
           else if (this.answer1 == undefined || this.answer1 == '')
            this.toastr.warning("Answer1 is Empty", "Warning");

            this.msg = 'Please Choose any option'
        }
    }

}