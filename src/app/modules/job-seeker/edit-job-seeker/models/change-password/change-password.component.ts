import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/auth';
import { ConfirmPasswordValidator } from 'src/app/modules/SharedComponent/helper/confirm-password.validator';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  showPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  changePasswordForm: FormGroup;
  passwordNotMatch: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private formbuilder: FormBuilder,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.changePassworInitForm();
  }

  togglePasswordVisibilty() {
    this.showPassword = !this.showPassword;
  }

  toggleNewPasswordVisibilty() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibilty() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  changePassworInitForm() {
    this.changePasswordForm = this.formbuilder.group(
      {
        currentPassword: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(25),
            Validators.pattern(ValidationPattern.Password),
          ],
        ],
        newPassword: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(25),
            Validators.pattern(ValidationPattern.Password),
          ],
        ],
        confirmPassword: [
          null,
          [Validators.required, Validators.pattern(ValidationPattern.Password)],
        ],
      },
      {
        validator: [ConfirmPasswordValidator.MatchPassword],
      }
    );
    this.changePasswordForm
      .get('newPassword')
      ?.valueChanges.subscribe((password) => {
        if (
          password != this.changePasswordForm.value.confirmPassword &&
          this.changePasswordForm.value.confirmPassword
        ) {
          this.passwordNotMatch = true;
        } else {
          this.passwordNotMatch = false;
        }
      });
    this.changePasswordForm
      .get('confirmPassword')
      ?.valueChanges.subscribe((confirmPassword) => {
        if (confirmPassword != this.changePasswordForm.value.newPassword) {
          this.passwordNotMatch = true;
        } else {
          this.passwordNotMatch = false;
        }
      });
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  savePassword() {
    Object.keys(this.changePasswordForm.controls).forEach((field) => {
      // {1}
      const control = this.changePasswordForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });

    if (
      this.changePasswordForm.valid &&
      this.changePasswordForm.get('currentPassword')?.value ===
        this.changePasswordForm.get('newPassword')?.value
    ) {
      this.toastr.error(
        this.translate.instant(
          'changePassword.NewPasswordCantBeTheSameAsTheOldPassword'
        )
      );
      return;
    }

    if (
      this.changePasswordForm.valid &&
      this.changePasswordForm.get('newPassword')?.value ==
        this.changePasswordForm.get('confirmPassword')?.value
    ) {
      this.spinner.show();

      this.authService.changePassword(this.changePasswordForm.value).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant('changePassword.passwordSuccess')
          );

          this.modalService.dismissAll('Cross click');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        },
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
