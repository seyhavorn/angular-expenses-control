import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin.component';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

const route: Routes = [
  {
    path: '',
    component: SigninComponent,
  },
];

@NgModule({
  declarations: [SigninComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    ReactiveFormsModule,

    MatButtonModule,
    MatInputModule,
  ],
})
export class SigninModule {}
