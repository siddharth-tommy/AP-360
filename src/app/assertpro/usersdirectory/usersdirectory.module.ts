import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatIconModule, MatTooltipModule, MatDialogModule, MatDatepickerModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
import { MatTableModule } from "@angular/material/table";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { UsersdirectoryComponent, UserDirectoryPerformerModel, TroubleMakerModel, UserDirectoryAvailableactionDialog } from './usersdirectory.component';
import { AccesslevelComponent } from './accesslevel/accesslevel.component';
import { AddOperatorComponent } from './addoperator/addoperator.component';
import { WebUserSidebarComponent } from './add-webuser/webusersidebar.component';
import { RoleFunctionComponent } from './rolefunction/rolefunction.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { EditOperatorModule } from './editoperatorname/editoperatorname.module';
import { IncidentBarModule } from '../notification/incidentbar/incidentbar.module';
import { CommonDailogModule } from '../common/commondailog/commondailog.module';

const routes: Routes = [
    {
        path: '',
        component: UsersdirectoryComponent,
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
        MatDialogModule,
        MatDatepickerModule,
        MatSelectModule,
        MatSlideToggleModule,
        BsDropdownModule,EditOperatorModule,IncidentBarModule,CommonDailogModule
    ],
    declarations: [
        UsersdirectoryComponent, UserDirectoryPerformerModel, TroubleMakerModel,UserDirectoryAvailableactionDialog,
        AccesslevelComponent,AddOperatorComponent,WebUserSidebarComponent,
        RoleFunctionComponent
    ],

    providers: [],
    exports: [],
    entryComponents: [ UserDirectoryPerformerModel, TroubleMakerModel,UserDirectoryAvailableactionDialog],
})
export class UsersDirectoryModule {
}

