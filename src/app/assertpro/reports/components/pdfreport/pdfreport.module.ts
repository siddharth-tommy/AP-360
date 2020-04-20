import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfreportComponent } from './pdfreport.component';
import { ChartModule } from '../chart/chart.module';
const routes: Routes = [
    {
        path: '',
        component: PdfreportComponent,
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ChartModule
    ],
    declarations: [PdfreportComponent],
    providers: [
    ],
    exports: [PdfreportComponent],
    entryComponents: [
    ],
    
})
export class PdfReportModule {
}

