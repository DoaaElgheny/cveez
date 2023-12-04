import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmEmailValidator } from 'src/app/modules/SharedComponent/helper/confirm-email.validator';
import { ConfirmPasswordValidator } from 'src/app/modules/SharedComponent/helper/confirm-password.validator';
import { AgentRepresentativeConfirmEmailValidator } from 'src/app/modules/SharedComponent/helper/AgentRepresentativeConfirmEmailValidator';
import { AuthService } from '../../services/auth.service';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AfterRegisterationSucComponent } from '../after-registeration-suc/after-registeration-suc.component';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { EmailValidatorMatch } from 'src/app/modules/agent/edit-agent-profile/model/agent-information/emailValidator';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-agent-registration',
  templateUrl: './agent-registration.component.html',
  styleUrls: ['./agent-registration.component.scss'],
})
export class AgentRegistrationComponent implements OnInit, OnDestroy {
  private agentRegisterationForm: FormGroup;
  public representativeForm: FormGroup;
  public agentForm: FormGroup;
  public hasError: boolean = false;
  private isLoading$: Observable<boolean>;
  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;
  public showNotAgree: boolean = false;
  public countriesList: Array<any> = [];
  private unsubscribe: Subscription[] = [];
  public minDate: any;
  public lang: string = String(localStorage.getItem('language'));
  private dialogSize: 'sm' | 'lg' = 'sm';
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  expireDate: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private generalServices: GeneralServicesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public datepipe: DatePipe
  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
    this.isLoading$ = this.authService.isLoading$;
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.generalServices.getCountriesList().subscribe({
      next: (value) => {
        this.countriesList = value;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public initForm() {
    this.agentRegisterationForm = this.fb.group(
      {
        name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        emailConfirm: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            // Validators.maxLength(25),
            Validators.pattern(ValidationPattern.Password),
          ]),
        ],
        passwordConfirm: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            // Validators.maxLength(25),
            Validators.pattern(ValidationPattern.Password),
          ]),
        ],
        description: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
          ]),
        ],
        mobileNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Mobile),
          ]),
        ],
        countryCode: [
          966,
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(100),
          ]),
        ],
        countryCodeIso: [
          'sa',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ]),
        ],
        commercialRegistertionNoImageName: [
          null,
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        commercialRegistertionNoImageStorageFileName: [
          null,
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        logoImageName: [
          null,
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        logoImageStorageFileName: [
          null,
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        expirationDate: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            // Validators.pattern(
            //   '/^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2}$/'
            // ),
          ]),
        ],
        agentRepresentativeName: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        agentRepresentativeEmail: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        agentRepresentativeConfirmEmail: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        agentRepresentativePosition: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        agentMobileNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Mobile),
          ]),
        ],
        agentCountryCode: [966, Validators.compose([Validators.required])],
        agentCountryCodeIso: 'sa',
        countryId: [null, Validators.compose([Validators.required])],
        commercialRegistrationNo: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('^[0-9]*$'),
          ]),
        ],
        linkedInAccountLink: [''],
        termsAndConditions: [null, Validators.compose([Validators.required])],
        isAllowNotification: false,
      },
      {
        validator: [
          AgentRepresentativeConfirmEmailValidator.agentRepresentativeConfirmEmail,
          ConfirmPasswordValidator.MatchPassword,
          ConfirmEmailValidator.MatchemailConfirm,
        ],
      }
    );

    this.representativeForm = this.fb.group(
      {
        agentRepresentativeName: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        agentRepresentativeEmail: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        agentRepresentativeConfirmEmail: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        agentRepresentativePosition: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        agentMobileNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Mobile),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            // Validators.maxLength(25),
            Validators.pattern(ValidationPattern.Password),
          ]),
        ],
        passwordConfirm: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            // Validators.maxLength(25),
            Validators.pattern(ValidationPattern.Password),
          ]),
        ],
        agentCountryCode: [966, Validators.compose([Validators.required])],
        agentCountryCodeIso: 'sa',
        countryId: [null, Validators.compose([Validators.required])],
      },
      {
        validator: [
          AgentRepresentativeConfirmEmailValidator.agentRepresentativeConfirmEmail,
          ConfirmPasswordValidator.MatchPassword,
          EmailValidatorMatch.MatchPassword,
        ],
      }
    );

    this.agentForm = this.fb.group(
      {
        name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        emailConfirm: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        description: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
          ]),
        ],
        mobileNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Mobile),
          ]),
        ],
        countryCode: [
          966,
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(100),
          ]),
        ],
        countryCodeIso: [
          'sa',
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(100),
          ]),
        ],
        commercialRegistrationNo: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('^[0-9]*$'),
          ]),
        ],
        commercialRegistertionNoImageName: [
          null,
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        commercialRegistertionNoImageStorageFileName: [
          null,
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        logoImageName: [
          null,
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        logoImageStorageFileName: [
          null,
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        expirationDate: [
          null,
          Validators.compose([
            Validators.required,
            // Validators.pattern('[0-9]{4}[/-][0-9]{2}[/-][0-9]{2}$'),
          ]),
        ],
        linkedInAccountLink: [''],
        termsAndConditions: [null, Validators.compose([Validators.required])],
        isAllowNotification: false,
      },
      {
        validator: [
          AgentRepresentativeConfirmEmailValidator.agentRepresentativeConfirmEmail,
          ConfirmEmailValidator.MatchemailConfirm,
        ],
      }
    );
  }

  public togglePasswordVisibilty() {
    this.showPassword = !this.showPassword;
  }

  public togglePasswordConfirmVisibilty() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  public uploadlogoImg(data: any) {
    this.agentForm.get('logoImageName')?.setValue(data.storageFileName);
    this.agentForm
      .get('logoImageStorageFileName')
      ?.setValue(data.storageFileName);
  }

  public uploadcommericalImg(data: any) {
    this.agentForm
      .get('commercialRegistertionNoImageName')
      ?.setValue(data.storageFileName);
    this.agentForm
      .get('commercialRegistertionNoImageStorageFileName')
      ?.setValue(data.storageFileName);
  }

  public onInputChange(event: any, fieldName: string) {
    if (event.isNumberValid) {
      if (fieldName === 'mobileNumber') {
        this.agentForm
          .get('mobileNumber')
          ?.setValue(
            event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
          );
        this.agentForm.get('countryCode')?.setValue(event.dialCode);
        this.agentForm.get('countryCodeIso')?.setValue(event.iso2Code);
      } else if (fieldName === 'agentMobileNumber') {
        this.representativeForm
          .get('agentMobileNumber')
          ?.setValue(
            event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
          );
        this.representativeForm
          .get('agentCountryCode')
          ?.setValue(event.dialCode);
        this.representativeForm
          .get('agentCountryCodeIso')
          ?.setValue(event.iso2Code);
      }
    } else {
      if (fieldName === 'mobileNumber') {
        this.agentForm.get('mobileNumber')?.markAsTouched({ onlySelf: true });
        this.agentForm.get('mobileNumber')?.setErrors({ pattern: true });
      } else if (fieldName === 'agentMobileNumber') {
        this.representativeForm
          .get('agentMobileNumber')
          ?.markAsTouched({ onlySelf: true });
        this.representativeForm
          .get('agentMobileNumber')
          ?.setErrors({ required: true });
      }
    }
  }
  public onInputChangeDate(): void {
    const date = this.datepipe.transform(this.expireDate, 'yyyy-MM-dd');
  
  }
  public submit() {
    debugger
    if (this.expireDate) {
  
      let dateArr=this.expireDate.split('-')
      const date1: NgbDate = new NgbDate(
       Number( dateArr[0]),
       Number(dateArr[1]),
        Number(dateArr[2])
      );
      const jsDate1 = new Date(date1.year, date1.month - 1, date1.day);
      this.agentForm.get('expirationDate')?.setValue(  jsDate1);
      this.agentRegisterationForm.get('expirationDate')?.setValue(  jsDate1);
    }
    if (this.agentForm.invalid) {
      Object.keys(this.agentForm.controls).forEach((field) => {
        // {1}
        const control = this.agentForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    this.agentRegisterationForm.patchValue(this.agentForm.value);
    this.agentRegisterationForm.patchValue(this.representativeForm.value);

    if (
      this.agentRegisterationForm.valid &&
      this.agentRegisterationForm.value.termsAndConditions
    ) {
      this.hasError = false;
      this.showNotAgree = false;
      this.spinner.show();
      const loginSubscr = this.authService
        .registerAgentRepresentative(this.agentRegisterationForm.value)
        .pipe(first())
        .subscribe({
          next: (user) => {
            this.spinner.hide();
            const modalRef = this.modalService.open(
              AfterRegisterationSucComponent,
              {
                size: this.dialogSize,
                centered: true,
              }
            );
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          },
        });
      this.unsubscribe.push(loginSubscr);
    } else if (!this.agentRegisterationForm.value.agree) {
      this.agentForm
        .get('termsAndConditions')
        ?.markAsTouched({ onlySelf: true });
      this.toastr.error(
        this.translate.instant('AgentRegisteration.TermsConditionsChecked')
      );
      this.showNotAgree = true;
    } else {
      this.toastr.error(
        this.translate.instant('AgentRegisteration.FormValidationError')
      );
    }
  }

  public valid() {
    Object.keys(this.representativeForm.controls).forEach((field) => {
      // {1}
      const control = this.representativeForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
