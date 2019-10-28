import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { RelativeDatePipe } from './pipes/relative-date.pipe';

@NgModule({
  declarations: [RelativeDatePipe],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RelativeDatePipe,
  ],
})
export class SharedModule {}
