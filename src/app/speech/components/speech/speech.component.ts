import { Component, OnInit, Input } from '@angular/core';
import { Speech } from '@app/models/api';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss']
})
export class SpeechComponent implements OnInit {
  @Input() speech: Speech;
  constructor() { }

  ngOnInit() {
  }

}
