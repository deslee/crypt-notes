import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  @Input('obj') obj: any;
  constructor() { }

  ngOnInit() {
  }

  get debugText() {
    return JSON.stringify(this.obj, null, 2);
  }
}
