import {
  ChangeDetectorRef,
  EventEmitter,
  Component,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from 'src/app/i18n';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { Location } from '@angular/common';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';
import { Constants } from 'src/app/services/Constants/constants';
import { PackageConditionService } from 'src/app/services/common/package-condition.service';
import { AuthService } from '../../auth/services/auth.service';
@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.scss'],
})
export class ViewJobComponent implements OnInit {
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  id: any;
  opportunity: any;
  Other: boolean = true;
  similarOpportunities: any;
  theLanguage: any;
  pageSize: number = 3;
  filter = this.initFilterObj();
  countrys: any;
  currentUser: any;
  yearsExperienceId: any;
  payment: any = Payment;

  logoConditions: boolean;
  ShowOpportunityCondition: boolean;

  paymentType: any;
  roles = Constants.AllRoles;
  currentUserOfLogin:any;

  constructor(
    public authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    private generalServicesService: GeneralServicesService,
    private manageOpportunityService: ManageOpportunityService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,

    private cdr: ChangeDetectorRef,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private packageConditionService: PackageConditionService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.currentUserOfLogin = this.authService.getCurrentUser();
    this.yearsExperienceId = this.authService.getyearsExperienceId();
    this.spinner.show();
    this.packageConditionService.getConditionPackage();
    this.getConditionPackage();
    this.id = this.route.snapshot.paramMap.get('id');
    this.theLanguage = this.translationService.getSelectedLanguage();
    this.getOpportunityDetails(this.id);
    this.getSimilarOpportunities(this.id);
    this.generalServicesService.getCountriesList().subscribe((res) => {
      this.countrys = res;
      this.cdr.detectChanges();
    });
  }

  getConditionPackage() {
    this.packageConditionService.ShowOpportunityCondition$.subscribe(
      (val: any) => {
        this.ShowOpportunityCondition = val;
      }
    );
    this.packageConditionService.logoConditions$.subscribe((val: any) => {
      this.logoConditions = val;
    });

    this.packageConditionService.paymentType$.subscribe((val: any) => {
      this.paymentType = val;
    });
    this.cdr.detectChanges();
  }
  initFilterObj() {
    return {
      Id: this.id,
      sorting: 'id',
      skipCount: 0,
      maxResultCount: this.pageSize,
    };
  }

  // get the Opportunity details by the id from the manageOpportunityService
  getOpportunityDetails(id: any) {
    this.spinner.show();
    this.manageOpportunityService.applyFobSeeker(id).subscribe(
      (res) => {
        this.opportunity = res;
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      }
    );
  }

  // get the SimilarOpportunities by the id from the manageOpportunityService
  getSimilarOpportunities(id: any) {
    this.spinner.show();
    this.filter.Id = id;
    this.manageOpportunityService.similarOpportunities(this.filter).subscribe(
      (res) => {
        this.similarOpportunities = res.items;
        res.totalCount <= 1 ? (this.Other = true) : (this.Other = false);
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      }
    );
  }

  // download the file
  downloadFile() {
    this.spinner.show();
    window.open(this.opportunity.announceDetailsAttachementFileStorageUrl);
    this.spinner.hide();
  }

  showJob(id: number) {
    if (this.ShowOpportunityCondition) {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/client/view-job/' + id]));
    }
  }

  applyToTheOpportunity(id: number) {
    if (!this.currentUser) {
      this.toastr.error(this.translate.instant('ViewDetails.pleaseLogin'));
    } else {
      this.confirmationDialogService
        .confirm(
          this.translate.instant('viewJob.AreyouSure'),
          this.translate.instant('viewJob.AreYouSure')
        )
        .then((confirmed: any) => {
          if (confirmed) {
            this.manageOpportunityService
              .requestOpportunity(id)
              .subscribe((res) => {});
          } else {
            this.getOpportunityDetails(id);
          }
        })
        .catch(() => {
          this.getOpportunityDetails(id);
        });
    }
  }

  backClicked() {

    this.router.navigate([`/client/job-search`]);
  }

  reload(event: any) {
    this.getOpportunityDetails(this.id);
  }

  redirectTo(countryId: any) {
    localStorage.setItem('countryId', countryId);

    this.router.navigate([`/client/job-search`]);
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
