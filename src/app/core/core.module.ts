import { NgModule } from '@angular/core';
import { CoreComponent } from './core/core.component';
import {routing} from './core.routing';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
@NgModule({
  imports: [
    routing,
    RouterModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  declarations: [CoreComponent]
})
export class CoreModule { }
