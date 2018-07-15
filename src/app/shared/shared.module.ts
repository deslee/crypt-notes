import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { EntryService } from './entry.service';
import { DebugComponent } from './debug/debug.component';

@NgModule({
    declarations: [
        DebugComponent
    ],
    imports: [
        HttpModule
    ],
    providers: [
        EntryService
    ],
    exports: [
        DebugComponent
    ]
})
export class SharedModule { }
