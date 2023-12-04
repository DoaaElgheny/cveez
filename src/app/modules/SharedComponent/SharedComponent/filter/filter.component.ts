import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { Gender } from 'src/app/services/enums/gender.enum';
import { Options } from '@angular-slider/ngx-slider';
import { TranslateService } from '@ngx-translate/core';
import { ManageClassificationService } from 'src/app/services/api/manage-classification.service';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { AgentOpportunityService } from 'src/app/services/api/agent-opportunity.service';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';
import { PackageConditionService } from 'src/app/services/common/package-condition.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  @Input() isJobSearch = false;
  @Input() text: String;
  @Input() seachKey: any;
  @Input() isShowAgents: boolean = false;
  @Input() isShowClassifications: boolean = false;
  @Input() isShowJobTypes: boolean = false;
  @Input() isShowJobHours: boolean = false;
  @Input() isShowYearsExperience: boolean = false;
  @Input() isShowOpportunities: boolean = false;
  @Input() isShowSkills: boolean = false;
  @Input() opportunityId: any = null;
  @Input() countryId: any = null;
  @Input() classificationId: any = null;
  @Output() searchChanged: EventEmitter<any> = new EventEmitter<any>();
  countriesList = [];
  firstInit = 0;
  nationalitiesList: any = [];
  flilterLength = 0;
  skillsList: any = [];
  qualificationsList: any = [];
  specializationsList: any = [];
  jobTitlesList: any = [];
  yearsExperiencesList: any = [];
  jobLevels: any = [];
  agentsList: Array<any> = [];
  classificationsList: Array<any> = [];
  jobHoursList: Array<any> = [];
  jobTypesList: Array<any> = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsSearch: IDropdownSettings = {};
  dropdownSettingsSingle: IDropdownSettings = {};
  dropdownSettingsGenderSingle: IDropdownSettings = {};
  dropdownSkillsSettings: IDropdownSettings = {};
  dropdownHoursSettings: IDropdownSettings = {};
  dropdownOpportunitiesSettings: IDropdownSettings = {};
  genderList = Gender;
  genders: Array<any> = [];
  OpportunitiesList: Array<any> = [];
  lang: string = String(localStorage.getItem('language'));
  name = this.lang === 'ar' ? 'nameAr' : 'nameEn';
  all = this.lang === 'ar' ? 'الكل' : 'All';
  unall = this.lang === 'ar' ? 'إلغاء الكل' : 'UnSelect All';
  searchText: string = this.lang === 'ar' ? 'بحث' : 'Search';
  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 18,
    ceil: 100,
  };
  paymentType: any = 0;
  payment: any = Payment;

  private unsubscribe: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private generalServices: GeneralServicesService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,

    private translateService: TranslateService,
    private manageAgentServices: AgentManagementService,
    private manageClassificationService: ManageClassificationService,
    private agentOpportunitiesService: AgentOpportunityService,
    private packageConditionService: PackageConditionService
  ) {}

  ngOnInit(): void {
    this.packageConditionService.paymentType$.subscribe((val: any) => {
      this.paymentType = val;
      if (parseInt(this.paymentType) === this.payment.Expired) {
        this.isShowAgents = false;
      }
    });
    this.initForm();
    this.getData();
    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: 'id',
      textField: this.name,
      selectAllText: this.all,
      unSelectAllText: this.unall,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: this.searchText,
    };

    this.dropdownSettingsSearch = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: this.all,
      unSelectAllText: this.unall,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: this.searchText,
    };

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: this.name,
      selectAllText: this.all,
      unSelectAllText: this.unall,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: this.searchText,
    };

    this.dropdownOpportunitiesSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'jobTitle',
      selectAllText: this.all,
      unSelectAllText: this.unall,
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };

    this.dropdownHoursSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'hours',
      selectAllText: this.all,
      unSelectAllText: this.unall,
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };

    this.dropdownSkillsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'number',
      selectAllText: this.all,
      unSelectAllText: this.unall,
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };

    this.searchForm.get('countryId')?.setValue(this.countryId);

    if (
      location.pathname === '/client/favorite-search' ||
      location.pathname.includes('client/manage-agent-orders')
    ) {
      this.submitForm();
    }
  
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      agentsDataView: [null],
      agents: [null],

      classificationsDataView: [null],
      classifications: [],

      opportunitiesDataView: [null],
      opportunityId: [null],

      gender: [null], //multi
      genderDataView: [null],

      titles: [null], //multi
      titlesDataView: [null], //multi

      specializations: [null], //multi
      specializationsDataView: [null], //multi

      levels: [null], //multi
      levelsDataView: [null], //multi

      qualifications: [null], //multi
      qualificationsDataView: [null], //multi

      skills: [null], //multi
      skillsDataView: [null], //multi

      yearsExperience: [null], //multi
      yearsExperienceDataView: [null], //multi

      jobHours: [null], //multi
      jobHoursDataView: [null], //multi

      jobTypes: [null], //multi
      jobTypesDataView: [null], //multi

      nationalityId: [null],
      nationalityIdDataView: [null],

      countryId: [null],
      countryIdDataView: [null],
      CountryName: [null],

      minAge: [null], // number
      maxAge: [null], // number
    });

    // if (this.countryId) {
    //   this.changeOfferType(this.offerType);
    // }
    // setTimeout(() => {
    //   this.submitForm();
    // }, 100);
  }

  public getData() {
    forkJoin([
      this.generalServices.getCountriesList(),
      this.generalServices.getNationalitesList(),
      this.generalServices.getJobTitles(),
      this.generalServices.getQualifications(),
      this.generalServices.getJobLevel(),
      this.generalServices.getSpecializations(),
    ]).subscribe({
      next: ([
        countriesList,
        nationalitiesList,
        jobTitlesList,
        qualifications,
        jobLevels,
        specializations,
      ]) => {
        this.countriesList = countriesList;
        this.searchForm.get('countryIdDataView')?.setValue(
          this.countriesList?.filter((item: any) => {
            if (item.id == this.countryId) {
              return item;
            }
          })
        );
        this.nationalitiesList = nationalitiesList;
        this.jobTitlesList = jobTitlesList;
        this.qualificationsList = qualifications;
        this.jobLevels = jobLevels;
        this.specializationsList = specializations;
      },
      error: (err) => {
        this.toastr.error(err.error.error.message);
      },
    });

    if (this.isShowAgents) {
      this.manageAgentServices.getAgents().subscribe({
        next: (agentsList) => {
          this.agentsList = agentsList;
        },
        error: (err) => {
          this.toastr.error(err.error.error.message);
        },
      });
    }

    if (this.isShowOpportunities) {
      this.agentOpportunitiesService
        .getOpportunitiesList({ IsAccepted: true })
        .subscribe({
          next: (Opportunities) => {
            this.OpportunitiesList = Opportunities;
            this.searchForm.get('opportunitiesDataView')?.setValue(
              this.OpportunitiesList?.filter((item) => {
                if (item.id == this.opportunityId) {
                  return item;
                }
              })
            );
          },
          error: (err) => {
            this.toastr.error(err.error.error.message);
          },
        });
    }

    if (this.isShowClassifications) {
      this.manageClassificationService.getClassificationsList().subscribe({
        next: (classificationsList) => {
          this.classificationsList = classificationsList;
          this.searchForm.get('classificationsDataView')?.setValue(
            this.classificationsList?.filter((item) => {
              if (item.id == this.classificationId) {
                return item;
              }
            })
          );
        },
        error: (err) => {
          this.toastr.error(err.error.error.message);
        },
      });
    }

    if (this.isShowJobHours) {
      this.generalServices.getJobHours().subscribe({
        next: (jobHours) => {
          this.jobHoursList = jobHours;
        },
        error: (err) => {
          this.toastr.error(err.error.error.message);
        },
      });
    }

    if (this.isShowJobTypes) {
      this.generalServices.getJobTypes().subscribe({
        next: (jobTypes) => {
          this.jobTypesList = jobTypes;
        },
        error: (err) => {
          this.toastr.error(err.error.error.message);
        },
      });
    }

    if (this.isShowYearsExperience) {
      this.generalServices.getYearsExperiences().subscribe({
        next: (yearsExperiences) => {
          this.yearsExperiencesList = yearsExperiences;
        },
        error: (err) => {
          this.toastr.error(err.error.error.message);
        },
      });
    }

    if (this.isShowSkills) {
      this.generalServices.getSkills().subscribe({
        next: (skills) => {
          this.skillsList = skills;
        },
        error: (err) => {
          this.toastr.error(err.error.error.message);
        },
      });
    }

    this.cdr.detectChanges();

    this.genders = [
      {
        id: this.genderList.All,
        nameAr: this.translateService.instant(
          'Shared.Gender.' + this.genderList.All
        ),
        nameEn: this.translateService.instant(
          'Shared.Gender.' + this.genderList.All
        ),
      },
      {
        id: this.genderList.Male,
        nameAr: this.translateService.instant(
          'Shared.Gender.' + this.genderList.Male
        ),
        nameEn: this.translateService.instant(
          'Shared.Gender.' + this.genderList.Male
        ),
      },
      {
        id: this.genderList.Female,
        nameAr: this.translateService.instant(
          'Shared.Gender.' + this.genderList.Female
        ),
        nameEn: this.translateService.instant(
          'Shared.Gender.' + this.genderList.Female
        ),
      },
    ];

    if (this.router.url.includes('client/job-search')) {
      this.genders.push({
        id: this.genderList.MaleAndFemale,
        nameAr: this.translateService.instant(
          'Shared.Gender.' + this.genderList.MaleAndFemale
        ),
        nameEn: this.translateService.instant(
          'Shared.Gender.' + this.genderList.MaleAndFemale
        ),
      });
    }
  }

  onItemSelectSingle(item: any, selectFrom?: any) {
    this.searchForm.get(selectFrom)!.setValue(item.id);
    if (selectFrom == 'opportunityId') {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() =>
          this.router.navigate(['client/manage-agent-orders/' + item.id])
        );
    }
    this.submitForm();
  }

  onItemDeSelectSingle(selectFrom?: any) {
    this.searchForm.get(selectFrom)!.setValue(null);
    if (this.router.url.includes('/job-search')) {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/client/job-search']));
    } else if (this.router.url.includes('/favorite-search')) {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/client/favorite-search']));
    } else {
      if (selectFrom === 'opportunityId') {
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() =>
            this.router.navigate(['/client/manage-agent-orders/' + 0])
          );
      } else {
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() =>
            this.router.navigate([
              '/client/manage-agent-orders/' + this.opportunityId,
            ])
          );
      }
    }
    this.submitForm();
  }

  onItemSelect(selectFrom?: any, object?: any) {
    let newArray: Array<any> = [];
    object.selectedItems.forEach((element: any) => {
      newArray.push(element?.id);
    });
    this.searchForm.get(selectFrom)!.setValue(newArray);
    this.submitForm();
  }

  submitForm() {
    // this.flilterLength = 0;
    // Object.keys(this.searchForm.value).forEach((k) => {
    //   if (this.searchForm.value[k] != null) {
    //     this.flilterLength=this.flilterLength+1;
    //   }
    // });

    this.searchChanged.emit(this.searchForm.value);
  }

  resetForm() {
    if (this.router.url.includes('/job-search')) {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/client/job-search']));
    } else if (this.router.url.includes('/favorite-search')) {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/client/favorite-search']));
    } else {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() =>
          this.router.navigate([
            '/client/manage-agent-orders/' + this.opportunityId,
          ])
        );
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
