import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SpeechService } from '@app/speech/services/speech.service';
import { SpeechesDataSource } from '@app/speech/services/speech.datasource';
import {
  PaginationQueryConfig,
  FirebaseOrderByDirection,
  PaginationAction,
} from '@app/models/api';
import { Observable, merge } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-speech-list-page',
  templateUrl: './speech-list-page.component.html',
  styleUrls: ['./speech-list-page.component.scss'],
})
export class SpeechListPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['title', 'createdAt', 'updatedAt'];
  dataSource = new SpeechesDataSource(this.speechService);
  pageSizeOptions = [5, 10, 15];
  pageSize = this.pageSizeOptions[0];
  sortOrder: SortDirection = 'asc';
  paginationAction: PaginationAction;
  allSpeechesCount$: Observable<number>;
  loading$: Observable<boolean>;
  lastPageVisitedIndex = 0; // first page

  constructor(private speechService: SpeechService) {}

  ngOnInit() {
    this.allSpeechesCount$ = this.speechService
      .getSpeeches()
      .pipe(map(result => result.length));

    const config: PaginationQueryConfig = {
      field: 'title',
      limit: this.pageSize,
      order: this.sortOrder as FirebaseOrderByDirection,
      cursor: null,
      filter: '',
    };

    this.dataSource.loadSpeeches(config);
    this.loading$ = this.dataSource.loading$;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.dataSource.resetCursor();
      this.paginator.pageIndex = 0;
    });

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
            const { pageIndex, previousPageIndex } = pageEvent;
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
        })
      )
      .subscribe();
  }
}
