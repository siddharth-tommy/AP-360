import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HompagemapComponent } from './hompagemap.component';
//import { FixedmenubarComponent } from 'src/app/share/components/fixedmenubar/fixedmenubar.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { FixedMenuBarModule } from 'src/app/share/components/fixedmenubar/fixedmenubar.module';

const routes: Routes = [
    {
        path: '',
        component: HompagemapComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FixedMenuBarModule
        //BsDropdownModule.forRoot()
    ],
    declarations: [HompagemapComponent
        //,FixedmenubarComponent
    ],
   
    providers: [
    ],
    exports: [
        //FixedmenubarComponent,
       CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    entryComponents: [
    //    FixedmenubarComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomePageMapModule {
}

