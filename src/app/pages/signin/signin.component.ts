import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  form!: FormGroup;
  isLoginIn: boolean = false;
  isRecoveringPassword: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    this.isLoginIn = true;
    this.authenticationService
      .signIn({
        email: this.form.value.email,
        password: this.form.value.password,
      })
      .subscribe(
        (res) => {
          // this.isLoginIn = false;
          this.router.navigate(['home']);
        },
        (error: any) => {
          this.isLoginIn = false;
          this.snackBar.open(error.message, 'OK', {
            duration: 5000,
          });
        }
      );
  }

  recoverPassword() {
    this.isRecoveringPassword = true;
    this.authenticationService.recoverPassword(this.form.value.email).subscribe(
      (res) => {
        this.isRecoveringPassword = false;
        this.snackBar.open(
          'You can rever your password in your email account.',
          'OK',
          {
            duration: 5000,
          }
        );
      },
      (error: any) => {
        this.isRecoveringPassword = false;
        this.snackBar.open(error.message, 'Oke', {
          duration: 5000,
        });
      }
    );
  }
}
