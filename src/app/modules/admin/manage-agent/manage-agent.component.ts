import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ManageClientService } from 'src/app/services/api/manage-client.service';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { ModalMemberComponent } from './modal-member/modal-member.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationAccountComponent } from './confirmation-account/confirmation-account.component';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { theAccountState } from 'src/app/services/enums/the-account-state.enum';
// import{AcceptanceState}from 'src/app/services/enums/acceptance-state.'

import { ActivatedRoute, Router } from '@angular/router';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { EmailState } from 'src/app/services/enums/email-state.enum';

import { PaymentTypeSearch } from 'src/app/services/enums/payment-type-search';
import { AcceptanceState } from 'src/app/acceptance-state‏';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';
import { environment } from 'src/environments/environment';

// import * as acceptanceState from 'src/app/acceptance-state';

@Component({
  selector: 'app-manage-agent',
  templateUrl: './manage-agent.component.html',
  styleUrls: ['./manage-agent.component.scss'],
})
export class ManageAgentComponent implements OnInit {
  @ViewChild('modal') private modalMemberComponent: ModalMemberComponent;
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
  };
  fromSearchInput: boolean = false;

  constructor(
    private manageClientService: ManageClientService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private route: ActivatedRoute,

    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private agentManagementService: AgentManagementService
  ) {}
  totalCount: number;
  payMent: number = 0;
  paymentStatus = '';
  state = '';
  AccreditationDecision = '';
  searchText: string = '';
  page: number = 1;
  pageSize: number = 10;
  allMembers: any[] = [];
  emailState = '';
  theacceptanceState = AcceptanceState;
  theEmailStatus = EmailState;
  thePaymentTypeSearch = PaymentTypeSearch;
  thePaymentType = Payment;
  filterObj = this.initFilterObj();

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.skipCount) {
        if (params.skipCount == 0) {
          this.page = 1;
        } else {
          this.page = params.skipCount / 10 + 1;
        }
        this.searchText = params.text;
        this.state = params.state;
        this.AccreditationDecision = params.AcceptanceState;
        this.emailState = params.EmailState;
        this.paymentStatus = params.PaymentType;
        this.pageSize = params.maxResultCount;
      }

      this.getAllAgentData();
    });
  }

  rest() {
    this.searchText = '';
    this.state = '';
    this.AccreditationDecision = '';
    this.emailState = '';
    this.paymentStatus = '';
    this.getAllAgentData();
  }

  getAllAgentData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;

    this.filterObj.skipCount = startIndex;
    this.filterObj.text = this.searchText;
    this.filterObj.state = this.state;
    this.filterObj.AcceptanceState = this.AccreditationDecision;
    this.filterObj.EmailState = this.emailState;
    this.filterObj.PaymentType = this.paymentStatus;
    this.filterObj.maxResultCount = this.pageSize;

    this.manageClientService.getAllAgent(this.filterObj).subscribe((res) => {
      this.allMembers = res.items;
      this.totalCount = res.totalCount;
      this.spinner.hide();
      this.cdr.detectChanges();
    });
  }

  initFilterObj() {
    return {
      text: this.searchText,
      sorting: 'id',
      state: this.state,
      skipCount: 0,
      AcceptanceState: this.AccreditationDecision,
      EmailState: this.emailState,
      PaymentType: this.paymentStatus,
      maxResultCount: this.pageSize,
    };
  }

  changAccountState(theMember: any) {
    let oldVal = theMember.state;
    theMember.state =
      theMember.state == theAccountState.Active
        ? theAccountState.Inactive
        : theAccountState.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('viewProfile.confirmation'),
        theMember.state == theAccountState.Inactive
          ? this.translate.instant('viewProfile.DoYouWantToChange')
          : this.translate.instant('viewProfile.DoYouWantToChange')
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let userstate = { id: theMember.id, state: theMember.state };
        if (confirmed) {
          this.manageClientService.changAccountState(userstate).subscribe(
            (data) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('viewProfile.successfully')
              );
              this.getAllAgentData();
            },
            (err) => {
              this.spinner.hide();
              this.toastr.error(err.error.error.message);
              console.log(err);
            }
          );
        } else {
          this.spinner.hide();
          theMember.state = oldVal;
          this.cdr.detectChanges();
          this.getAllAgentData();
        }
      })
      .catch(() => {
        theMember.state == theAccountState.Active
          ? theAccountState.Active
          : theAccountState.Inactive;
        this.getAllAgentData();
      });
  }

  showDetiles(id: number) {
    this.router.navigate(['admin/agent-detail/' + id], {
      queryParams: this.filterObj,
    });
  }
  exportAgent() {
    this.spinner.show();
    window.open(
      `${environment.api_url}api/app/manage-agent/export-sheet-agents?text=${this.searchText}&state=${this.state}&EmailState=${this.emailState}&PaymentType=${this.paymentStatus}&AcceptanceState=${this.AccreditationDecision}`
    );
    this.spinner.hide();
    this.toastr.success(
      this.translate.instant('ManageDiscountCode.FileExportedSuccessfully')
    );
  }
  async openModalAccept() {
    const myAddModle = this.modalService.open(ConfirmationAccountComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });
    myAddModle.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getAllAgentData();
      }
    });
  }
  async openModal(member: any) {
    const myAddModle = this.modalService.open(ModalMemberComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });
    myAddModle.componentInstance.Member = member;
    myAddModle.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getAllAgentData();
      }
    });
  }
  resendEmail(email: any) {
    this.spinner.show();
    this.agentManagementService.resentEmail(email).subscribe(
      (result) => {
        this.spinner.hide();
        this.toastr.success(this.translate.instant('jobSeeker.resendEmail'));
      },
      (error) => {
        this.spinner.hide();

        this.toastr.error(error.error.error.message);
        console.log(error);
      }
    );
  }

  ResendSubscriptionReminder(id: number) {
    if (id === 0) {
      this.confirmationDialogService
        .confirm(
          this.translate.instant('jobSeeker.SubscriptionReminder'),
          this.translate.instant('jobSeeker.AreYouSure')
        )
        .then((confirmed: any) => {
          this.spinner.show();
          if (confirmed) {
            this.agentManagementService.SendEmailsToUnsubscribe(0).subscribe(
              (res) => {
                this.toastr.success(
                  this.translate.instant(
                    'jobSeeker.TheReminderEmailSentSccessfully'
                  )
                );
                this.spinner.hide();
              },
              (err) => {
                this.toastr.error(err.error.error.message);
                this.spinner.hide();
              }
            );
          } else {
            this.spinner.hide();
          }
        });
    } else {
      this.confirmationDialogService
        .confirm(
          this.translate.instant('jobSeeker.SubscriptionReminder'),
          this.translate.instant('jobSeeker.AreYouSure')
        )
        .then((confirmed: any) => {
          this.spinner.show();
          if (confirmed) {
            this.agentManagementService.SendEmailsToUnsubscribe(id).subscribe(
              (res) => {
                this.toastr.success(
                  this.translate.instant(
                    'jobSeeker.TheReminderEmailSentSccessfully'
                  )
                );
                this.spinner.hide();
              },
              (err) => {
                this.toastr.error(err.error.error.message);
                this.spinner.hide();
              }
            );
          } else {
            this.spinner.hide();
          }
        });
    }
  }
}
function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
