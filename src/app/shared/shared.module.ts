import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  declarations: [RelativeDatePipe, AlertComponent],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RelativeDatePipe,
    AlertComponent,
  ],
})
export class SharedModule {}
