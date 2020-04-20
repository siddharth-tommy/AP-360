import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatIconModule } from '@angular/material';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
import { MatTableModule } from "@angular/material/table";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { ReportsComponent } from './reports.component';
import { ProductivityReportModule } from './types/productivity/productivityreport.module';
const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
    }
];

@NgModule({
    imports: [
        //FixedMenuBarModule,
        //FixedSideBarModule,
        OwlDateTimeModule, OwlNativeDateTimeModule,
        RouterModule.forChild(routes),
        NgxSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatIconModule,
        ProductivityReportModule
    ],
    declarations: [
        ReportsComponent
    ],

    providers: [],
    exports: [],
    entryComponents: [],
})
export class ReportsModule {
}

