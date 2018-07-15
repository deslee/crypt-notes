import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { EntryService } from './entry.service';

@NgModule({
    declarations: [

    ],
    imports: [
        HttpModule
    ],
    providers: [
        EntryService
    ]
})
export class SharedModule { }
