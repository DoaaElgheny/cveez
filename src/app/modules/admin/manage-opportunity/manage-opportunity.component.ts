import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { ManageClassificationService } from 'src/app/services/api/manage-classification.service';
import { EditOpportunityComponent } from './edit-opportunity/edit-opportunity.component';
import { AcceptanceDecisionComponent } from './acceptance-decision/acceptance-decision.component';
import {
  OpportunityAcceptanceState,
  OpportunityState,
} from 'src/app/services/enums/opportunity.enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-opportunity',
  templateUrl: './manage-opportunity.component.html',
  styleUrls: ['./manage-opportunity.component.scss'],
})
export class ManageOpportunityComponent implements OnInit {
  totalCount: number = 0;
  AgentName: string = '';
  PublishedDate: string | Date = '';
  opportunityState = OpportunityState;
  opportunityAcceptanceState = OpportunityAcceptanceState;
  State = '';
  AcceptanceState = '';
  ClassificationId: any = '';
  page: number = 1;
  pageSize: number = 10;
  allOpportunities: any[] = [];
  allClassifications: any[] = [];
  filterObj = this.initFilterObj();
  fromSearchInput: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private manageOpportunityService: ManageOpportunityService,
    private manageClassificationService: ManageClassificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.skipCount) {
        if (params.skipCount == 0) {
          this.page = 1;
        } else {
          this.page = params.skipCount / 10 + 1;
        }

        this.AgentName = params.AgentName;
        this.PublishedDate = params.PublishedDate;
        this.State = params.State;
        this.AcceptanceState = params.AcceptanceState;
        this.ClassificationId = params.ClassificationId;
        this.pageSize = params.maxResultCount;
      }

      this.getListData();
      this.getClassificationListData();
    });
  }

  initFilterObj() {
    return {
      AgentName: this.AgentName,
      PublishedDate: this.PublishedDate,
      AcceptanceState: this.AcceptanceState,
      ClassificationId: this.ClassificationId,
      State: this.State,
      sorting: 'id',
      skipCount: 0,
      maxResultCount: this.pageSize,
    };
  }

  rest() {
    this.AgentName = '';
    this.PublishedDate = '';
    this.AcceptanceState = '';
    this.ClassificationId = '';
    this.State = '';
    this.getListData();
  }

  getListData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;
    this.filterObj.AgentName = this.AgentName;
    this.filterObj.PublishedDate = this.PublishedDate;
    this.filterObj.State = this.State;
    this.filterObj.AcceptanceState = this.AcceptanceState;
    this.filterObj.ClassificationId = this.ClassificationId;
    this.filterObj.maxResultCount = this.pageSize;

    this.manageOpportunityService
      .getAllOpportunities(this.filterObj)
      .subscribe({
        next: (res) => {
          this.allOpportunities = res.items;
          this.totalCount = res.totalCount;
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error?.error?.message);
        },
      });
  }

  getClassificationListData() {
    this.spinner.show();
    this.manageClassificationService.getClassificationsList().subscribe({
      next: (res) => {
        this.allClassifications = res;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error?.error?.message);
      },
    });
  }

  openEditOpportunityModal(opportunity: any) {
    const editModal = this.modalService.open(EditOpportunityComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    editModal.componentInstance.opportunityId = opportunity.id;
    editModal.componentInstance.ClassificationId = opportunity.classificationId;

    editModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getListData();
      }
    });
  }

  async changeOpportunityState(opportunity: any) {
    let oldVal = opportunity.state;
    opportunity.state =
      opportunity.state == OpportunityState.Available
        ? OpportunityState.NotAvailable
        : OpportunityState.Available;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('viewProfile.confirmation'),
        opportunity.state == OpportunityState.NotAvailable
          ? this.translate.instant('ManageOpportunity.DoYouWantToChange')
          : this.translate.instant('ManageOpportunity.DoYouWantToChange')
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let opportunityState = { id: opportunity.id, state: opportunity.state };
        if (confirmed) {
          this.manageOpportunityService
            .setOpportunityState(opportunityState)
            .subscribe({
              next: (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant(
                    'ManageOpportunity.OpportunityStatusChangedSuccessfully'
                  )
                );
                this.getListData();
              },
              error: (err) => {
                this.spinner.hide();
                this.toastr.error(err.error?.error?.message);
              },
            });
        } else {
          this.spinner.hide();
          opportunity.state = oldVal;
          this.getListData();
          this.cdr.detectChanges();
        }
      })
      .catch(() => {
        opportunity.state =
          opportunity.state == OpportunityState.Available
            ? OpportunityState.Available
            : OpportunityState.NotAvailable;
        this.getListData();
      });
  }

  async openAcceptanceDecisionModal(opportunity: any) {
    const acceptanceModal = this.modalService.open(
      AcceptanceDecisionComponent,
      {
        size: 'md',
        keyboard: false,
        centered: true,
      }
    );

    acceptanceModal.componentInstance.opportunityId = opportunity.id;

    acceptanceModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getListData();
      }
    });
  }

  changeOpportunityVisiablty(opportunity: any) {
    let oldVal = opportunity.isHideByAdmin;
    opportunity.isHideByAdmin = opportunity.isHideByAdmin ? false : true;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('viewProfile.confirmation'),
        oldVal
          ? this.translate.instant('ManageOpportunity.DoYouWantToShow')
          : this.translate.instant('ManageOpportunity.DoYouWantToHide')
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let opportunityVisaulable = {
          id: opportunity.id,
          isHideByAdmin: opportunity.isHideByAdmin,
        };
        if (confirmed) {
          this.manageOpportunityService
            .setOpportunityVisiablity(opportunityVisaulable)
            .subscribe({
              next: (data) => {
                this.spinner.hide();
                if (!opportunity.isHideByAdmin) {
                  this.toastr.success(
                    this.translate.instant(
                      'ManageOpportunity.OpportunityIsShownSuccessfully'
                    )
                  );
                } else {
                  this.toastr.success(
                    this.translate.instant(
                      'ManageOpportunity.OpportunityIsHiddenSuccessfully'
                    )
                  );
                }
                this.getListData();
              },
              error: (err) => {
                this.spinner.hide();
                this.toastr.error(err.error?.error?.message);
              },
            });
        } else {
          this.spinner.hide();
          opportunity.isHideByAdmin = oldVal;
          this.getListData();
          this.cdr.detectChanges();
        }
      })
      .catch(() => {
        opportunity.isHideByAdmin = opportunity.isHideByAdmin ? true : false;
        this.getListData();
        this.cdr.detectChanges();
      });
  }

  Edit(opp: any) {
    this.router.navigate(
      ['admin/edit-opportunity/' + opp.id + '/' + opp.agentId],
      {
        queryParams: this.filterObj,
      }
    );
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
