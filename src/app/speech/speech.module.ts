import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

import { SpeechRoutingModule } from './speech-routing.module';
import { SpeechContainerPageComponent } from './containers/speech-container-page/speech-container-page.component';
import { SpeechListPageComponent } from './containers/speech-list-page/speech-list-page.component';
import { SpeechPageComponent } from './containers/speech-page/speech-page.component';
import { SpeechComponent } from './components/speech/speech.component';
import { SpeechCreatePageComponent } from './containers/speech-create-page/speech-create-page.component';
import { SpeechFormComponent } from './components/speech-form/speech-form.component';
import { QuillModule } from 'ngx-quill';
import { SpeechEditPageComponent } from './containers/speech-edit-page/speech-edit-page.component';

@NgModule({
  declarations: [
    SpeechContainerPageComponent,
    SpeechListPageComponent,
    SpeechPageComponent,
    SpeechComponent,
    SpeechCreatePageComponent,
    SpeechFormComponent,
    SpeechEditPageComponent,
  ],
  imports: [CommonModule, SharedModule, SpeechRoutingModule, QuillModule],
})
export class SpeechModule {}
