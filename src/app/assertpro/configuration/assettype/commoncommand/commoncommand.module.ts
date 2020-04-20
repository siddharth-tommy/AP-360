import { NgModule } from '@angular/core';
import { RouterModule, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonCommand } from './commoncommand.component';
import { SearchPipeModule } from 'src/app/share/pipe/searchpipe.module';
import { SubsearchPipeModule } from 'src/app/share/pipe/subsearchpipe.module';
import { CollapseModule } from 'ngx-bootstrap';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SearchPipeModule,SubsearchPipeModule,
        CollapseModule
    ],
    declarations: [
        CommonCommand
    ],

    providers: [],
    exports: [CommonCommand],
    entryComponents: [],
})
export class CommonCommandModule {
}

