import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatDialogModule, MatTableModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { EditoperatorName } from './editoperatorname.component';
import { CertificationComponent } from '../certification/certification.component';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        NgxSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatDatepickerModule,MatSelectModule,MatNativeDateModule,
        MatFormFieldModule,MatInputModule,MatButtonModule,
    ],
    declarations: [EditoperatorName, CertificationComponent],
    providers: [
    ],
    exports: [EditoperatorName],
    entryComponents: [
        CertificationComponent
    ],

})
export class EditOperatorModule {
}

