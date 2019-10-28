import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

import { SpeechRoutingModule } from './speech-routing.module';
import { SpeechContainerPageComponent } from './containers/speech-container-page/speech-container-page.component';
import { SpeechListPageComponent } from './containers/speech-list-page/speech-list-page.component';

@NgModule({
  declarations: [SpeechContainerPageComponent, SpeechListPageComponent],
  imports: [CommonModule, SharedModule, SpeechRoutingModule],
})
export class SpeechModule {}
