import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';;
import { ChartComponent } from '../chart/chart.component';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [ChartComponent],
    providers: [
    ],
    exports: [ChartComponent],
    entryComponents: [
    ],
    
})
export class ChartModule {
}

