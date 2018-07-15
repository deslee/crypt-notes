import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EntryService } from './shared/entry.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private entryServie: EntryService) {}

  @ViewChild('passwordInput') passwordInput: ElementRef<HTMLInputElement>;

  ngOnInit() {
  }

  get isUnlocked() {
    return this.entryServie.isUnlocked();
  }

  lock() {
    this.entryServie.lock();
  }

  unlock() {
    const password = this.passwordInput.nativeElement.value;
    this.entryServie.unlock(password);
    this.passwordInput.nativeElement.value = '';
  }

}
