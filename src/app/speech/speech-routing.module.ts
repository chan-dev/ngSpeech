import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpeechContainerPageComponent } from './containers/speech-container-page/speech-container-page.component';
import { SpeechListPageComponent } from './containers/speech-list-page/speech-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: SpeechContainerPageComponent,
    children: [
      {
        path: '',
        component: SpeechListPageComponent,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeechRoutingModule {}
