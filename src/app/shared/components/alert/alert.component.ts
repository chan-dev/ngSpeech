import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() className: string;
  @Input() showAlert: boolean;
  @Input() dismissible: boolean;
  @Output() closeAlert: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  close() {
    this.closeAlert.emit();
  }

  get classes() {
    const cssClasses = {
      alert: true,
      'alert-dismissible': this.dismissible,
    };

    cssClasses[`alert-${this.className}`] = true;
    return cssClasses;
  }
}
