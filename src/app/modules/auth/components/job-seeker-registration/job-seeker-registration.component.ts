import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, forkJoin } from 'rxjs';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ConfirmEmailValidator } from 'src/app/modules/SharedComponent/helper/confirm-email.validator';
import { ConfirmPasswordValidator } from 'src/app/modules/SharedComponent/helper/confirm-password.validator';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AfterRegisterationSucComponent } from '../after-registeration-suc/after-registeration-suc.component';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { Gender } from 'src/app/services/enums/gender.enum';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-job-seeker-registration',
  templateUrl: './job-seeker-registration.component.html',
  styleUrls: ['./job-seeker-registration.component.scss'],
})
export class JobSeekerRegistrationComponent implements OnInit, OnDestroy {
  public seekerRegisterationForm: FormGroup;
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public hasError: boolean = false;
  private isLoading$: Observable<boolean>;
  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;
  public showNotAgree: boolean = false;
  public countriesList: Array<any> = [];
  public nationalitiesList: Array<any> = [];
  public genderList: any = Gender;
  private unsubscribe: Subscription[] = [];
  public lang: string = String(localStorage.getItem('language'));
  private dialogSize: 'sm' | 'lg' = 'sm';
  public dropdownSettings: IDropdownSettings = {};
  public jobTitlesList: any = [];
  public name = this.lang === 'ar' ? 'nameAr' : 'nameEn';
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthService,
    private generalServices: GeneralServicesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.initForm();
    this.getData();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: this.name,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  public getData() {
    this.spinner.show();

    forkJoin([
      this.generalServices.getCountriesList(),
      this.generalServices.getNationalitesList(),
      this.generalServices.getJobTitles(),
    ]).subscribe({
      next: ([countriesList, nationalitiesList, jobTitlesList]) => {
        this.countriesList = countriesList;
        this.nationalitiesList = nationalitiesList;
        this.jobTitlesList = jobTitlesList;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
        console.log(err);
      },
    });
  }
  public initForm() {
    this.seekerRegisterationForm = this.fb.group(
      {
        fullName: [
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
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(ValidationPattern.Password),
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
        countryId: [null, Validators.compose([Validators.required])],
        nationalityId: [null, Validators.compose([Validators.required])],
        termsAndConditions: [null, Validators.compose([Validators.required])],
        titles: [null, Validators.compose([Validators.required])],
        titlesView: [[], Validators.compose([Validators.required])],
      }
    );
  }

  public togglePasswordVisibilty() {
    this.showPassword = !this.showPassword;
  }
  public onInputChange(event: any) {
    if (event.isNumberValid) {
      this.seekerRegisterationForm
        .get('mobileNumber')
        ?.setValue(
          event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
        );
      this.seekerRegisterationForm.get('countryCode')?.setValue(event.dialCode);
      this.seekerRegisterationForm
        .get('countryCodeIso')
        ?.setValue(event.iso2Code);
    } else {
      this.seekerRegisterationForm
        .get('mobileNumber')
        ?.markAsTouched({ onlySelf: true });
      this.seekerRegisterationForm
        .get('mobileNumber')
        ?.setErrors({ required: true });
    }
  }
  onItemSelect(item: any, selectFrom: any, object: any) {
    let newArray: Array<any> = [];
    object.selectedItems.forEach((element: any) => {
      newArray.push(element.id);
    });
    this.seekerRegisterationForm.get(selectFrom)?.setValue(newArray);
  }

  onSelectAll(items: any, selectFrom: any, object: any) {
    let newArray: Array<any> = [];
    object.selectedItems.forEach((element: any) => {
      newArray.push(element.id);
    });
    this.seekerRegisterationForm.get(selectFrom)?.setValue(newArray);
  }

  public submit() {
    if (this.seekerRegisterationForm.get('nationalityId')?.value == 'null') {
      this.seekerRegisterationForm.get('nationalityId')?.setValue(null);
      this.seekerRegisterationForm
        .get('nationalityId')
        ?.markAsTouched({ onlySelf: true });
    }
    if (this.seekerRegisterationForm.get('countryId')?.value == 'null') {
      this.seekerRegisterationForm.get('countryId')?.setValue(null);
      this.seekerRegisterationForm
        .get('countryId')
        ?.markAsTouched({ onlySelf: true });
    }

    if (this.seekerRegisterationForm.invalid) {
      Object.keys(this.seekerRegisterationForm.controls).forEach((field) => {
        // {1}
        const control = this.seekerRegisterationForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    if (
      this.seekerRegisterationForm.valid &&
      this.seekerRegisterationForm.value.termsAndConditions
    ) {
      this.hasError = false;
      this.showNotAgree = false;
      this.spinner.show();
      const loginSubscr = this.authService
        .registerJobSeeker(this.seekerRegisterationForm.value)
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
            console.log(err);
          },
        });
      this.unsubscribe.push(loginSubscr);
    } else if (!this.seekerRegisterationForm.value.agree) {
      this.toastr.error(
        this.translate.instant('AgentRegisteration.TermsConditionsChecked'),
        '',
        { timeOut: 7000 }
      );
      this.showNotAgree = true;
    } else {
      this.toastr.error(
        this.translate.instant('AgentRegisteration.FormValidationError'),
        '',
        { timeOut: 7000 }
      );
    }
  }

  public redirectTo() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
