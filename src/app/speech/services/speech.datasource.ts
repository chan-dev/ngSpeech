import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import {
  Speech,
  PaginationQueryConfig,
  SpeechAPIResult,
  FirebaseQueryDocSnapshot,
  PaginationAction,
} from '@app/models/api';
import { SpeechService } from './speech.service';

export class SpeechesDataSource implements DataSource<Speech> {
  private speechesSubject = new BehaviorSubject<SpeechAPIResult[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private lastActiveCursor: FirebaseQueryDocSnapshot = null;

  loading$ = this.loadingSubject.asObservable();
  speeches$ = this.speechesSubject.asObservable();

  constructor(private speechService: SpeechService) {}

  connect(collectionViewer: CollectionViewer): Observable<Speech[]> {
    return this.speeches$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.speechesSubject.complete();
    this.loadingSubject.complete();
  }

  loadSpeeches(query: PaginationQueryConfig) {
    this.loadingSubject.next(true);
    this.speechService
      .getSpeeches(query)
      .pipe(
        // required to complete the angularfire's snapshotChanges() observable w/c
        // doesn't use HttpClient. Unlike snapshotChanges, HttpClient requests
        // are only one-off requests then completes
        take(1),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(speeches => {
        this.speechesSubject.next(speeches);
      });
  }

  resetCursor() {
    this.lastActiveCursor = null;
  }

  getCursor() {
    return this.lastActiveCursor;
  }

  setCursor(action: PaginationAction) {
    // NOTE: we get the latest value by extracting it from a BehaviorSubject
    const speeches = this.speechesSubject.value;

    const index = action === PaginationAction.Next ? speeches.length - 1 : 0;
    this.lastActiveCursor = (speeches && speeches[index].doc) || null;
  }
}
