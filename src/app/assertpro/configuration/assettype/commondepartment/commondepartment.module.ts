import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonanDepartmentComponent } from './commondepartment.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { CommonSearchPipeModule } from 'src/app/share/pipe/commonsearchpipe.module';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        CommonSearchPipeModule
    ],
    declarations: [
        CommonanDepartmentComponent
    ],

    providers: [],
    exports: [CommonanDepartmentComponent],
    entryComponents: [],
})
export class CommonanDepartmentModule {
}

