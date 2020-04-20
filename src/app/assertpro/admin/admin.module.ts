import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatIconModule, MatCardModule, MatListModule, MatDatepickerModule, MatDialogModule, MatButtonModule, MatTooltipModule, MatSlideToggleModule, MatSelectModule } from '@angular/material';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
import { MatTableModule } from "@angular/material/table";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { AdminComponent } from './admin.component';
import { CreateCompanyComponent } from './company/createcompany/createcompany.component';
import { CreateSiteComponent } from './company/createsite/createsite.component';
import { StockComponent, ExportTemplate } from './stockpage/stock.component';
import { StockImportComponent } from './stockpage/stockimport/stockimport.component';
import { AssignstockComponent } from './stockpage/assignstock/assignstock.component';
import { VendorsComponent } from './vendors/vendors.component';
import { AddVendorComponent } from './vendors/addvendor.component';
import { CompanyComponent } from './company/company.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BsDropdownModule } from "ngx-bootstrap";
import { ConfirmationDailogModule } from '../common/commondailog/confirmation.module';
const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
    }
];

@NgModule({
    imports: [
       // FixedMenuBarModule,
        //FixedSideBarModule,
        OwlDateTimeModule, OwlNativeDateTimeModule,
        RouterModule.forChild(routes),
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
        MatCardModule,
        MatListModule,
        MatDatepickerModule,
        MatDialogModule,
        MatButtonModule,
        MatTooltipModule,
        MatSlideToggleModule,
        NgbModule,
        BsDropdownModule,
        MatSelectModule,
        ConfirmationDailogModule
    ],
    declarations: [
        AdminComponent, CompanyComponent, CreateCompanyComponent, CreateSiteComponent, StockComponent, StockImportComponent,
        AssignstockComponent, VendorsComponent, AddVendorComponent, ExportTemplate
    ],

    providers: [],
    exports: [],
    entryComponents: [StockImportComponent, AssignstockComponent, ExportTemplate],
})
export class AdminModule {
}

