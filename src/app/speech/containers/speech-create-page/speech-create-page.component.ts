import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Speech, Tag } from '@app/models/api';
import { TransactionsService } from '@app/speech/services/transactions.service';
import { TagService } from '@app/speech/services/tag.service';
import format from 'date-fns/format';

@Component({
  selector: 'app-speech-create-page',
  templateUrl: './speech-create-page.component.html',
  styleUrls: ['./speech-create-page.component.scss'],
})
export class SpeechCreatePageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  tags$: Observable<Tag[]>;

  constructor(
    private router: Router,
    private tagService: TagService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit() {
    this.tags$ = this.tagService.getTags();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  saveSpeech(data) {
    // TODO: replace with data of current user
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

    this.tagService.getTags()
      .pipe(
        exhaustMap(allTags => {
          return this.transactionsService
          .createOrUpdateSpeechAndTags(speechData, data.tags, allTags)
          .then(ref => {
            this.router.navigate(['/speeches/', ref.id]);
          })
          .catch(error => console.error(error));
        })
      )
      .subscribe();
  }
}
