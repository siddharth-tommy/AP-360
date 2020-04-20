import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'CommonDailog',
    template: `<h1 mat-dialog-title>Confirmation! </h1>
              <div mat-dialog-content>
                <p>{{data.name}}</p>
              </div>
              <div mat-dialog-actions  align="end">
                <button mat-button (click)="onYesClick()" cdkFocusInitial>Yes</button>
                <button mat-button (click)="onNoClick()">No</button>
              </div>`,
  })
export class CommonDailog {
    constructor(public dialogRef: MatDialogRef<CommonDailog>, @Inject(MAT_DIALOG_DATA) public data: any) {}
    
    onYesClick(): void {
      this.dialogRef.close('Yes');
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
  }