import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { TrackerComponent } from './tracker.component';
import { LocationComponent } from './components/location/location.component';
import { HistoryComponent } from './components/history/history.component';
import { GeofenceComponent } from './components/geofence/geofence.component';
import { MapComponent } from './components/map/map.component';
import { BsDatepickerModule, TimepickerConfig, ModalBackdropComponent } from "ngx-bootstrap";
import { TimepickerModule } from "ngx-bootstrap";
import { BsDropdownModule } from "ngx-bootstrap";
import { CollapseModule } from "ngx-bootstrap"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SubsearchPipeModule } from 'src/app/share/pipe/subsearchpipe.module';
import { OperatorsearchPipeModule } from 'src/app/share/pipe/operatorsearchpipe.module';
import { SearchPipeModule } from 'src/app/share/pipe/searchpipe.module';
import { GeosearchPipeModule } from 'src/app/share/pipe/geosearchpipe.module';
import { OperatorsPipeModule } from 'src/app/share/pipe/operatorspipe.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatIconModule } from '@angular/material';
const routes: Routes = [
    {
        path: '',
        component: TrackerComponent,
    }
];

@NgModule({
    imports: [
        //FixedMenuBarModule,
        //FixedSideBarModule,
        BsDatepickerModule,
        BsDropdownModule,
        CollapseModule,
        ModalModule.forRoot(),
        NgbModule,
        DragDropModule,
        RouterModule.forChild(routes),
        TimepickerModule.forRoot(),
        NgxSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,SubsearchPipeModule,SearchPipeModule,OperatorsearchPipeModule,GeosearchPipeModule,
        OperatorsPipeModule,
        MatIconModule
    ],
    declarations: [
        TrackerComponent, LocationComponent, HistoryComponent,GeofenceComponent,MapComponent,
    ],

    providers: [TimepickerConfig ],
    exports: [],
    entryComponents: [ModalBackdropComponent],
})
export class TrackerModule {
}

