import { NgModule } from '@angular/core';
import { CommonSearchPipe } from './commonsearch.pipe';

@NgModule({
  imports: [],
  declarations: [CommonSearchPipe],
  providers: [CommonSearchPipe],
  exports: [CommonSearchPipe],
  entryComponents: []

})
export class CommonSearchPipeModule { }

