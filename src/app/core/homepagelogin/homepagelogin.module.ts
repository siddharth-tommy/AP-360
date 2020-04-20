import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageloginComponent } from './homepagelogin.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: HomepageloginComponent,
    },
    {
        path      : '**',
        component: HomepageloginComponent
    }
];

@NgModule({
    declarations: [
        HomepageloginComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        NgxSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

    ],
    providers: [
    ]
})
export class HomePageModule {
}

