import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Speech, Tag, SpeechTags } from '@app/models/api';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private afs: AngularFirestore) {}

  // TODO: we must also include in transaction the speech
  createOrUpdateSpeechAndTags(
    speech: Speech,
    selectedTags: string[],
    allTags: Tag[],
    speechTags?: SpeechTags, // Note: we can replace this with array of strings
    speechRefId?: string
  ): Promise<firebase.firestore.DocumentReference> {
    return this.afs.firestore.runTransaction(transaction => {
      let speechRef;
      try {
        speechRef = this.createOrUpdateSpeech(
          transaction,
          speech,
          speechRefId
        );
        this.createOrUpdateTags(
          transaction,
          selectedTags,
          allTags,
          speechTags,
          speechRef.id // use the newly created/updated speech
        );
      } catch(error) {
        console.error(error);
        return Promise.reject(error);
      }

      return Promise.resolve(speechRef);
    });
  }

  createOrUpdateSpeech(
    transaction: firebase.firestore.Transaction,
    speech: Speech,
    speechRefId: string
  ) {
    const speechCollection = 'speeches';
    const speechRef = speechRefId
      ? this.afs.doc(`${speechCollection}/${speechRefId}`).ref
      : this.afs.collection(`${speechCollection}`).ref.doc();

    transaction.set(speechRef, speech, { merge: true });
    return speechRef;
  }

  createOrUpdateTags(
    transaction: firebase.firestore.Transaction,
    selectedTags: string[],
    allTags: Tag[],
    speechTags?: SpeechTags, // Note: we can replace this with array of strings
    speechRefId?: string
  ) {
    const speechTagsCollection = 'speechTags';
    const tagsCollection = 'tags';

    // Refer to an existing speechTag document or create a new one
    const speechTagRef = speechRefId
      ? this.afs.doc(`${speechTagsCollection}/${speechRefId}`).ref
      : this.afs.collection(`${speechTagsCollection}`).ref.doc();
    // means we're in edit mode
    if (speechTags) {
      // get current information from matching tags in tags collection
      const currentSpeechTags = allTags.filter(tag =>
        Object.keys(speechTags).includes(tag.id)
      );
      // remove existing speech tags that are not in the selected tags
      const tagsToRemove = currentSpeechTags.filter(
        tag => !selectedTags.includes(tag.text)
      );

      tagsToRemove.forEach(tagToRemove => {
        const speechTagRefId = this.afs.doc(
          `${speechTagsCollection}/${speechRefId}`
        ).ref;
        transaction.update(speechTagRefId, {
          [tagToRemove.id]: firebase.firestore.FieldValue.delete(),
        });
      });
    }

    selectedTags.forEach(selectedTag => {
      const foundTag = allTags.find(tag => tag.text.includes(selectedTag));

      if (foundTag) {
        // take the tag key and save it to speechTag
        transaction.set(
          speechTagRef,
          {
            [foundTag.id]: true,
          },
          { merge: true }
        );
      } else {
        // we need to create the tag and save it to both tags and speechTags collection
        const newTagRef = this.afs.collection(tagsCollection).ref.doc();
        transaction.set(newTagRef, {
          text: selectedTag,
        });
        transaction.set(
          speechTagRef,
          {
            [newTagRef.id]: true,
          },
          { merge: true }
        );
      }
    });
  }

  // create tags + create/update speech and associated tags
  // async createOrUpdateSpeechTags(
  //   tags: string[],
  //   speech: Partial<Speech>,
  //   speechDocRef: firebase.firestore.DocumentReference
  // ) {
  //   const firestoreInstance = this.afs.firestore;

  //   return firestoreInstance.runTransaction(transaction => {
  //     const uniqueTags = [...new Set(tags)].map(tag => ({
  //       text: tag,
  //     }));

  //     // add or update the speech
  //     transaction.set(speechDocRef, speech);

  //     // create new tags
  //     uniqueTags.forEach(async tag => {
  //       // create empty doc reference
  //       const newTagRef = firestoreInstance.collection('fakeTags').doc();
  //       transaction.set(newTagRef, tag);

  //       // associate each tag to the created/updated speech
  //       transaction.set(
  //         speechDocRef,
  //         {
  //           tags: {
  //             [newTagRef.id]: tag,
  //           },
  //         },
  //         { merge: true }
  //       );
  //     });
  //     return Promise.resolve('ok');
  //   });
  // }
}
