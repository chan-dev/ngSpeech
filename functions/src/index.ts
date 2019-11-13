import * as functions from 'firebase-functions';
import * as firebase from 'firebase/app';

const admin = require('firebase-admin');
admin.initializeApp();

export const onMessageCreate = functions.firestore
  .document('/speeches/{speechId}')
  .onWrite((change, context) => {
    const speechId = context.params.speechId;

    const docRef: firebase.firestore.DocumentReference = admin
      .firestore()
      .collection('speeches')
      .doc(speechId);

    return docRef.get().then(querySnapshot => {
      const data = querySnapshot.data();
      return docRef.update({
        lowercaseTitle: data && data.title && data.title.toLowerCase(),
      });
    });
  });
