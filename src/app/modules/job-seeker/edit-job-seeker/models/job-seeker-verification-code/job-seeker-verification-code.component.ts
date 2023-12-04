import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';
@Component({
  selector: 'app-job-seeker-verification-code',
  templateUrl: './job-seeker-verification-code.component.html',
  styleUrls: ['./job-seeker-verification-code.component.scss'],
})
export class JobSeekerVerificationCodeComponent implements OnInit, OnDestroy {
  codeCharactersForm: FormGroup;
  hasError: boolean;
  isPassword: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  public email: any;
  public Newemail: any;
  public formvalue: any;

  constructor(
    private formbuilder: FormBuilder,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private generalService: GeneralServicesService,
    private jobSeekerService: JobSekerManagementService
  ) {}

  ngOnInit(): void {
 
    this.initForm();
    this.codeCharactersForm.get('email')?.setValue(this.formvalue.email);

  }

  initForm() {
    this.codeCharactersForm = this.formbuilder.group({
      email: [null, Validators.required],
      char1: [null, Validators.required],
      char2: [null, Validators.required],
      char3: [null, Validators.required],
      char4: [null, Validators.required],
    });
  }

  movetoNext(e: any) {
    if (e.srcElement.value != '') {
      e.preventDefault();
      let nextControl: any = e.srcElement.nextElementSibling;
      // Searching for next similar control to set it focus
      while (true) {
        if (nextControl) {
          if (nextControl.type === e.srcElement.type) {
            nextControl.focus();
            return;
          } else {
            nextControl = nextControl.nextElementSibling;
          }
        } else {
          return;
        }
      }
    }
  }

  resendCode() {
    this.generalService
      .getCode(this.Newemail)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastr.success(this.translate.instant('otpPage.resendSuccess'));
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        },
      });
  }

  submit() {
    
    if (this.codeCharactersForm.invalid) {
      this.toastr.error(
        this.translate.instant('jobSeeker.PleaseEnterValidOTP')
      );
      return;
    }

    if (this.codeCharactersForm.valid) {
      const formValue = this.codeCharactersForm.value;
      const { char1, char2, char3, char4 } = formValue;
      let enteredCode = char1 + char2 + char3 + char4;
      this.hasError = false;
      this.spinner.show();
      this.generalService
        .verfiyCode({
          code: enteredCode,
          email: this.codeCharactersForm.value.email,
        })
        .subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res) {
              this.toastr.success(
                this.translate.instant('facility.emailVerfiy')
              );
              this.spinner.show();

              this.jobSeekerService.editJobSeeker(this.formvalue).subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.toastr.success(
                    this.translate.instant('facility.updateSuccess')
                  );
                  this.modalService.dismissAll('Cross click');
                  this.cdr.detectChanges();
                },
                error: (err: any) => {
                  this.spinner.hide();
                  this.toastr.error(err.error.error.message);
                },
              });
            } else {
              this.toastr.error(
                this.translate.instant('facility.emailNotVerfiy')
              );
              // this.formvalue.agentRepresentativeEmail = this.email;
              // this.spinner.show();
              // this.jobSeekerService.editJobSeeker(this.formvalue).subscribe({
              //   next: (res: any) => {
              //     this.spinner.hide();
              //     this.toastr.success(
              //       this.translate.instant('facility.updateSuccessWithoutEmail')
              //     );

              //     this.modalService.dismissAll('Cross click');
              //     this.cdr.detectChanges();
              //   },
              //   error: (err: any) => {
              //     this.spinner.hide();
              //     this.toastr.error(err.error.error.message);
              //   },
              // });
            }
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

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }
}
