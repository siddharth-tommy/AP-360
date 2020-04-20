import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';
import { FixedmenubarComponent, ImpactAlarm } from './fixedmenubar.component';
import { MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { CollapseModule } from "ngx-bootstrap"
@NgModule({
    imports: [
        RouterModule.forChild([]),
        NgxSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule.forRoot(),
        MatProgressSpinnerModule,
        CollapseModule,
        MatDialogModule
    ],
    declarations: [FixedmenubarComponent,ImpactAlarm],
    providers: [
    ],
    exports: [FixedmenubarComponent,ImpactAlarm],
    entryComponents: [
    ],
    
})
export class FixedMenuBarModule {
}

