import { NgModule } from '@angular/core';
import { RouterModule, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatButtonToggleModule, MatTooltipModule } from '@angular/material';
import { IncidentBarComponent } from './incidentbar.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CommonDailogModule } from '../../common/commondailog/commondailog.module';

@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatButtonToggleModule,
        BsDropdownModule,
        MatTooltipModule,
        OwlDateTimeModule, OwlNativeDateTimeModule,CommonDailogModule
    ],
    declarations: [
        IncidentBarComponent
    ],

    providers: [],
    exports: [IncidentBarComponent],
    entryComponents: [],
})
export class IncidentBarModule {
}

