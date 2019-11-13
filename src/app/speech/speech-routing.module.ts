import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { SpeechContainerPageComponent } from './containers/speech-container-page/speech-container-page.component';
import { SpeechListPageComponent } from './containers/speech-list-page/speech-list-page.component';
import { SpeechPageComponent } from './containers/speech-page/speech-page.component';
import { SpeechCreatePageComponent } from './containers/speech-create-page/speech-create-page.component';
import { SpeechEditPageComponent } from './containers/speech-edit-page/speech-edit-page.component';
import {
  AngularFireAuthGuard,
  canActivate,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { DeactivateGuard } from '@app/auth/guards/deactivate.guard';

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['auth/login']);

const routes: Routes = [
  {
    path: '',
    component: SpeechContainerPageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: '',
        component: SpeechListPageComponent,
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: SpeechCreatePageComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path: ':id/edit',
        component: SpeechEditPageComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path: ':id',
        component: SpeechPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeechRoutingModule {}
