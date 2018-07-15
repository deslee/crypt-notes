import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { debounceTime } from 'rxjs/operators';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  @Input() entry: Entry;
  @Output() entryChanged = new EventEmitter<Entry>();

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryChanged.asObservable().pipe(
      debounceTime(1000)
    ).subscribe(entry => {
      this.entryService.updateEntry(entry);
    });
  }

  fieldUpdate() {
    console.log(this.entry);
    this.entryChanged.emit(this.entry);
  }

}
