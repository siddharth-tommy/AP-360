import { Routes, RouterModule }  from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { CoreComponent } from './core/core.component';


const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    
    children: [     
    // {path: '', component:HomePageModule}, 
    {
      path        : '',
      loadChildren: './homepagelogin/homepagelogin.module#HomePageModule'
     },
  ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);