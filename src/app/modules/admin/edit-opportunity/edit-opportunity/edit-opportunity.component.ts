import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { AgentOpportunityService } from 'src/app/services/api/agent-opportunity.service';
import { Gender } from 'src/app/services/enums/gender.enum';
import { Location } from '@angular/common';
import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';
@Component({
  selector: 'app-edit-opportunity',
  templateUrl: './edit-opportunity.component.html',
  styleUrls: ['./edit-opportunity.component.scss'],
})
export class EditOpportunityComponent implements OnInit {
  public opportunitiesForm: FormGroup;
  public hasError: boolean = false;
  private isLoading$: Observable<boolean>;
  public genderList = Gender;
  public qualificationsList: any = [];
  public specializationsList: any = [];
  public jobTitlesList: any = [];
  public yearsExperiencesList: any = [];
  public jobLevels: any = [];
  public jobTypes: any = [];
  public country: any = [];
  public salaryRanges: any = [];
  public probationPeriods: any = [];
  public jobHours: any = [];
  public ageRanges: any = [];
  public professionalCertificates: any = [];
  public classificationList: any = [];
  private unsubscribe: Subscription[] = [];
  public successLoad = false;
  public lang: string = String(localStorage.getItem('language'));

  public dropdownSettings: IDropdownSettings = {};
  dropdownSettingsSingle: IDropdownSettings = {};
  public dropdownSkillsSettings: IDropdownSettings = {};

