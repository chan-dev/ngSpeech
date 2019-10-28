import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {
  Speech,
  PaginationQueryConfig,
  SpeechAPIResult,
} from '@app/models/api';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private collectionName = 'speeches';
  speechCollection: AngularFirestoreCollection<Speech>;

  constructor(private afs: AngularFirestore) {
    this.speechCollection = this.afs.collection<Speech>(this.collectionName);
  }

  getSpeeches(query?: PaginationQueryConfig): Observable<SpeechAPIResult[]> {
    return this.afs
      .collection<SpeechAPIResult>(this.collectionName, ref => {
        if (!query) {
          return ref;
        }

        return this.buildQuery(query, ref);
      })
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => {
            const data = action.payload.doc.data();
            const doc = action.payload.doc;
            const id = action.payload.doc.id;
            return { ...data, doc, id };
          })
        ),
        tap(data => {
          const titles = data.map(v => v.title);
          console.log(titles);
        })
      );
  }

  private buildQuery(query: PaginationQueryConfig, ref: firebase.firestore.CollectionReference) {
    const { field, order, limit, filter, cursor } = query;
    let queryRef: firebase.firestore.Query;

    queryRef = ref.orderBy(field, order);

    if (cursor) {
      queryRef = queryRef.startAfter(cursor || null);
    }

    if (filter) {
      // NOTE: \uf8ff the last possible value in the utf8 charset
      // firestore has no wildcard string
      queryRef = queryRef.startAt(filter).endAt(`${filter}\uf8ff`);
    }

    if (limit) {
      queryRef = queryRef.limit(limit);
    }

    return queryRef;
  }
}
