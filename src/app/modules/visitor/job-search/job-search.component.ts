import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';
import {
  OpportunityState,
  OpportunityAcceptanceState,
} from 'src/app/services/enums/opportunity.enum';
import { LoginModalComponent } from 'src/app/modules/SharedComponent/SharedComponent/login-modal/login-modal.component';
import {
  Payment,
  ConditionType,
} from 'src/app/services/enums/payment-conditions.enum';
import { PackageConditionService } from 'src/app/services/common/package-condition.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss'],
})
export class JobSearchComponent implements OnInit, OnDestroy {
  pageSize = 9;
  currentPage = 1;
  collectionSize: number = 0;
  searchObj: any;
  seachKey: any = '';
  data: any;
  firstTime: boolean;
  countryId: any = null;
  currentUserName: string | null = localStorage.getItem('name')
    ? String(localStorage.getItem('name'))
    : null;
  opportunityAcceptanceState = OpportunityAcceptanceState;
  opportunityState = OpportunityState;
  currentUser: any = null;
  classificationId: string | null = null;
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();

  logoConditions: boolean;
  ShowOpportunityCondition: boolean;
  paymentType: any;
  payment: any = Payment;
  conditionType: any = ConditionType;
  private unsubscribe: Subscription[] = [];
  fromSearchInput: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private spinnerService: NgxSpinnerService,
    public router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private manageOpportunityService: ManageOpportunityService,
    private packageConditionService: PackageConditionService
  ) {}

  ngOnInit(): void {
    this.firstTime = true;
    this.currentPage = Number(
      this.activatedRoute.snapshot.paramMap.get('pageID')
    );

    this.packageConditionService.getConditionPackage();
    this.currentUser = this.authService.getCurrentUser();
    setTimeout(() => {
      this.getConditionPackage();
    }, 1000);

    if (localStorage.getItem('seachKey')) {
      this.seachKey = localStorage.getItem('seachKey');
      localStorage.removeItem('seachKey');
    }
    if (localStorage.getItem('countryId')) {
      this.countryId = localStorage.getItem('countryId');
      localStorage.removeItem('countryId');
    }
    if (localStorage.getItem('classificationId')) {
      this.classificationId = localStorage.getItem('classificationId');
      localStorage.removeItem('classificationId');
    }
  }
  getConditionPackage() {
    this.packageConditionService.ShowOpportunityCondition$.subscribe(
      (val: any) => {
        this.ShowOpportunityCondition = val;
        this.cdr.detectChanges();
      }
    );
    this.packageConditionService.logoConditions$.subscribe((val: any) => {
      this.logoConditions = val;
      this.cdr.detectChanges();
    });
    this.packageConditionService.paymentType$.subscribe((val: any) => {
      this.paymentType = val;
      this.cdr.detectChanges();
    });
  }

  handleSearch(event: any) {
    this.searchObj = event;
    this.loadData();
  }

  reload(event: any) {
    this.loadData();
  }

  loadData(target?: any) {
    if (!this.fromSearchInput) {
      this.spinnerService.show();
    }

    let startIndex = 0;
    if (this.firstTime) {
      startIndex =
        (Number(localStorage.getItem('pageID') || 1) - 1) * this.pageSize;
    } else {
      startIndex = (this.currentPage - 1) * this.pageSize;
    }

    let filterObj: any;

    filterObj = {
      text: this.seachKey,
      skipCount: startIndex,
      maxResultCount: this.pageSize,
      ...this.searchObj,
    };
    if (this.countryId) {
      filterObj.countryId = this.countryId;
    }
    if (this.classificationId) {
      filterObj.classifications = this.classificationId;
    }

    let obj = Object.keys(filterObj).forEach(
      (k) =>
        (filterObj[k] == null || k.includes('DataView')) && delete filterObj[k]
    );

    this.manageOpportunityService.searchOpportunity(filterObj).subscribe({
      next: (res) => {
        this.data = res.items;
        this.collectionSize = res.totalCount;
        this.spinnerService.hide();

        target && this.scrollToElement(target);
        this.firstTime = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinnerService.hide();
      },
    });
    if (this.firstTime) {
      setTimeout(() => {
        this.currentPage = Number(localStorage.getItem('pageID') || 1);
        this.cdr.detectChanges();
      }, 1000);
    }
  }

  scrollToElement($element: any): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  checkButtonAction(itemId?: number) {
    if (!this.currentUser) {
      const loginModal = this.modalService.open(LoginModalComponent, {
        size: 'md',
        keyboard: false,
        centered: true,
      });

      loginModal.result.then(hideFn, hideFn).catch((result) => {
        if (result) {
        }
      });
    } else if (this.currentUser && this.paymentType == this.payment.Expired) {
      const loginModal = this.modalService.open(LoginModalComponent, {
        size: 'md',
        keyboard: false,
        centered: true,
      });

      loginModal.componentInstance.expiredMode = true;

      loginModal.result.then(hideFn, hideFn).catch((result) => {
        if (result) {
        }
      });
    } else {
      
      localStorage.setItem('pageID', this.currentPage.toString());
      window.open(`${environment.web_url}/client/view-job/${itemId}`, '_blank')
      // this.router.navigate(['client/view-job/' + itemId]);
    }
  }

  viewAgent(agentId: any) {
    if (!this.currentUser) {
      const loginModal = this.modalService.open(LoginModalComponent, {
        size: 'md',
        keyboard: false,
        centered: true,
      });

      loginModal.result.then(hideFn, hideFn).catch((result) => {
        if (result) {
        }
      });
    } else if (this.paymentType === this.payment.Expired) {
      const loginModal = this.modalService.open(LoginModalComponent, {
        size: 'md',
        keyboard: false,
        centered: true,
      });

      loginModal.componentInstance.expiredMode = true;

      loginModal.result.then(hideFn, hideFn).catch((result) => {
        if (result) {
        }
      });
    } else {
      this.router.navigateByUrl(`/client/show-agent/${agentId}`);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
