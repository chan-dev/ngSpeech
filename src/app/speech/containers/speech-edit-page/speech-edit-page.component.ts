import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { exhaustMap, first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Tag, Speech } from '@app/models/api';
import { SpeechService } from '@app/speech/services/speech.service';
import { AuthService } from '@app/auth/services/auth.service';
import { TagService } from '@app/speech/services/tag.service';
import { TransactionsService } from '@app/speech/services/transactions.service';
import { CanComponentDeactivate } from '@app/auth/can-component-deactivate';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import format from 'date-fns/format';

@Component({
  selector: 'app-speech-edit-page',
  templateUrl: './speech-edit-page.component.html',
  styleUrls: ['./speech-edit-page.component.scss'],
})
export class SpeechEditPageComponent
  implements OnInit, OnDestroy, CanComponentDeactivate {
  private speechId: string;
  private subscription: Subscription;

  speech$: Observable<Speech>;
  tags$: Observable<Tag[]>;
  speechTags$: Observable<Tag[]>;
  actionSuccess = false;

  childForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tagService: TagService,
    private speechService: SpeechService,
    private transactionsService: TransactionsService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

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

  canDeactivate() {
    if (!this.actionSuccess && (this.childForm && this.childForm.dirty)) {
      const dialogRef = this.openDialog();
      return dialogRef.afterClosed();
    }
    return true;
  }

  openDialog() {
    return this.dialog.open(ConfirmModalComponent, {
      data: {
        header: 'Discard Changes',
        content: 'Do you want to exit and discard your changes?',
      },
      width: '18rem',
    });
  }

  updateSpeech(data) {
    if (this.childForm && this.childForm.dirty) {
      const currentUser$ = this.authService.getLoggedUser().pipe(first());
      const tags$ = this.tagService.getTags();
      const speechTags$ = this.tagService.getSpeechTagIds(this.speechId);

      this.subscription = forkJoin(currentUser$, tags$, speechTags$)
        .pipe(
          exhaustMap(([currentUser, allTags, speechTags]) => {
            // TODO: format dates
            const speechData: Partial<Speech> = {
              title: data.title,
              content: data.content,
              updatedAt: format(new Date(), environment.dateFormat),
              dueDate: format(data.dueDate, environment.dateFormat),
              authorId: currentUser.uid,
            };

            return this.transactionsService
              .createOrUpdateSpeechAndTags(
                speechData,
                data.tags,
                allTags,
                speechTags,
                this.speechId
              )
              .then(ref => {
                this.router.navigate(['/speeches/', ref.id]);
                this.actionSuccess = true;
              })
              .catch(error => console.error(error));
          })
        )
        .subscribe();
    } else {
      this.router.navigate(['/speeches/', this.speechId]);
    }
  }

  listenToChanges(form: FormGroup) {
    this.childForm = form;
  }
}
