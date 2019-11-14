import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { exhaustMap, first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Speech, Tag } from '@app/models/api';
import { TransactionsService } from '@app/speech/services/transactions.service';
import { TagService } from '@app/speech/services/tag.service';
import { AuthService } from '@app/auth/services/auth.service';
import { CanComponentDeactivate } from '@app/auth/can-component-deactivate';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import format from 'date-fns/format';

@Component({
  selector: 'app-speech-create-page',
  templateUrl: './speech-create-page.component.html',
  styleUrls: ['./speech-create-page.component.scss'],
})
export class SpeechCreatePageComponent
  implements OnInit, OnDestroy, CanComponentDeactivate {
  private subscription: Subscription;

  tags$: Observable<Tag[]>;
  isActionSuccess = false;
  childForm: FormGroup;

  constructor(
    private router: Router,
    private tagService: TagService,
    private transactionsService: TransactionsService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.tags$ = this.tagService.getTags();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  canDeactivate() {
    if (!this.isActionSuccess && (this.childForm && this.childForm.dirty)) {
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

  saveSpeech(data) {
    const currentUser$ = this.authService.getLoggedUser().pipe(first());
    const tags$ = this.tagService.getTags();

    this.subscription = forkJoin(currentUser$, tags$)
      .pipe(
        exhaustMap(([currentUser, allTags]) => {
          const speechData: Speech = {
            title: data.title,
            content: data.content,
            createdAt: format(new Date(), environment.dateFormat),
            updatedAt: format(new Date(), environment.dateFormat),
            dueDate: format(data.dueDate, environment.dateFormat),
            authorId: currentUser.uid,
          };
          return this.transactionsService
            .createOrUpdateSpeechAndTags(speechData, data.tags, allTags)
            .then(ref => {
              this.isActionSuccess = true;
              this.router.navigate(['/speeches/', ref.id]);
            })
            .catch(error => console.error(error));
        })
      )
      .subscribe();
  }

  listenToChanges(form: FormGroup) {
    this.childForm = form;
  }
}
