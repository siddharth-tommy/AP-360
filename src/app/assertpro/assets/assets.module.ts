import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatIconModule, MatTooltipModule, MatFormFieldModule, MatButtonModule, MatDialogModule, MatRadioModule, MatInputModule } from '@angular/material';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
import { MatTableModule } from "@angular/material/table";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { AssetsComponent, DialogDataExampleDialog, SubPopupDialog } from './assets.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BatteriesComponent, SubPopupBatteriesDialog } from './batteries/batteries.component';
import { BatteriesSidebarComponent } from './batteries/batteries-sidebar/batteries-sidebar.component';
import { ChargesComponent, SubPopupChargesDialog } from './charges/charges.component';
import { ChargesSidebarComponent } from './charges/charges-sidebar/charges-sidebar.component';
import { MailComponent } from './mail/mail.component';
import { HeadComponent } from './head/head.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ConfirmationDailogModule } from '../common/commondailog/confirmation.module';
import { FilterbydepartmentComponent } from 'src/app/batteries/filterbydepartment/filterbydepartment.component';
import { CommonSearchPipeModule } from 'src/app/share/pipe/commonsearchpipe.module';
import { CommonanDepartmentModule } from '../configuration/assettype/commondepartment/commondepartment.module';
const routes: Routes = [
    {
        path: '',
        component: AssetsComponent,
    }
];

@NgModule({
    imports: [
        //FixedMenuBarModule,
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
        MatTooltipModule,
        BsDropdownModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDialogModule,
        MatRadioModule,
        MatInputModule,
        ConfirmationDailogModule,
        CommonSearchPipeModule,
        CommonanDepartmentModule
    ],
    declarations: [
        AssetsComponent,SidebarComponent,BatteriesComponent,BatteriesSidebarComponent,ChargesComponent,ChargesSidebarComponent,
        MailComponent,DialogDataExampleDialog, SubPopupDialog,SubPopupBatteriesDialog,SubPopupChargesDialog,HeadComponent,FilterbydepartmentComponent],

    providers: [],
    exports: [],
    entryComponents: [MailComponent,DialogDataExampleDialog, SubPopupDialog,SubPopupBatteriesDialog,SubPopupChargesDialog,FilterbydepartmentComponent],
})
export class AssetsModule {
}

