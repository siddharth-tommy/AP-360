import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { ConfirmationDailog } from '../../usersdirectory/usersdirectory.component';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
    ],
    declarations: [ConfirmationDailog],
    providers: [
    ],
    exports: [],
    entryComponents: [ConfirmationDailog],

})
export class ConfirmationDailogModule {
}

