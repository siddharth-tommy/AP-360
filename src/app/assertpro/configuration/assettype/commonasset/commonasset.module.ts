import { NgModule } from '@angular/core';
import { RouterModule, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonassetComponent } from './commonasset.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { SearchPipeModule } from 'src/app/share/pipe/searchpipe.module';
import { SubsearchPipeModule } from 'src/app/share/pipe/subsearchpipe.module';
import { CollapseModule } from 'ngx-bootstrap';
@NgModule({
    imports: [
        RouterModule.forChild([]),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        SearchPipeModule,
        SubsearchPipeModule,
        CollapseModule
    ],
    declarations: [
        CommonassetComponent
    ],

    providers: [],
    exports: [CommonassetComponent],
    entryComponents: [],
})
export class CommonassetModule {
}

