import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AgentOpportunityService } from 'src/app/services/api/agent-opportunity.service';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpportunityState } from 'src/app/services/enums/opportunity-state';
import { OpportunityAcceptanceState } from 'src/app/services/enums/opportunity-acceptance-state';
import { ViewDetailsModalComponent } from './view-details-modal/view-details-modal.component';
import { DoneSuccessfullyComponent } from './done-successfully/done-successfully.component';
import {
  Payment,
  ConditionType,
} from 'src/app/services/enums/payment-conditions.enum';
import { LoginModalComponent } from 'src/app/modules/SharedComponent/SharedComponent/login-modal/login-modal.component';
import { PackageConditionService } from 'src/app/services/common/package-condition.service';
import { AuthService } from '../../auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posted-opportunities',
  templateUrl: './posted-opportunities.component.html',
  styleUrls: ['./posted-opportunities.component.scss'],
})
export class PostedOpportunitiesComponent implements OnInit {
  totalCount: number;
  searchText: string = '';
  page: number = 1;
  pageSize: number = 9;
 
  allOpportunity: any[] = [];
  filterObj = this.initFilterObj();
  state = '';
  isLoading$: Observable<boolean>;
  opportunityState = OpportunityState;
  opportunityAcceptanceState = OpportunityAcceptanceState;
  acceptanceState = '';
  condtionsToCurrentUser: any = JSON.parse(
    String(localStorage.getItem('condtions-to-current-user'))
  );
  payment: any = Payment;
  conditionType: any = ConditionType;
  OpportunityNumberCondition: any = null;
  showNumberOfjobRemaining: boolean = false;
  numberOfOriginalValue: number = 0;
  numberofUpdatedValue: number = 0;
  fromSearchInput: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private opportunityManagementService: AgentOpportunityService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }
  getPackageData() {
    if (this.condtionsToCurrentUser?.paymentType === this.payment.Paied) {
      this.OpportunityNumberCondition =
        this.condtionsToCurrentUser?.getConditions.find(
          (condition: any) =>
            condition.conditionType === this.conditionType.OpportunityNumber
        );
      this.numberOfOriginalValue = parseInt(
        this.OpportunityNumberCondition.originalValue
      );
      this.numberofUpdatedValue = parseInt(
        this.OpportunityNumberCondition.updateValue
      );
      this.showNumberOfjobRemaining = true;
      document.getElementsByClassName(
        'showNumberOfjobRemaining'
      )[0]!.innerHTML =
        this.translate.instant('myOrderJobSeeker.TheNumberOfjobRemaining') +
        ' (' +
        this.numberofUpdatedValue +
        ' / ' +
        this.numberOfOriginalValue +
        ' )';
      this.cdr.detectChanges();
    }
  }
  ngOnInit(): void {

    this.cdr.detectChanges();
    this.getAllOpportunityData();
    this.getPackageData();
  }

  getAllOpportunityData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    
    }
  const startIndex = (this.page - 1) * this.pageSize;
    // let startIndex = 0;
    // if (this.firstTime) {
    //   startIndex =
    //     (Number(localStorage.getItem('pageIDopportunities') || 1) - 1) *
    //     this.pageSize;
    // } else {
    //   startIndex = (this.currentPage - 1) * this.pageSize;
    // }

    this.filterObj.skipCount = startIndex;
    this.filterObj.jobTitle = this.searchText;
    this.filterObj.state = this.state;
    this.filterObj.maxResultCount = this.pageSize;
    this.filterObj.acceptanceState = this.acceptanceState;
    this.opportunityManagementService
      .getAllOpportunity(this.filterObj)
      .subscribe({
        next: (res) => {
          this.allOpportunity = res.items;
          this.totalCount = res.totalCount;
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error?.error?.message);
        },
      });
  }

  addRoute() {
    if (this.condtionsToCurrentUser?.paymentType === this.payment.Paied) {
      this.condtionsToCurrentUser?.getConditions?.forEach((element: any) => {
        if (
          element.conditionType === this.conditionType.OpportunityNumber &&
          parseInt(element.updateValue) > 0
        ) {
          this.router.navigate(['client/add-opportunity/0']);
        } else if (
          element.conditionType === this.conditionType.OpportunityNumber &&
          parseInt(element.updateValue) === 0
        ) {
          this.openPopRenew();
        }
      });
    } else {
      this.openPopRenew();
    }
  }

  openPopRenew() {
    const loginModal = this.modalService.open(LoginModalComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    loginModal.componentInstance.expiredMode = true;
    loginModal.componentInstance.expiredText = this.translate.instant(
      'Search.RenewAddText'
    );

    loginModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
      }
    });
  }

  editPage(item: any) {
    if (
      item.acceptanceState === this.opportunityAcceptanceState.UnderStudying
    ) {
      if (this.condtionsToCurrentUser.paymentType === this.payment.Paied) {
        // localStorage.setItem(
        //   'pageIDopportunities',
        //   this.currentPage.toString()
        // );
        this.router.navigate(['client/add-opportunity/' + item.id]);
      } else {
        this.openRenewalPackage();
      }
    } else {
      let mymodel = this.modalService.open(DoneSuccessfullyComponent, {
        size: 'sm',
        keyboard: false,
        centered: true,
      });
      mymodel.result.then(hideFn, hideFn).catch((result) => {
        if (result) {
        }
      });
    }
  }

  openRenewalPackage() {
    const loginModal = this.modalService.open(LoginModalComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    loginModal.componentInstance.expiredMode = true;
    loginModal.componentInstance.expiredText = this.translate.instant(
      'Search.RenewAddText'
    );

    loginModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
      }
    });
  }

  initFilterObj() {
    return {
      jobTitle: this.searchText,
      sorting: 'id',
      state: this.state,
      skipCount: 0,
      maxResultCount: this.pageSize,
      acceptanceState: this.acceptanceState,
    };
  }

  changeHideToggle(item: any) {
    let oldVal = item.isHide;
    item.isHide = item.isHide == true ? false : true;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('viewProfile.confirmation'),
        item.isHide
          ? this.translate.instant('ManageOpportunityAgent.changeHide')
          : this.translate.instant('ManageOpportunityAgent.changeNotHide')
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let opportunityState = { id: item.id, isHide: item.isHide };
        if (confirmed) {
          this.opportunityManagementService.isHide(opportunityState).subscribe({
            next: (data) => {
              this.spinner.hide();
              this.toastr.success(
                item.isHide
                  ? this.translate.instant(
                      'ManageOpportunityAgent.isHideSuccess'
                    )
                  : this.translate.instant(
                      'ManageOpportunityAgent.isnotHideSuccess'
                    )
              );
              this.getAllOpportunityData();
            },
            error: (err) => {
              this.spinner.hide();
              this.toastr.error(err.error?.error?.message);
            },
          });
        } else {
          this.spinner.hide();
          item.isHide = oldVal;
          this.cdr.detectChanges();
          this.getAllOpportunityData();
        }
      })
      .catch(() => {
        item.isHide == true ? false : true;
        this.getAllOpportunityData();
      });
  }

  changeStateToggle(item: any) {
    let oldVal = item.state;
    item.state =
      item.state == OpportunityState.Available
        ? OpportunityState.NotAvailable
        : OpportunityState.Available;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('viewProfile.confirmation'),
        this.translate.instant('ManageOpportunityAgent.DoYouWantToChange')
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let opportunityState = { id: item.id, state: item.state };
        if (confirmed) {
          this.opportunityManagementService
            .changeStatus(opportunityState)
            .subscribe({
              next: (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('viewProfile.successfully')
                );
                this.getAllOpportunityData();
              },
              error: (err) => {
                this.spinner.hide();
                this.toastr.error(err.error?.error?.message);
              },
            });
        } else {
          this.spinner.hide();
          item.state = oldVal;
          this.cdr.detectChanges();
          this.getAllOpportunityData();
        }
      })
      .catch(() => {
        item.state == OpportunityState.Available
          ? OpportunityState.Available
          : OpportunityState.NotAvailable;
        this.getAllOpportunityData();
      });
  }

  showOrder(item: any) {
    // localStorage.setItem('pageIDopportunities', this.currentPage.toString());
    this.router.navigate(['client/manage-agent-orders/' + item.id]);
  }

  async openViewModal(opportunity: any) {
    const viewModal = this.modalService.open(ViewDetailsModalComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    viewModal.componentInstance.opportunityId = opportunity.id;

    viewModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getAllOpportunityData();
      }
    });
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
