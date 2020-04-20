import { NgModule } from "@angular/core";
import { AssertproComponent } from "./assertpro/assertpro.component";
import { routing } from "./assertpro.routing";
//import { ShareModule } from "../share/share.module";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NumberDirective } from "../directive/numbers-only.directive";
import { AlphanumericDirective } from "../directive/alphanumeric-only.directive";
import { BlockCopyPasteDirective } from "../directive/cutcopypaste.directive";
import { AlphanumericspaceDirective } from "../directive/alphanumericspace.directive";
import { FixedMenuBarModule } from '../share/components/fixedmenubar/fixedmenubar.module';
import { FixedSideBarModule } from '../share/components/fixedsidebar/fixedsidebar.module';
 
@NgModule({
  imports: [
    FixedMenuBarModule,
    FixedSideBarModule,
    routing,
    //ShareModule,
    HttpModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [HttpClientModule],
  exports: [],

  declarations: [
    AssertproComponent,
    NumberDirective,
    AlphanumericDirective,
    BlockCopyPasteDirective,
    AlphanumericspaceDirective,
  ],
  entryComponents: [
  ]
}) 
export class AssertproModule { } 