  public name = this.lang === 'ar' ? 'nameAr' : 'nameEn';
  all = this.lang === 'ar' ? 'الكل' : 'All';
  unall = this.lang === 'ar' ? 'إلغاء الكل' : 'UnSelect All';
  attachment: any;
  id: any;
  isMore = false;
  jobTitleRequired = false;
  agentId: any;
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private opportunityServices: AgentOpportunityService,
    private opportunityAdmin: ManageOpportunityService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) {}

  moresixteen(event: any) {
    if (Number(event.target.value) > 60) {
      this.isMore = true;
    } else {
      this.isMore = false;
    }
  }

  ngOnInit(): void {
    this.id = parseInt(String(this.activeRoute.snapshot.paramMap.get('id')));
    this.agentId = parseInt(
      String(this.activeRoute.snapshot.paramMap.get('agentId'))
    );
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
      allowSearchFilter: false,
    };

    this.dropdownSettingsSingle = {
      singleSelection: true,
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
      allowSearchFilter: false,
    };
  }

  public initForm() {
    this.opportunitiesForm = this.fb.group({
      id: [],
      jobTitleId: [null],
      titlesDataView: [],
      jobTitleName: [null],
      jobLevelId: [, Validators.compose([Validators.required])],
      jobLevelsDataView: [],
      jobTypeId: [, Validators.compose([Validators.required])],
      countryId: [, Validators.compose([Validators.required])],
      salaryRangeId: [],
      probationPeriodId: [],
      jobHourId: [],
      announceDetailsAttachementName: [],
      announceDetailsAttachementFileStorageName: [],
      jobDescription: [],
      isHideCompanyName: false,
      // periodExpiration: [
      //   ,
      //   Validators.compose([
      //     Validators.required,
      //     Validators.max(60),
      //     Validators.min(1),
      //     Validators.pattern('^[0-9]+([.][0-9]+)?$'),
      //   ]),
      // ],
      isAttachAnnounceDetails: false,
      announceDetails: [],
      isHealthInsurance: false,
      isHousingAllowance: false,
      isTravelTicketAllowance: false,
      isTransportationAllowance: false,
      isPossibleWorkingRemotly: false,
      yearsExperienceId: [, Validators.compose([Validators.required])],
      ageRangeId: [, Validators.compose([Validators.required])],
      gender: [, Validators.compose([Validators.required])],
      classificationId: [, Validators.compose([Validators.required])],
      specializations: [, Validators.compose([Validators.required])],
      qualifications: [, Validators.compose([Validators.required])],
    });
  }

  getData() {
    forkJoin([
      this.opportunityServices.getJobTitlesForOpportunity(this.agentId),
      this.opportunityServices.getQualifications(),
      this.opportunityServices.getAgeRanges(),
      this.opportunityServices.getSpecializations(),
      this.opportunityServices.getYearsExperiences(),
      this.opportunityServices.getClassificationList(),
      this.opportunityServices.getJobLevels(),
      this.opportunityServices.getJobTypes(),
      this.opportunityServices.getCountry(),
      this.opportunityServices.getSalaryRanges(),
      this.opportunityServices.getProbationPeriods(),
      this.opportunityServices.getJobHours(),
      this.opportunityServices.getProfessionalCertificates(),
    ]).subscribe({
      next: ([
        jobTitlesList,
        qualifications,
        ageRange,
        specializations,
        yearsExperiences,
        classificationList,
        jobLevels,
        jobTypes,
        country,
        salaryRanges,
        probationPeriods,
        jobHours,
        professionalCertificates,
      ]) => {
        this.jobTitlesList = jobTitlesList;
        this.qualificationsList = qualifications;
        this.jobLevels = jobLevels;
        this.specializationsList = specializations;
        this.yearsExperiencesList = yearsExperiences;
        this.ageRanges = ageRange;
        this.classificationList = classificationList;
        this.jobTypes = jobTypes;
        this.salaryRanges = salaryRanges;
        this.country = country;
        this.probationPeriods = probationPeriods;
        this.jobHours = jobHours;
        this.professionalCertificates = professionalCertificates;

        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });

    if (this.id != 0) {
      this.opportunityServices.getbyId(this.id).subscribe(
        (res) => {
          this.opportunitiesForm.patchValue(res);
          this.opportunitiesForm.get('titlesDataView')?.setValue(
            this.jobTitlesList?.filter((item: any) => {
              if (item.id == res.jobTitleId) {
                return item;
              }
            })
          );
          this.opportunitiesForm.get('jobLevelsDataView')?.setValue(
            this.jobLevels?.filter((item: any) => {
              if (item.id == res.jobLevelId) {
                return item;
              }
            })
          );
          this.attachment = res.announceDetailsAttachementFileStorageUrl;

          this.cdr.detectChanges();
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        }
      );
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

  onItemSelectSingle(item: any, selectFrom?: any, object?: any) {
    this.opportunitiesForm.get(selectFrom)!.setValue(item.id);
    if (object) {
      object._placeholder = '';
    }
  }

  onItemDeSelectSingle(selectFrom?: any, object?: any) {
    this.opportunitiesForm.get(selectFrom)!.setValue(null);
    this.opportunitiesForm.get(selectFrom)!.markAllAsTouched();
  }

  onSearchResultt(object?: any) {
    let result = object._data?.filter((item: any) => {
      if (item.text === object.filter.text) {
        return item;
      }
    });

    if (result.length == 0) {
      object._placeholder = object.filter.text;
      this.opportunitiesForm.get('jobTitleId')?.setValue(null);
      this.opportunitiesForm.get('titlesDataView')?.setValue(null);
      this.opportunitiesForm.get('jobTitleName')?.setValue(object.filter.text);
    } else {
      this.opportunitiesForm.get('jobTitleName')?.setValue(null);
    }
  }

  public uploadfiles(data: any) {
    this.opportunitiesForm
      .get('announceDetailsAttachementName')
      ?.setValue(data.storageFileName);
    this.opportunitiesForm
      .get('announceDetailsAttachementFileStorageName')
      ?.setValue(data.storageFileName);
  }

  public submit() {
    if (
      this.opportunitiesForm.valid &&
      this.isMore == false &&
      (this.opportunitiesForm.get('jobTitleId')?.value != null ||
        this.opportunitiesForm.get('jobTitleName')?.value != null)
    ) {
      this.jobTitleRequired = false;
      let newArray: any[] = [];
      this.opportunitiesForm
        .get('specializations')
        ?.value.forEach((element: any) => {
          newArray.push(element?.id);
        });
      this.opportunitiesForm.get('specializations')?.setValue(newArray);

      let newArray2: any[] = [];
      this.opportunitiesForm
        .get('qualifications')
        ?.value.forEach((element: any) => {
          newArray2.push(element?.id);
        });
      this.opportunitiesForm.get('qualifications')?.setValue(newArray2);
      this.spinner.show();
      if (this.id != 0) {
        this.opportunityAdmin
          .editOpportunity(this.opportunitiesForm.value)
          .subscribe(
            (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('AddOpportunities.editSuccessful')
              );
              //DODO
              this.route.queryParams.subscribe((params) => {
                let obj = { params };
                this.router.navigate(['/admin/manage-opportunity'], {
                  queryParams: obj['params'],
                });
              });

              this.cdr.detectChanges();
            },
            (err) => {
              this.spinner.hide();
              this.toastr.error(err.error.error.message);
            }
          );
      } else {
      }
    } else {
      this.opportunitiesForm.get('jobTitleId')?.value === null &&
        this.opportunitiesForm.get('jobTitleName')?.value === null;
      {
        this.jobTitleRequired = true;
      }
      Object.keys(this.opportunitiesForm.controls).forEach((field) => {
        // {1}
        const control = this.opportunitiesForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true });
        return; // {3}\
      });
    }
  }

  backClicked() {
    this.route.queryParams.subscribe((params) => {
      let obj = { params };
      this.router.navigate(['/admin/manage-opportunity'], {
        queryParams: obj['params'],
      });
    });

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
