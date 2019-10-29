import { Injectable } from '@angular/core';
import { map, tap, mergeMap, toArray, take } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Tag, SpeechTags } from '@app/models/api';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private collectionName = 'tags';
  speechCollection: AngularFirestoreCollection<Tag>;

  constructor(private afs: AngularFirestore) {}

  getTags() {
    return this.afs
      .collection<Tag>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;
            return { ...data, id };
          })
        ),
        take(1),
        tap(tags => {
          console.log(tags);
        })
      );
  }

  getTag(id: string) {
    return this.afs
      .doc<Tag>(`tags/${id}`)
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data();
          const id = action.payload.id;
          return { ...data, id };
        })
      );
  }

  getSpeechTagIds(id: string): Observable<SpeechTags> {
    return this.afs
      .doc<any>(`speechTags/${id}`)
      .valueChanges()
      .pipe(take(1));
  }

  getSpeechTags(speechId: string): Observable<Tag[]> {
    const speechIds$ = this.getSpeechTagIds(speechId);
    return speechIds$.pipe(
      map(speechIds => Object.keys(speechIds)),
      mergeMap(speechIds => {
        return from(speechIds).pipe(
          mergeMap(id => this.getTag(id)),
          // we need to complete the observable to make toArray work
          // because angularfire doesn't complete observables because
          // still listens to changes from firebase
          take(speechIds.length),
          // instead of emitting each value, consolidate them
          // inside a array
          toArray()
        );
      })
    );
  }
}
