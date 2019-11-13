import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { AlertComponent } from './components/alert/alert.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [RelativeDatePipe, AlertComponent, ConfirmModalComponent],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RelativeDatePipe,
    AlertComponent,
    ConfirmModalComponent,
  ],
  entryComponents: [ConfirmModalComponent],
})
export class SharedModule {}
