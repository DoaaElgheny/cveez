import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { theAccountState } from 'src/app/services/enums/the-account-state.enum';
import { EmailState } from 'src/app/services/enums/email-state.enum';
import { VideoStatus } from 'src/app/services/enums/video-status';
import { ViewVideoModalComponent } from './view-video-modal/view-video-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentTypeSearch } from 'src/app/services/enums/payment-type-search';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.scss'],
})
export class UserManagmentComponent implements OnInit {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
  };
  constructor(
    private cdr: ChangeDetectorRef,
    private jobSekerManagementService: JobSekerManagementService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal
  ) {}
  totalCount: number;
  accountStatus = '';
  searchText: string = '';
  page = 1;
  currentPage = 1;
  pageSize: number = 10;
  alljobSeekers: any[] = [];
  filterObj = this.initFilterObj();
  theAccountState = theAccountState;
  theEmailStatus = EmailState;
  thevideoStatus = VideoStatus;
  thePaymentTypeSearch = PaymentTypeSearch;
  thePaymentType = Payment;
  emailState = '';
  paymentStatus = '';
  videoStatus = '';
  fromSearchInput: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.skipCount) {
        if (params.skipCount == 0) {
          this.page = 1;
        } else {
          this.page = params.skipCount / 10 + 1;
        }
        this.searchText = params.text;
        this.accountStatus = params.AccountState;
        this.paymentStatus = params.PaymentType;
        this.emailState = params.EmailState;
        this.pageSize = params.maxResultCount;
        this.videoStatus = params.VedioStatus;
      }

      this.getAllJobSeekersData();
    });
  }

  rest() {
    this.searchText = '';
    this.accountStatus = '';
    this.emailState = '';
    this.paymentStatus = '';
    this.videoStatus = '';
    this.getAllJobSeekersData();
  }

  getAllJobSeekersData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;
    this.filterObj.text = this.searchText;
    this.filterObj.AccountState = this.accountStatus;
    this.filterObj.PaymentType = this.paymentStatus;
    this.filterObj.EmailState = this.emailState;
    this.filterObj.maxResultCount = this.pageSize;
    this.filterObj.VedioStatus = this.videoStatus;

    this.jobSekerManagementService
      .getJobSeeker(this.filterObj)
      .subscribe((res) => {
        this.alljobSeekers = res.items;

        this.totalCount = res.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      });
  }
  initFilterObj() {
    return {
      text: this.searchText,
      sorting: 'id',
      AccountState: this.accountStatus,
      EmailState: this.emailState,
      PaymentType: this.paymentStatus,
      VedioStatus: this.videoStatus,
      skipCount: 0,
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
        this.translate.instant('jobSeeker.confirmModalTitle'),
        this.translate.instant('jobSeeker.activeMessage')
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let userstate = { id: theMember.id, state: theMember.state };
        if (confirmed) {
          this.jobSekerManagementService.changeStatus(userstate).subscribe(
            (data) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('jobSeeker.changeAccountStatus')
              );
              this.getAllJobSeekersData();
            },
            (err) => {
              this.spinner.hide();
              this.toastr.error(err.error.error.message);
              console.log(err);
            }
          );
        } else {
          theMember.state = oldVal;
          this.getAllJobSeekersData();
          this.cdr.detectChanges();
        }
      });
  }
  resendEmail(email: any) {
    this.spinner.show();
    this.jobSekerManagementService.resentEmail(email).subscribe(
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
            this.jobSekerManagementService.SendEmailsToUnsubscribe(0).subscribe(
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
            this.jobSekerManagementService
              .SendEmailsToUnsubscribe(id)
              .subscribe(
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

  accountDetails(theMember: any) {
    this.router.navigate(['admin/user-deatil/' + theMember.id], {
      queryParams: this.filterObj,
    });
  }
exportSeekers(){
 this.spinner.show();
 window.open(`${environment.api_url}api/app/manage-job-seeker/export-sheet-job-seekers?text=${this.searchText}&AccountState=${this.accountStatus}&EmailState=${this.emailState}&PaymentType=${this.paymentStatus}&VedioStatus=${this.videoStatus}`);
    this.spinner.hide();
    this.toastr.success(
      this.translate.instant('ManageDiscountCode.FileExportedSuccessfully')
    );
  }
 


  async openModal(member: any) {
    const myAddModle = this.modalService.open(ViewVideoModalComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });
    myAddModle.componentInstance.Member = member;
    myAddModle.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getAllJobSeekersData();
      }
    });
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
