import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Tag, Speech } from '@app/models/api';
import { SpeechService } from '@app/speech/services/speech.service';
import { TagService } from '@app/speech/services/tag.service';
import { TransactionsService } from '@app/speech/services/transactions.service';
import format from 'date-fns/format';

@Component({
  selector: 'app-speech-edit-page',
  templateUrl: './speech-edit-page.component.html',
  styleUrls: ['./speech-edit-page.component.scss']
})
export class SpeechEditPageComponent implements OnInit, OnDestroy {
  private speechId: string;
  private subscription: Subscription;

  speech$: Observable<Speech>;
  tags$: Observable<Tag[]>;
  speechTags$: Observable<Tag[]>;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tagService: TagService,
    private speechService: SpeechService,
    private transactionsService: TransactionsService,
  ) { }

  ngOnInit() {
    this.speechId = this.route.snapshot.paramMap.get('id');
    this.speech$ = this.speechService.getSpeech(this.speechId);
    this.tags$ = this.tagService.getTags();
    this.speechTags$ = this.tagService.getSpeechTags(this.speechId);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateSpeech(data) {
    const author = {
      email: 'rkidstoun1@indiatimes.com',
      firstName: 'Raoul',
      id: '4EG80XT9AXCO4edZs5o6',
      lastName: 'Kidstoun',
      username: 'raul_dev',
    };

    // TODO: format dates
    const speechData: Speech = {
      title: data.title,
      content: data.content,
      createdAt: format(new Date(), environment.dateFormat),
      updatedAt: format(new Date(), environment.dateFormat),
      author,
    };

    const tags$ = this.tagService.getTags();
    const speechTags$ = this.tagService.getSpeechTagIds(this.speechId);

    this.subscription = forkJoin(tags$, speechTags$)
      .pipe(
        exhaustMap(([allTags, speechTags]) => {
          return this.transactionsService
            .createOrUpdateSpeechAndTags(
              speechData,
              data.tags,
              allTags,
              speechTags,
              this.speechId)
            .then(ref => {
              this.router.navigate(['/speeches/', ref.id]);
            })
            .catch(error => console.error(error));
        })
      )
      .subscribe();
  }

}
