import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

import { SpeechRoutingModule } from './speech-routing.module';
import { SpeechContainerPageComponent } from './containers/speech-container-page/speech-container-page.component';
import { SpeechListPageComponent } from './containers/speech-list-page/speech-list-page.component';
import { SpeechPageComponent } from './containers/speech-page/speech-page.component';
import { SpeechComponent } from './components/speech/speech.component';

@NgModule({
  declarations: [SpeechContainerPageComponent, SpeechListPageComponent, SpeechPageComponent, SpeechComponent],
  imports: [CommonModule, SharedModule, SpeechRoutingModule],
})
export class SpeechModule {}
