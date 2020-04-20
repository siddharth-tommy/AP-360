import { NgModule } from '@angular/core';
import { RouterModule, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipeModule } from 'src/app/share/pipe/searchpipe.module';
import { SubsearchPipeModule } from 'src/app/share/pipe/subsearchpipe.module';
import { CollapseModule } from 'ngx-bootstrap';
import { SinglesiteComponent } from './singlesite.component';
import { CommonSearchPipeModule } from 'src/app/share/pipe/commonsearchpipe.module';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SearchPipeModule,
        SubsearchPipeModule,
        CollapseModule,
        CommonSearchPipeModule
    ],
    declarations: [
        SinglesiteComponent
    ],

    providers: [],
    exports: [SinglesiteComponent],
    entryComponents: [],
})
export class SinglesiteModule {
}

