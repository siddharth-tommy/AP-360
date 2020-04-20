import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagingComponent } from './messaging.component';
import { MessagebarComponent } from './messagebar/messagebar.component';
import { FilterbarComponent } from './filterbar/filterbar.component';
import { MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatIconModule } from '@angular/material';
//import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';
import { MatTableModule } from "@angular/material/table";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FixedSideBarModule } from 'src/app/share/components/fixedsidebar/fixedsidebar.module';
import { CommonSearchPipeModule } from 'src/app/share/pipe/commonsearchpipe.module';
import { ConfirmationDailogModule } from '../common/commondailog/confirmation.module';

const routes: Routes = [
    {
        path: '',
        component: MessagingComponent,
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
        CommonSearchPipeModule,ConfirmationDailogModule
    ],
    declarations: [
        MessagingComponent, MessagebarComponent, FilterbarComponent
    ],

    providers: [],
    exports: [],
    entryComponents: [],
})
export class MessageModule {
}

