import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
  }

  login(email, password) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/auth/login']);
  }

  getLoggedUser(): Observable<firebase.User> {
    return this.afAuth.user;
  }
}
