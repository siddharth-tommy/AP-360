import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatIconModule, MatCardModule, MatListModule, MatDatepickerModule, MatDialogModule, MatButtonModule, MatTooltipModule, MatSlideToggleModule, MatSelectModule, MatStepperModule, MatRadioModule, MatButtonToggleModule } from '@angular/material';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
import { MatTableModule } from "@angular/material/table";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BsDropdownModule } from "ngx-bootstrap";
import { ConfigurationComponent } from './configuration.component';
import { DebugComponent } from './debug/debug.component';
import { ComserverComponent } from './comserver/comserver.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsidebarComponent } from './checklist/checklistsidebar/checklistsidebar.component';
import { AssettypeComponent } from './assettype/assettype.component';
import { CollapseModule } from "ngx-bootstrap";
import { CommonCommandModule } from './assettype/commoncommand/commoncommand.module';
import { CommonassetModule } from './assettype/commonasset/commonasset.module';
import { CommonanDepartmentModule } from './assettype/commondepartment/commondepartment.module';
import { SinglesiteModule } from '../reports/components/singlesite/singlesite.module';
import { CommonSiteModule } from './assettype/commonsite/commonsite.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConfirmationDailogModule } from '../common/commondailog/confirmation.module';
const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent,
    }
];

@NgModule({
    imports: [
        CollapseModule,
        //FixedMenuBarModule,
        //FixedSideBarModule,
        OwlDateTimeModule, OwlNativeDateTimeModule,
        RouterModule.forChild(routes),
        CommonCommandModule,
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
        MatStepperModule,
        MatRadioModule,
        DragDropModule,
        MatButtonToggleModule,CommonassetModule,CommonanDepartmentModule,SinglesiteModule,CommonSiteModule,
        ConfirmationDailogModule
    ],
    declarations: [
      ConfigurationComponent,DebugComponent,ComserverComponent,ChecklistComponent,
      ChecklistsidebarComponent,AssettypeComponent
    ],

    providers: [],
    exports: [],
    entryComponents: [],
})

export class ConfigurationModule { }