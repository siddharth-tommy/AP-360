import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatIconModule, MatTooltipModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatButtonModule } from '@angular/material';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
import { MatTableModule } from "@angular/material/table";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { DashboardComponent,  MostProductivityModel, MostAccidentModel, MostAlarmsModel, MostStateOrAverageModel, MostHottestModel, MostAlarmOrChargesModel} from './dashboard.component';
import { MapViewDailog } from './mapview/mapview.component';
import { BsDropdownModule } from "ngx-bootstrap";
import { ConfirmationDailogModule } from '../common/commondailog/confirmation.module';
import { PersonInchargepopupComponent } from './personIncharge.component ';
import { Equipmenttable } from './equipmenttable.component';
import { Batterytable } from './batterytable.component';
import { Chargertable } from './chargertable.component';
const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    }
];

@NgModule({
    imports: [
      //  FixedMenuBarModule,
      //  FixedSideBarModule,
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
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        BsDropdownModule,
        MatButtonModule,
        ConfirmationDailogModule
    ],
    declarations: [
        DashboardComponent,Equipmenttable,MostProductivityModel,MostAccidentModel,
        MostAccidentModel,MostAlarmsModel,MostStateOrAverageModel,MostHottestModel,MostAlarmOrChargesModel,
        Batterytable,MapViewDailog,PersonInchargepopupComponent,Chargertable
    ],

    providers: [],
    exports: [],
    entryComponents: [Equipmenttable,MostProductivityModel,MostAccidentModel,
        MostAccidentModel,MostAlarmsModel,MostStateOrAverageModel,MostHottestModel,MostAlarmOrChargesModel,
        Batterytable,PersonInchargepopupComponent,Chargertable
    ],
})
export class DashboardModule {
}

