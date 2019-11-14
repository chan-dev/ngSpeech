import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Observable, merge, of, fromEvent, Subject } from 'rxjs';
import {
  tap,
  map,
  delay,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  startWith,
  takeUntil,
} from 'rxjs/operators';
import {
  PaginationQueryConfig,
  FirebaseOrderByDirection,
  PaginationAction,
} from '@app/models/api';
import { SpeechService } from '@app/speech/services/speech.service';
import { SpeechesDataSource } from '@app/speech/services/speech.datasource';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-speech-list-page',
  templateUrl: './speech-list-page.component.html',
  styleUrls: ['./speech-list-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpeechListPageComponent
  implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  displayedColumns: string[] = ['title', 'dueDate', 'createdAt', 'updatedAt', 'actions'];
  dataSource = new SpeechesDataSource(this.speechService);
  pageSizeOptions = [5, 10, 15];
  pageSize = this.pageSizeOptions[0];
  sortOrder: SortDirection = 'asc';
  paginationAction: PaginationAction;
  allSpeechesCount$: Observable<number>;
  allSpeechesCount: number;
  loading$: Observable<boolean>;
  lastPageVisitedIndex = 0; // first page
  unsubscribe$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private speechService: SpeechService
  ) {}

  ngOnInit() {
    // TODO: call this again after filter
    // this.allSpeechesCount$ = this.speechService
    //   .getSpeeches()
    //   .pipe(map(result => result.length));

    const config: PaginationQueryConfig = {
      field: 'title',
      limit: this.pageSize,
      order: this.sortOrder as FirebaseOrderByDirection,
      cursor: null,
      filter: '',
    };

    this.dataSource.loadSpeeches(config);

    // Workaround to prevent jumpy behaviour when
    // navigating thru pagination by immediately hiding
    // the loader when the requests immediately finishes
    this.loading$ = this.dataSource.loading$.pipe(
      switchMap(value => of(value).pipe(delay(100)))
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.dataSource.resetCursor();
      this.paginator.pageIndex = 0;
    });

    // TODO: unsubscribe
    // complete on destroy?
    const filter$ = fromEvent(this.filter.nativeElement, 'keyup').pipe(
      tap(() => console.log('fromEvent listener')),
      map(event => (event as any).target.value),
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    );

    this.allSpeechesCount$ = filter$.pipe(
      tap(value => {
        const config: PaginationQueryConfig = {
          field: 'title',
          limit: this.pageSize,
          order: this.sortOrder as FirebaseOrderByDirection,
          cursor: null,
          filter: value,
        };
        this.paginator.pageIndex = 0;
        this.dataSource.loadSpeeches(config);
      }),
      switchMap(value => {
        return this.speechService.getSpeeches({
          field: 'title',
          filter: value,
          order: this.sortOrder as FirebaseOrderByDirection,
        });
      }),
      map(result => result.length)
    );

    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        tap(event => {
          // NOTE: about this whole check
          // * We can't rely on page number for firebase firestore pagination because
          // they're using cursor instead of page number for pagination, so we
          // have to find a way to know if whether a next or prev is checked
          // tobe able to get the correct cursor.
          if (event.hasOwnProperty('pageIndex')) {
            // this.paginationAction: PaginationAction;
            const pageEvent = event as PageEvent;
            const { pageIndex } = pageEvent;
            if (pageIndex > this.lastPageVisitedIndex) {
              this.paginationAction = PaginationAction.Next;
            } else {
              this.paginationAction = PaginationAction.Prev;
            }
            this.lastPageVisitedIndex = pageIndex;

            this.dataSource.setCursor(this.paginationAction);
          }

          // TODO: revert based on the set sortOrder
          const paginationOrder =
            this.paginationAction === PaginationAction.Next ? 'asc' : 'desc';
          const config: PaginationQueryConfig = {
            cursor: this.dataSource.getCursor(),
            field: 'title',
            filter: '',
            limit: this.paginator.pageSize,
            order:
              paginationOrder ||
              (this.sort.direction as FirebaseOrderByDirection) ||
              (this.sortOrder as FirebaseOrderByDirection),
          };

          console.log({
            lastCursor: this.dataSource.getCursor().get('title'),
          });

          this.dataSource.loadSpeeches(config);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  deleteSpeech(id: string) {
    const dialogRef = this.openDialog();
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.speechService.deleteSpeech(id);
      }
    });
  }

  openDialog() {
    return this.dialog.open(ConfirmModalComponent, {
      data: {
        header: 'Delete Speech',
        content: 'Do you want to delete this speech?',
      },
      width: '18rem',
    });
  }
}
