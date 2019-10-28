import { Component, OnInit } from '@angular/core';
import { SpeechService } from '@app/speech/services/speech.service';
import { Observable } from 'rxjs';
import { Speech } from '@app/models/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-speech-page',
  templateUrl: './speech-page.component.html',
  styleUrls: ['./speech-page.component.scss'],
})
export class SpeechPageComponent implements OnInit {
  speech$: Observable<Speech>;

  constructor(
    private speechService: SpeechService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.speech$ = this.speechService.getSpeech(id);
  }
}
