import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FixedsidebarComponent } from './fixedsidebar.component';


@NgModule({
    imports: [
        RouterModule.forChild([]),        
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [FixedsidebarComponent,
    ],

    providers: [
    ],
    exports: [FixedsidebarComponent],
    entryComponents: [
    ],
})
export class FixedSideBarModule {
}

