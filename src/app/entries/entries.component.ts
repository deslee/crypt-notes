import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';
import { Loader, LoaderState } from '../shared/loader.model';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  entries: Loader<Entry[], string>;

  constructor(private entryServie: EntryService) {}

  ngOnInit() {
    this.entries = new Loader<Entry[], string>();
    this.entryServie.getEntries()
    .subscribe(
      (entries) => {
        console.log('entries', entries);
        this.entries = entries;
      },
      err => {
        console.log('error', err);
      },
      () => {
        console.log('completed');
      }
    );
  }

  delete(entry: Entry) {
    this.entryServie.deleteEntry(entry.id);
  }

  get entriesLoaded(): boolean {
    return this.entries.state === LoaderState.LOADED;
  }

  get entriesLoading(): boolean {
    return this.entries.state === LoaderState.LOADING;
  }

  get entriesError(): boolean {
    return this.entries.state === LoaderState.ERROR;
  }
}
