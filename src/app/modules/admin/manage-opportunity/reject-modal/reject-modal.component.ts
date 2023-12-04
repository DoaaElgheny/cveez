import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OpportunityStatus } from 'src/app/services/enums/opportunity.enum';
import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';
@Component({
  selector: 'app-reject-modal',
  templateUrl: './reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss'],
})
export class RejectModalComponent implements OnInit {
  opportunityId: any;
  reason: String | null = null;
  reasonEmpty = false;
  opportunityStatus: any = OpportunityStatus;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private manageOpportunityService: ManageOpportunityService
  ) {}

  ngOnInit(): void {}

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  valid() {
    if (this.reason) {
      this.reasonEmpty = false;
    } else {
      this.reasonEmpty = true;
    }
  }

  Reject() {
    if (this.reason) {
      this.reasonEmpty = false;
      this.spinner.show();
      this.manageOpportunityService
        .setOpportunityAcceptanceState({
          id: this.opportunityId,
          opportunityAcceptanceState: this.opportunityStatus.Rejected,
          rejectionReason: this.reason,
        })
        .subscribe({
          next: (result) => {
            this.spinner.hide();
            this.toastr.success(
              this.translate.instant(
                'ManageOpportunity.RejectionReasonsSentSuccessfully'
              )
            );
            this.modalService.dismissAll('Cross click');
          },
          error: (error) => {
            this.spinner.hide();
            this.toastr.error(error.error.error.message);
            this.modalService.dismissAll('Cross click');
          },
        });
    } else {
      this.reasonEmpty = true;
    }
  }
}
