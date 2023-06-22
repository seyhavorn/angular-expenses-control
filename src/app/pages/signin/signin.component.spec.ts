import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninComponent } from './signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let page: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SigninComponent],
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  describe('give form', () => {
    it('when email is empty, then recover password button should be disabled', () => {
      setEmail(' ');

      expect(
        recoverPasswordButton().disabled
      ).toBeTruthy();
    });

    it('when email is invalid, then recover password button should be disabled', () => {
      setEmail('invalidEmail');
      expect(
        recoverPasswordButton().disabled
      ).toBeTruthy();
    });

    // Check login Button:
    it('when email is empty, then login button should be disabled', () => {
      setEmail(' ');

      expect(
        loginButton().disabled
      ).toBeTruthy();
    });

    it('when email is invalid, then login button should be disabled', () => {
      setEmail('invalidEmail');

      expect(
        loginButton().disabled
      ).toBeTruthy();
    });

    it('when password is empty, then login button should be disabled', () => {
      setEmail('vali@gmail.com');
      setPassword('');

      expect(
        loginButton().disabled
      ).toBeTruthy();
    });

    it('when password is not empty, then login button should be enabled', () => {
      setEmail('valid@gmail.com');
      setPassword('anyPassword');
      expect(
        loginButton().disabled
      ).toBeFalsy();
    });
  });

  function setEmail(value: string) {
    component.form.get('email')?.setValue(value);
    fixture.detectChanges();
  }

  function setPassword(value: string) {
    component.form.get('password')?.setValue(value);
    fixture.detectChanges();
  }

  function recoverPasswordButton() {
    return page.querySelector('[test-id="recover-password-button"]');
  }

  function loginButton() {
    return page.querySelector('[test-id="login-button"]');
  }

  function registerButton() {
    return page.querySelector('[test-id="register-button"]');
  }

});
