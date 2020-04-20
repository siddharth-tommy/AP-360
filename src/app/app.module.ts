import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { AssertproModule } from './assertpro/assertpro.module';
import { ShareModule } from './share/share.module';
import { HttpModule } from '@angular/http';
import { NgIdleModule } from '@ng-idle/core';
// import { FilterbydepartmentComponent } from './batteries/filterbydepartment/filterbydepartment.component';
//import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AssertproModule,
    CoreModule,
    routing,
    RouterModule,
    ShareModule,
    NgIdleModule.forRoot(),
    HttpModule
  ],
 // providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent] 
})
export class AppModule { }
