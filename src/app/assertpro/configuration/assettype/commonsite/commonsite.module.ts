import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonaSiteComponent } from './commonsite.component';
import { SubsearchPipeModule } from 'src/app/share/pipe/subsearchpipe.module';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SubsearchPipeModule
    ],
    declarations: [
        CommonaSiteComponent
    ],

    providers: [],
    exports: [CommonaSiteComponent],
    entryComponents: [],
})
export class CommonSiteModule {
}

