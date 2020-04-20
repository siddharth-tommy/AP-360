import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { CommonDailog } from './commondailog.component';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
    ],
    declarations: [CommonDailog],
    providers: [
    ],
    exports: [],
    entryComponents: [CommonDailog],

})
export class CommonDailogModule {
}

