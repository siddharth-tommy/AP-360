import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssetprohelperService } from '../share/services/assetprohelper.service';
import { UserIdleModule } from 'angular-user-idle';
import { httpFactory } from './services/http.factory';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http'; 
import { UserMenuService } from './services/usermenu.service';
@NgModule({
  imports: [
    RouterModule,
    HttpModule,
    UserIdleModule.forRoot({ idle: 1800, timeout: 10, ping: 20 }),
  ],
  declarations: [],
  providers: [AssetprohelperService,UserMenuService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    }],
  exports: [],
  entryComponents: []

})
export class ShareModule { }

