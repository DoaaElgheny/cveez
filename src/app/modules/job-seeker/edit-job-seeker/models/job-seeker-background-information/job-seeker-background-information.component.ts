import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Gender } from 'src/app/services/enums/gender.enum';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';
@Component({
  selector: 'app-job-seeker-background-information',
  templateUrl: './job-seeker-background-information.component.html',
  styleUrls: ['./job-seeker-background-information.component.scss'],
})
export class JobSeekerBackgroundInformationComponent
  implements OnInit, OnDestroy
{
  seekerForm: FormGroup;
  PhoneNumberFormat: any;
  SearchCountryField: any;
  hasError: boolean = false;
  private isLoading$: Observable<boolean>;
  showNotAgree: boolean = false;
  countriesList: Array<any> = [];
  nationalitiesList: Array<any> = [];
  genderList: any = Gender;
  skillsList: any = [];
  qualificationsList: any = [];
  specializationsList: any = [];
  jobTitlesList: any = [];
  yearsExperiencesList: any = [];
  jobLevels: any = [];
  private unsubscribe: Subscription[] = [];
  successLoad = false;
  lang: string = String(localStorage.getItem('language'));
  dropdownSettings: IDropdownSettings = {};
  dropdownSkillsSettings: IDropdownSettings = {};
  seekerData: any;
  name = this.lang === 'ar' ? 'nameAr' : 'nameEn';
  cvAttachementName: any;
  cvAttachementFileStorageName: any;
  vedioAttachementName: any;
  vedioAttachementFileStorageName: any;
  logoAttachementName: any;
  logoAttachementFileStorageName: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private generalServices: GeneralServicesService,
    private JobSeekerServices: JobSekerManagementService
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.initForm();
    this.getData();
    this.successLoad = true;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: this.name,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };

    this.dropdownSkillsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'number',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };
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
      birthDate: ['', Validators.compose([Validators.required])],
      linkedIn: [''],
      cvAttachementName: [],
      cvAttachementFileStorageName: [null, Validators.compose([Validators.required])],
      vedioAttachementName: [],
      vedioAttachementFileStorageName: [],
      linkVedio: [],
      summary: ['', Validators.compose([Validators.required])],
      jobLevelId: [null, Validators.compose([Validators.required])],
      yearsExperienceId: [null, Validators.compose([Validators.required])],
   
      qualifications: [[], Validators.compose([Validators.required])],
      skills: [[], Validators.compose([Validators.required])],
      titles: [[], Validators.compose([Validators.required])],
      specializations: [[], Validators.compose([Validators.required])],
      isWantFeelChances: [false],
      attachementFileStorageName: [],
      attachementName: [],
    });
  }

  getData() {
    this.seekerForm.patchValue(this.seekerData);

    let birthDate = new Date(this.seekerData?.birthDate);
    var ngbDateStruct = {
      day: birthDate.getDate(),
      month: birthDate.getMonth() + 1,
      year: birthDate.getFullYear(),
    };
    this.seekerForm.get('birthDate')?.setValue(ngbDateStruct);
    this.seekerForm.get('jobLevelId')?.setValue(this.seekerData?.jobLevel?.id);
    this.seekerForm
      .get('yearsExperienceId')
      ?.setValue(this.seekerData?.yearsExperience?.id);
    this.cvAttachementName = this.seekerData?.cvAttachementFileStorageName;
    this.cvAttachementFileStorageName =
      this.seekerData?.cvAttachementFileStorageURL;
    this.vedioAttachementName =
      this.seekerData?.vedioAttachementFileStorageName;
    this.vedioAttachementFileStorageName =
      this.seekerData?.vedioAttachementFileStorageURL;
    this.logoAttachementName = this.seekerData?.attachementName;
    this.logoAttachementFileStorageName =
      this.seekerData?.attachementFileStorageName;

    forkJoin([
      this.generalServices.getJobTitles(),
      this.generalServices.getQualifications(),
      this.generalServices.getJobLevel(),
      this.generalServices.getSpecializations(),
      this.generalServices.getYearsExperiences(),
      this.generalServices.getSkills(),
    ]).subscribe({
      next: ([
        jobTitlesList,
        qualifications,
        jobLevels,
        specializations,
        yearsExperiences,
        skills,
      ]) => {
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
      },
    });
  }

  checkDate(event: any) {
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

  onItemSelect(item: any, selectFrom: any, object: any) {
    let newArray: Array<any> = [];
    object.selectedItems.forEach((element: any) => {
      newArray.push(element?.id);
    });
    // this.seekerForm.get(selectFrom)?.setValue(newArray);
  }

  onSelectAll(items: any, selectFrom: any, object: any) {
    let newArray: Array<any> = [];
    object.selectedItems.forEach((element: any) => {
      newArray.push(element.id);
    });
    // this.seekerForm.get(selectFrom)?.setValue(newArray);
  }

  uploadPersonalImg(data: any) {
    this.seekerForm.get('attachementName')?.setValue(data.storageFileName);
    this.seekerForm
      .get('attachementFileStorageName')
      ?.setValue(data.storageFileName);
  }

  uploadCVAttachement(data: any) {
    this.seekerForm.get('cvAttachementName')?.setValue(data.storageFileName);
    this.seekerForm
      .get('cvAttachementFileStorageName')
      ?.setValue(data.storageFileName);
  }

  uploadVedioAttachement(data: any) {
    this.seekerForm.get('vedioAttachementName')?.setValue(data.storageFileName);
    this.seekerForm
      .get('vedioAttachementFileStorageName')
      ?.setValue(data.storageFileName);
  }

  deleteCV() {
    this.cvAttachementName = null;
    this.cvAttachementFileStorageName = null;
    this.seekerForm.get('cvAttachementFileStorageName')?.setValue(null);
    this.seekerForm.get('cvAttachementFileStorageName')?.setValue(null);
  }

  deleteVedio() {
    this.vedioAttachementName = null;
    this.vedioAttachementFileStorageName = null;
    this.seekerForm.get('vedioAttachementName')?.setValue(null);
    this.seekerForm.get('vedioAttachementFileStorageName')?.setValue(null);
  }

  submit() {
    if (this.seekerForm.invalid) {
      Object.keys(this.seekerForm.controls).forEach((field) => {
        // {1}
        const control = this.seekerForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    if(this.seekerForm.value.skills.length==0){
      return;
    }

    if (this.seekerForm.valid) {
      this.spinner.show();
      let myDate = this.seekerForm.value.birthDate;
      const date: NgbDate = new NgbDate(myDate.year, myDate.month, myDate.day);
      const jsDate = new Date(date.year, date.month - 1, date.day + 1);
      this.seekerForm.get('birthDate')?.setValue(jsDate);
      let newArray: Array<any> = [];
      this.seekerForm.get('titles')?.value.forEach((element: any) => {
        newArray.push(element?.id);
      });
      this.seekerForm.get('titles')?.setValue(newArray);

      newArray = [];
      this.seekerForm.get('specializations')?.value.forEach((element: any) => {
        newArray.push(element?.id);
      });
      this.seekerForm.get('specializations')?.setValue(newArray);

      newArray = [];
      this.seekerForm.get('qualifications')?.value.forEach((element: any) => {
        newArray.push(element?.id);
      });
      this.seekerForm.get('qualifications')?.setValue(newArray);

      newArray = [];
      this.seekerForm.get('skills')?.value.forEach((element: any) => {
        newArray.push(element?.id);
      });
      this.seekerForm.get('skills')?.setValue(newArray);

      this.hasError = false;
      this.showNotAgree = false;
      const loginSubscr = this.JobSeekerServices.editJobSeekerSkills(
        this.seekerForm.value
      )
        .pipe(first())
        .subscribe({
          next: (user) => {
            this.spinner.hide();
            this.toastr.success(
              this.translate.instant('facility.updateSuccess')
            );

            this.modalService.dismissAll('Cross click');
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          },
        });
      this.unsubscribe.push(loginSubscr);
    } else {
      this.toastr.error(
        this.translate.instant('AgentRegisteration.FormValidationError')
      );
    }
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
