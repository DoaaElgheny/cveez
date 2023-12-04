import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';
import { JobSeekerVerificationCodeComponent } from '../job-seeker-verification-code/job-seeker-verification-code.component';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { Gender } from 'src/app/services/enums/gender.enum';

@Component({
  selector: 'app-job-seeker-information',
  templateUrl: './job-seeker-information.component.html',
  styleUrls: ['./job-seeker-information.component.scss'],
})
export class JobSeekerInformationComponent implements OnInit, OnDestroy {
  public seekerForm: FormGroup;
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public countriesList: Array<any> = [];
  public nationalitiesList: Array<any> = [];
  public genderList: any = Gender;
  private unsubscribe: Subscription[] = [];
  public lang: string = String(localStorage.getItem('language'));
  public selectedCountryIso: any;
  public successLoad = false;
  mobileNumber: string | null = null;
  oldEmail: any;
  public seekerData: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private jobSeekerManagementService: JobSekerManagementService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private generalService: GeneralServicesService
  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
  }

  ngOnInit(): void {
    this.getProfileData();
    this.generalService.getCountriesList().subscribe({
      next: (value) => {
        this.countriesList = value;
        this.generalService.getNationalitesList().subscribe({
          next: (nationalities) => {
            this.nationalitiesList = nationalities;
          },
          error: (err) => {},
        });
      },
      error: (err) => {},
    });
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  initForm() {
    this.seekerForm = this.fb.group({
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
      countryCodeIso: ['sa'],
      countryId: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      nationalityId: ['', Validators.compose([Validators.required])],
      birthDate: ['', Validators.compose([Validators.required])],
    });
  }

  getProfileData() {
    this.spinner.show();

    const indexOfS = Object.values(this.CountryISO).indexOf(
      this.seekerData?.countryCodeIso as unknown as CountryISO | 'eg'
    );

    const key = Object.keys(this.CountryISO)[indexOfS];
    this.selectedCountryIso = key;
    this.oldEmail = this.seekerData?.email;
    this.initForm();
    this.mobileNumber = this.seekerData?.mobileNumber;

    this.seekerForm.patchValue(this.seekerData);
    let birthDate = new Date(this.seekerData?.birthDate);
    var ngbDateStruct = {
      day: birthDate.getDate(),
      month: birthDate.getMonth() + 1,
      year: birthDate.getFullYear(),
    };
    this.seekerForm.get('birthDate')?.setValue(ngbDateStruct);
    this.seekerForm.get('countryId')?.setValue(this.seekerData?.country?.id);
    this.seekerForm
      .get('nationalityId')
      ?.setValue(this.seekerData?.nationality?.id);
    this.mobileNumber = this.seekerData?.mobileNumber;
    this.successLoad = true;
    this.spinner.hide();
    this.cdr.detectChanges();
  }

  public checkDate(event: any) {
    const currentDate = new Date();
    let date = new Date(event.target.value);

    if (date.getFullYear() > currentDate.getFullYear()) {
      this.seekerForm.get('birthDate')?.markAsTouched({ onlySelf: true });
      this.seekerForm.get('birthDate')?.setErrors({ inFuture: true });
      return;
    } else if (date.getFullYear() == currentDate.getFullYear()) {
      if (date.getMonth() > currentDate.getMonth()) {
        this.seekerForm.get('birthDate')?.markAsTouched({ onlySelf: true });
        this.seekerForm.get('birthDate')?.setErrors({ inFuture: true });
        return;
      } else if (date.getMonth() == currentDate.getMonth()) {
        if (date.getDate() >= currentDate.getDate()) {
          this.seekerForm.get('birthDate')?.markAsTouched({ onlySelf: true });
          this.seekerForm.get('birthDate')?.setErrors({ inFuture: true });
          return;
        } else {
          this.seekerForm.get('birthDate')?.markAsUntouched({ onlySelf: true });
          return;
        }
      }
    } else {
      this.seekerForm.get('birthDate')?.markAsUntouched({ onlySelf: true });
      return;
    }
  }

  public submit() {
    if (this.seekerForm.invalid) {
      Object.keys(this.seekerForm.controls).forEach((field) => {
        // {1}
        const control = this.seekerForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }

    this.seekerForm
      .get('countryCode')
      ?.setValue(parseInt(this.seekerForm.value.countryCode));
    this.seekerForm
      .get('countryId')
      ?.setValue(parseInt(this.seekerForm.value.countryId));
    this.seekerForm
      .get('nationalityId')
      ?.setValue(parseInt(this.seekerForm.value.nationalityId));

    let myDate = this.seekerForm.value.birthDate;
    const date: NgbDate = new NgbDate(myDate.year, myDate.month, myDate.day);
    const jsDate = new Date(date.year, date.month - 1, date.day + 1);
    this.seekerForm.get('birthDate')?.setValue(jsDate);

    if (this.oldEmail != this.seekerForm.get('email')?.value) {
      this.generalService
        .getCode(this.seekerForm.get('email')?.value)
        .subscribe({
          next: (res: any) => {
            this.spinner.hide();
            const verificationModel = this.modalService.open(
              JobSeekerVerificationCodeComponent,
              {
                size: 'md',
                keyboard: false,
                centered: true,
              }
            );
            verificationModel.componentInstance.email = this.oldEmail;
            verificationModel.componentInstance.Newemail=
            this.seekerForm.get('email')?.value
      
            verificationModel.componentInstance.formvalue =
              this.seekerForm.value;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          },
        });
    } else {
      this.spinner.show();
      this.jobSeekerManagementService
        .editJobSeeker(this.seekerForm.value)
        .subscribe({
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
            this.seekerForm.get('birthDate')?.setValue(myDate);
          },
        });
    }
  }

  public onInputChange(event: any) {
    if (event.isNumberValid) {
      this.seekerForm
        .get('mobileNumber')
        ?.setValue(
          event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
        );
      this.seekerForm.get('countryCode')?.setValue(event.dialCode);
      this.seekerForm.get('countryCodeIso')?.setValue(event.iso2Code);
    } else {
      this.seekerForm.get('mobileNumber')?.markAsTouched({ onlySelf: true });
      this.seekerForm.get('mobileNumber')?.setErrors({ required: true });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
