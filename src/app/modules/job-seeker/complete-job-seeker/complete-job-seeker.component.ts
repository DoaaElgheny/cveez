import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { Gender } from 'src/app/services/enums/gender.enum';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-complete-job-seeker',
  templateUrl: './complete-job-seeker.component.html',
  styleUrls: ['./complete-job-seeker.component.scss'],
})
export class CompleteJobSeekerComponent implements OnInit, OnDestroy {
  public completeStep1Form: FormGroup;
  public completeStep2Form: FormGroup;
  public completeForm: FormGroup;
  public seekerData: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public hasError: boolean = false;
  private isLoading$: Observable<boolean>;
  public showNotAgree: boolean = false;
  public countriesList: Array<any> = [];
  public nationalitiesList: Array<any> = [];
  public genderList: any = Gender;
  public skillsList: any = [];
  public qualificationsList: any = [];
  public specializationsList: any = [];
  public jobTitlesList: any = [];
  public yearsExperiencesList: any = [];
  public jobLevels: any = [];
  private unsubscribe: Subscription[] = [];
  public lang: string = String(localStorage.getItem('language'));
  public name = this.lang === 'ar' ? 'nameAr' : 'nameEn';
  public dropdownSettings: IDropdownSettings = {};
  public dropdownSkillsSettings: IDropdownSettings = {};

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthService,
    private generalServices: GeneralServicesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private JobSeekerServices: JobSekerManagementService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    this.JobSeekerServices.getJobSeekerById(0).subscribe({
      next: (seeker) => {
        this.seekerData = seeker;
        this.initFormData();
        this.getData();
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: this.name,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.dropdownSkillsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'number',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  public checkDate(event: any) {
    const currentDate = new Date();
    let date = new Date(event.target.value);

    if (date.getFullYear() > currentDate.getFullYear()) {
      this.completeStep2Form
        .get('birthDate')
        ?.markAsTouched({ onlySelf: true });
      this.completeStep2Form.get('birthDate')?.setErrors({ inFuture: true });
      return;
    } else if (date.getFullYear() == currentDate.getFullYear()) {
      if (date.getMonth() > currentDate.getMonth()) {
        this.completeStep2Form
          .get('birthDate')
          ?.markAsTouched({ onlySelf: true });
        this.completeStep2Form.get('birthDate')?.setErrors({ inFuture: true });
        return;
      } else if (date.getMonth() == currentDate.getMonth()) {
        if (date.getDate() >= currentDate.getDate()) {
          this.completeStep2Form
            .get('birthDate')
            ?.markAsTouched({ onlySelf: true });
          this.completeStep2Form
            .get('birthDate')
            ?.setErrors({ inFuture: true });
          return;
        } else {
          this.completeStep2Form
            .get('birthDate')
            ?.markAsUntouched({ onlySelf: true });
          return;
        }
      }
    } else {
      this.completeStep2Form
        .get('birthDate')
        ?.markAsUntouched({ onlySelf: true });
      return;
    }
  }

  public initForm() {
    this.completeStep1Form = this.fb.group({
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
      mobileNumber: [''],
      countryCode: [966],
      countryCodeIso: ['sa'],
      countryId: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      nationalityId: ['', Validators.compose([Validators.required])],
    });

    this.completeStep2Form = this.fb.group({
      birthDate: ['', Validators.compose([Validators.required])],
      attachementName: [],
      attachementFileStorageName: [],
      linkedIn: [''],
      cvAttachementName: [],
      cvAttachementFileStorageName: [
        ,
        Validators.compose([Validators.required]),
      ],
      vedioAttachementName: [],
      vedioAttachementFileStorageName: [],
      linkVedio: [],
      summary: [, Validators.compose([Validators.required])],
      jobLevelId: [, Validators.compose([Validators.required])],
      yearsExperienceId: [, Validators.compose([Validators.required])],
      qualifications: [[], Validators.compose([Validators.required])],
      qualificationsView: [[], Validators.compose([Validators.required])],
      skills: [[], Validators.compose([Validators.required])],
      skillsView: [[], Validators.compose([Validators.required])],
      titles: [[], Validators.compose([Validators.required])],
      titlesView: [[], Validators.compose([Validators.required])],
      specializations: [[], Validators.compose([Validators.required])],
      specializationsView: [[], Validators.compose([Validators.required])],
      isWantFeelChances: [false],
    });

    this.completeForm = this.fb.group({
      birthDate: ['', Validators.compose([Validators.required])],
      attachementName: [],
      attachementFileStorageName: [],
      linkedIn: [''],
      cvAttachementName: [],
      cvAttachementFileStorageName: [, Validators.compose([Validators.required])],
      vedioAttachementName: [],
      vedioAttachementFileStorageName: [],
      linkVedio: [],
      summary: [, Validators.compose([Validators.required])],
      jobLevelId: [, Validators.compose([Validators.required])],
      yearsExperienceId: [, Validators.compose([Validators.required])],
      qualifications: [[], Validators.compose([Validators.required])],
      skills: [[], Validators.compose([Validators.required])],
      titles: [[], Validators.compose([Validators.required])],
      specializations: [[], Validators.compose([Validators.required])],
      isWantFeelChances: [false],
    });
  }

  public getData() {
    this.spinner.show();

    forkJoin([
      this.generalServices.getCountriesList(),
      this.generalServices.getNationalitesList(),
      this.generalServices.getJobTitles(),
      this.generalServices.getQualifications(),
      this.generalServices.getJobLevel(),
      this.generalServices.getSpecializations(),
      this.generalServices.getYearsExperiences(),
      this.generalServices.getSkills(),
    ]).subscribe({
      next: ([
        countriesList,
        nationalitiesList,
        jobTitlesList,
        qualifications,
        jobLevels,
        specializations,
        yearsExperiences,
        skills,
      ]) => {
        
  
        // this.countriesList = countriesList.filter((item: any) => {
        //   if (item.id === this.seekerData?.country?.id) {
        //     return item;
        //   }
        // });
        // this.nationalitiesList = nationalitiesList.filter((item: any) => {
        //   if (item.id === this.seekerData?.nationality?.id) {
        //     return item;
        //   }
        // });
        this.countriesList = countriesList;
        this.nationalitiesList = nationalitiesList;
        this.jobTitlesList = jobTitlesList;

        this.qualificationsList = qualifications;

        this.jobLevels = jobLevels;

        this.specializationsList = specializations;

        this.yearsExperiencesList = yearsExperiences;

        this.skillsList = skills;

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

  public initFormData() {
    this.completeStep1Form.patchValue({
      fullName: this.seekerData?.fullName,
      gender: this.seekerData?.gender,
      email: this.seekerData?.email,
      mobileNumber:
        this.seekerData?.countryCode + this.seekerData?.mobileNumber,
      nationalityId: this.seekerData?.nationality?.id,
      countryId: this.seekerData?.country?.id,
    });
  }

  onItemSelect(item: any, selectFrom: any, object: any) {
    let newArray: Array<any> = [];
    object.selectedItems.forEach((element: any) => {
      newArray.push(element.id);
    });
    this.completeStep2Form.get(selectFrom)?.setValue(newArray);
  }

  onSelectAll(items: any, selectFrom: any, object: any) {
    let newArray: Array<any> = [];
    object.selectedItems.forEach((element: any) => {
      newArray.push(element.id);
    });
    this.completeStep2Form.get(selectFrom)?.setValue(newArray);
  }

  public uploadPersonalImg(data: any) {
    this.completeStep2Form
      .get('attachementName')
      ?.setValue(data.storageFileName);
    this.completeStep2Form
      .get('attachementFileStorageName')
      ?.setValue(data.storageFileName);
  }

  public uploadCVAttachement(data: any) {
    this.completeStep2Form
      .get('cvAttachementName')
      ?.setValue(data.storageFileName);
    this.completeStep2Form
      .get('cvAttachementFileStorageName')
      ?.setValue(data.storageFileName);
    this.completeStep2Form
      .get('cvAttachementFileStorageName')
      ?.markAsUntouched();
  }

  checkValue(event?: any) {
    this.completeStep2Form.get('cvAttachementFileStorageName')?.markAsTouched();
  }

  public uploadVedioAttachement(data: any) {
    this.completeStep2Form
      .get('vedioAttachementName')
      ?.setValue(data.storageFileName);
    this.completeStep2Form
      .get('vedioAttachementFileStorageName')
      ?.setValue(data.storageFileName);
  }

  public valid() {
    Object.keys(this.completeStep1Form.controls).forEach((field) => {
      // {1}
      const control = this.completeStep1Form.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });
  }

  public submit() {
    this.completeForm
      .get('birthDate')
      ?.setValue(this.completeStep2Form.value.birthDate);

  
  
    this.completeForm
      .get('attachementName')
      ?.setValue(this.completeStep2Form.value.attachementName);

    this.completeForm
      .get('attachementFileStorageName')
      ?.setValue(this.completeStep2Form.value.attachementFileStorageName);

    this.completeForm.patchValue(this.completeStep2Form.value);
    let myDate = this.completeForm.value.birthDate;
     
   
    if (this.completeForm.invalid) {
      Object.keys(this.completeForm.controls).forEach((field) => {
        // {1}
        const control = this.completeForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }

    if (this.completeForm.valid) {
      // let myDate = this.completeForm.value.birthDate;
      // const date: NgbDate = new NgbDate(myDate.year, myDate.month, myDate.day);
      // const jsDate = new Date(date.year, date.month - 1, date.day + 1);
      let myDate = this.completeForm.value.birthDate;
      var i = myDate.split('-');
      console.log(i)
       // =const date: NgbDate = new NgbDate(i[0], i[1], i[2]);
       const jsDate = new Date(i[0], i[1]-1, i[2]);
       console.log(jsDate)
      this.completeForm.get('birthDate')?.setValue(jsDate);
      
      this.completeForm.get('birthDate')?.setValue(jsDate);
      this.hasError = false;
      this.showNotAgree = false;
      this.spinner.show();
      const loginSubscr = this.JobSeekerServices.completeJobSeekerData(
        this.completeForm.value
      )
        .pipe(first())
        .subscribe({
          next: (user) => {
            this.spinner.hide();
            localStorage.setItem(
              'yearsExperienceId',
              JSON.stringify(this.completeForm.value.yearsExperienceId)
            );
            this.toastr.success(
              this.translate.instant('jobSeeker.ProfileCompletedSuccessfully')
            );
            this.router.navigate(['/auth/payment-package']);
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
            console.log(err);
          },
        });
      this.unsubscribe.push(loginSubscr);
    } else {
      this.toastr.error(
        this.translate.instant('AgentRegisteration.FormValidationError')
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
