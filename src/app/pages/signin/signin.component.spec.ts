import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninComponent } from './signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { BlankComponent } from 'src/app/mocks/blank/blank.component';
import { AuthenticationService } from './services/authentication.service';
import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let page: any;
  let location: Location;
  let authenticationService: AuthenticationServiceMock;
  let snackBar: SnackBarMock;

  beforeEach(async () => {
    authenticationService = new AuthenticationServiceMock();
    snackBar = new SnackBarMock();

    await TestBed.configureTestingModule({
      declarations: [SigninComponent],
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: BlankComponent },
        ]),
        MatSnackBarModule,
      ],
    })
      .overrideProvider(AuthenticationService, {
        useValue: authenticationService,
      })
      .overrideProvider(MatSnackBar, { useValue: snackBar })
      .compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    location = TestBed.inject(Location);

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe('give form', () => {
    it('when email is empty, then recover password button should be disabled', () => {
      setEmail(' ');

      expect(recoverPasswordButton().disabled).toBeTruthy();
    });

    it('when email is invalid, then recover password button should be disabled', () => {
      setEmail('invalidEmail');
      expect(recoverPasswordButton().disabled).toBeTruthy();
    });

    // Check login Button:
    it('when email is empty, then login button should be disabled', () => {
      setEmail(' ');

      expect(loginButton().disabled).toBeTruthy();
    });

    it('when email is invalid, then login button should be disabled', () => {
      setEmail('invalidEmail');

      expect(loginButton().disabled).toBeTruthy();
    });

    it('when password is empty, then login button should be disabled', () => {
      setEmail('vali@gmail.com');
      setPassword('');

      expect(loginButton().disabled).toBeTruthy();
    });

    it('when password is not empty, then login button should be enabled', () => {
      setEmail('valid@gmail.com');
      setPassword('anyPassword');
      expect(loginButton().disabled).toBeFalsy();
    });
  });

  describe('Login Flow', () => {
    describe('given user click on login button,', () => {
      beforeEach(() => {
        setEmail('valid@gmail.com');
        setPassword('anyPassword');
        loginButton().click();
        fixture.detectChanges();
      });

      it('the show login loader', () => {
        expect(loginLoader()).not.toBeNull();
      });

      it('the hide login button', () => {
        expect(loginButton()).toBeNull();
      });

      describe('when login is successful', () => {
        beforeEach(() => {
          authenticationService._siginInResponse.next({ id: 'anyUserId' });
        });

        it('then go to home page', (done) => {
          setTimeout(() => {
            expect(location.path()).toEqual('/home');
            done();
          }, 100);
        });
      });

      describe('when login fails', () => {
        beforeEach(() => {
          authenticationService._siginInResponse.error({ message: 'anyError' });
          fixture.detectChanges();
        });

        it('then do not go to home page', (done) => {
          setTimeout(() => {
            expect(location.path()).not.toEqual('/home');
            done();
          }, 100);
        });

        it('then hide login loader', () => {
          expect(loginLoader()).toBeNull();
        });

        it('then show login button', () => {
          expect(loginButton()).not.toBeNull();
        });

        it('then show error message', () => {
          expect(snackBar._isOpened).toBeTruthy();
        });
      });
    });
  });

  describe('Recover Password Flow', () => {
    describe('given use clicks on recover password button', () => {
      beforeEach(() => {
        setEmail('valid@gmail.com');
        recoverPasswordButton().click();
        fixture.detectChanges();
      });

      it('then show recver password loader', () => {
        expect(recoverPasswordLoader()).not.toBeNull();
      });

      it('then hide recover password button ', () => {
        expect(recoverPasswordButton()).toBeNull();
      });

      describe('when recover password success', () => {
        beforeEach(() => {
          authenticationService._recoverPasswordResponse.next({});
          fixture.detectChanges();
        });

        it('then hide recver password loader', () => {
          expect(recoverPasswordLoader()).toBeNull();
        });

        it('then show recover password button ', () => {
          expect(recoverPasswordButton()).not.toBeNull();
        });

        it('then show success message', ()=> {
          expect(snackBar._isOpened).toBeTruthy();
        })
      });

      describe('when revoer password fails', ()=> {
        beforeEach(() => {
          authenticationService._recoverPasswordResponse.error({ message: "any message"});
          fixture.detectChanges();
        })

        it('then hide recver password loader', () => {
          expect(recoverPasswordLoader()).toBeNull();
        });

        it('then show recover password button ', () => {
          expect(recoverPasswordButton()).not.toBeNull();
        });

        it('then show error message',()=> {
          expect(snackBar._isOpened).toBeTruthy();
        })

      })

    });
  });

  function recoverPasswordLoader() {
    return page.querySelector('[test-id="recover-password-loader"]');
  }

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

  function loginLoader() {
    return page.querySelector('[test-id="login-loader"]');
  }
});

class AuthenticationServiceMock {
  _recoverPasswordResponse = new Subject();
  _siginInResponse = new Subject();

  recoverPassword() {
    return this._recoverPasswordResponse.asObservable();
  }

  signIn() {
    return this._siginInResponse.asObservable();
  }
}

class SnackBarMock {
  _isOpened = false;

  open() {
    this._isOpened = true;
  }
}
