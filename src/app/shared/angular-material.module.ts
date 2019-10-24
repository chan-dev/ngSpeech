import { NgModule } from '@angular/core';

import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

const modules = [
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  LayoutModule,
  MatCheckboxModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class AngularMaterialModule {}
