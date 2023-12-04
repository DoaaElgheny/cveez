import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {  Router } from '@angular/router';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  selectedLanguage: any;
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  showPassword: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,

  ) {

    // this.isLoading$ = this.authService.isLoading$;
    this.isLoading$ = this.authService.isLoading$;

    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    this.initForm();
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');
    this.loginForm.get('email')?.setValue(email);
    this.loginForm.get('password')?.setValue(password);
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Password),
        ]),
      ],
      remeberMe: [false],
    });
  }
  togglePasswordVisibilty() {
    this.showPassword = !this.showPassword;
  }
  submit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
