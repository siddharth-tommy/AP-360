import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';
import { MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { CollapseModule } from "ngx-bootstrap"
import { ProductivityreportComponent } from './productivityreport.component';
import { CommonanDepartmentModule } from 'src/app/assertpro/configuration/assettype/commondepartment/commondepartment.module';
import { CommonassetModule } from 'src/app/assertpro/configuration/assettype/commonasset/commonasset.module';
import { SinglesiteModule } from '../../components/singlesite/singlesite.module';
import { CommonSearchPipeModule } from 'src/app/share/pipe/commonsearchpipe.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ChartModule } from '../../components/chart/chart.module';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        NgxSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule.forRoot(),
        MatProgressSpinnerModule,
        CollapseModule,
        MatDialogModule,
        CommonanDepartmentModule,
        CommonassetModule,SinglesiteModule,CommonSearchPipeModule,
        OwlDateTimeModule, OwlNativeDateTimeModule,
        ChartModule,
    ],
    declarations: [ProductivityreportComponent],
    providers: [],
    exports: [ProductivityreportComponent],
    entryComponents: [],
})
export class ProductivityReportModule {
}

