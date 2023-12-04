import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Gender } from 'src/app/services/enums/gender.enum';
import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';
import { RejectModalComponent } from '../reject-modal/reject-modal.component';
import { OpportunityStatus } from 'src/app/services/enums/opportunity.enum';

@Component({
  selector: 'app-acceptance-decision',
  templateUrl: './acceptance-decision.component.html',
  styleUrls: ['./acceptance-decision.component.scss'],
})
export class AcceptanceDecisionComponent implements OnInit {
  opportunityId: any = '';
  opportunityDetails: any = {};
  lang: string | null = localStorage.getItem('language');
  gender: any = Gender;
  opportunityStatus: any = OpportunityStatus;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private manageOpportunityService: ManageOpportunityService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  getData() {
    this.spinner.show();
    this.manageOpportunityService
      .getOpportunityDetailsById(this.opportunityId)
      .subscribe({
        next: (result) => {
          this.opportunityDetails = result;
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error?.error?.message);
          this.modalService.dismissAll('Cross click');
        },
      });
  }

  AcceptState() {
    this.spinner.show();
    this.manageOpportunityService
      .setOpportunityAcceptanceState({
        id: this.opportunityId,
        opportunityAcceptanceState: this.opportunityStatus.Accepted,
      })
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant(
              'ManageOpportunity.OpportunityAcceptedSuccessfully'
            )
          );
          this.modalService.dismissAll('Cross click');
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
          this.modalService.dismissAll('Cross click');
        },
      });
  }

  openRejectModal() {
    this.closeFunction();
    const rejectModal = this.modalService.open(RejectModalComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    rejectModal.componentInstance.opportunityId = this.opportunityId;
    rejectModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
      }
    });
  }

  downloadFile() {
    this.spinner.show();
    window.open(
      this.opportunityDetails.announceDetailsAttachementFileStorageUrl
    );
    this.spinner.hide();
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
