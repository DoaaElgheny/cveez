import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalConfig } from 'src/app/_metronic/partials';
import { TranslationService } from 'src/app/i18n';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { ConfirmChangePasswordValidator } from './confirm-change-password.validator';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss'],
})
export class ModalChangePasswordComponent implements OnInit {
  showPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  changePasswordForm: FormGroup;
  passwordNotMatch: boolean;
  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private manageService: AgentManagementService,
    private formbuilder: FormBuilder,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.changePassworInitForm();
  }
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal')
  private modalContent: TemplateRef<ModalChangePasswordComponent>;
  private modalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async close(): Promise<void> {
    if (
      this.modalConfig.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig.onClose === undefined ||
        (await this.modalConfig.onClose());
      this.modalRef.close(result);
    }
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.disableDismissButton !== undefined) {
      return;
    }

    if (
      this.modalConfig.shouldDismiss === undefined ||
      (await this.modalConfig.shouldDismiss())
    ) {
      const result =
        this.modalConfig.onDismiss === undefined ||
        (await this.modalConfig.onDismiss());
      this.modalRef.dismiss(result);
    }
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
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            ),
          ],
        ],
        newPassword: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(25),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            ),
          ],
        ],
        confirmPassword: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            ),
          ],
        ],
      },
      {
        validator: ConfirmChangePasswordValidator.MatchPassword,
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
  togglePasswordVisibilty() {
    this.showPassword = !this.showPassword;
  }
  toggleNewPasswordVisibilty() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleConfirmPasswordVisibilty() {
    this.showConfirmPassword = !this.showConfirmPassword;
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

      this.manageService
        .changePassword(this.changePasswordForm.value)
        .subscribe({
          next: (res) => {
            this.spinner.hide();
            this.toastr.success(
              this.translate.instant('changePassword.passwordSuccess')
            );

            this.modalService.dismissAll('Cross click');
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          },
        });
    }
    // setTimeout(() => {
    //   this.isLoading$.next(false);
    //   this.showChangePasswordForm = false;
    //   this.cdr.detectChanges();
    // }, 1500);
  }
}
