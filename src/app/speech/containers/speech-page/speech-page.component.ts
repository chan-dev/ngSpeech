import { Component, OnInit } from '@angular/core';
import { SpeechService } from '@app/speech/services/speech.service';
import { Observable } from 'rxjs';
import { Speech, Tag } from '@app/models/api';
import { ActivatedRoute } from '@angular/router';
import { TagService } from '@app/speech/services/tag.service';

@Component({
  selector: 'app-speech-page',
  templateUrl: './speech-page.component.html',
  styleUrls: ['./speech-page.component.scss'],
})
export class SpeechPageComponent implements OnInit {
  speech$: Observable<Speech>;
  tags$: Observable<Tag[]>;

  constructor(
    private route: ActivatedRoute,
    private speechService: SpeechService,
    private tagService: TagService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.speech$ = this.speechService.getSpeech(id);
    this.tags$ = this.tagService.getSpeechTags(id);
  }
}
