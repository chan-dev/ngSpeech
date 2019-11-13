import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@env/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  imports: [
    CommonModule,
    RouterModule, // for router-outlet directive
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularMaterialModule,
  ],
  declarations: [WrapperComponent],
  exports: [WrapperComponent],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        `CoreModule has already been loaded. Import Core module in the AppModule only.`
      );
    }
  }
}
