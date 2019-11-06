import { SortDirection } from '@angular/material/sort';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Tag {
  id: string;
  text: string;
}

export interface Speech {
  id?: string;
  content: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  // NOTE: Since we're using NoSQL in Firebase
  // we denormalize the result for faster read queries
  // and only require certain columns
  author: Partial<User>;
}

// export type SpeechTags = { [tagId: string]: boolean } & { id: string };
export interface SpeechTags {
  [tagId: string]: boolean;
}

// Aliases
export type FirebaseQueryDocSnapshot = firebase.firestore.QueryDocumentSnapshot;
export type FirebaseOrderByDirection = firebase.firestore.OrderByDirection;

export interface PaginationQueryConfig {
  field: string; // field to orderBy
  limit: number; // limit per query
  order: FirebaseOrderByDirection; // sort order
  filter?: string; // used for searching
  path?: string; //  path to collection
  cursor?: FirebaseQueryDocSnapshot; // used for firestore pagination
}

export enum PaginationAction {
  Next = 'Next',
  Prev = 'Prev',
}

// we need DocumentReference to be used as cursor for pagination in firebase
export type SpeechAPIResult = Speech & {
  doc: FirebaseQueryDocSnapshot;
};
