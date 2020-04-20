import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from './notification.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { AdddeliveryComponent } from './add-delivery/adddelivery.component';
import { MatTooltipModule, MatDatepickerModule, MatProgressSpinnerModule, MatCheckboxModule, MatTabsModule, MatFormField, MatFormFieldModule, MatSlideToggleModule, MatChipsModule, MatIconModule, MatSelectModule, MatNativeDateModule, MatInputModule } from '@angular/material';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { EditOperatorModule } from '../usersdirectory/editoperatorname/editoperatorname.module';
import { CommonSearchPipeModule } from 'src/app/share/pipe/commonsearchpipe.module';
import { AllSearchPipeModule } from 'src/app/share/pipe/allsearchpipe.module';
import { IncidentBarModule } from './incidentbar/incidentbar.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ConfirmationDailogModule } from '../common/commondailog/confirmation.module';

const routes: Routes = [
    {
        path: '',
        component: NotificationComponent,
    }
];
@NgModule({
    imports: [
       // FixedMenuBarModule,
       // FixedSideBarModule,
        IncidentBarModule,
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatTabsModule,
        MatFormFieldModule,MatSlideToggleModule,
        MatChipsModule,MatIconModule,EditOperatorModule,CommonSearchPipeModule,
        AllSearchPipeModule,MatNativeDateModule,MatInputModule,BsDropdownModule,
        ConfirmationDailogModule
    ],
    declarations: [
        NotificationComponent, DeliveryComponent, DeliveryComponent, AdddeliveryComponent,
    ],

    providers: [],
    exports: [],
    entryComponents: [],
})
export class NotificationModule {
}

