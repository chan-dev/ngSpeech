import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GuestGuard } from './guards/guest.guard';
import { AngularFireAuthGuard, canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';

const redirectLoggedInToItems = () => redirectLoggedInTo(['speeches']);

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
