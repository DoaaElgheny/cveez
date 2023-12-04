import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AgentOpportunityService } from 'src/app/services/api/agent-opportunity.service';
import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';

import { Gender } from 'src/app/services/enums/gender.enum';
import { OpportunityStatus } from 'src/app/services/enums/opportunity.enum';

@Component({
  selector: 'app-view-details-modal',
  templateUrl: './view-details-modal.component.html',
  styleUrls: ['./view-details-modal.component.scss']
})
export class ViewDetailsModalComponent implements OnInit {
  opportunityId: any = '';
  opportunityDetails: any = {};
  lang: string | null = localStorage.getItem('language');
  gender: any = Gender;
  opportunityStatus: any = OpportunityStatus;

  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,    private modalService: NgbModal,
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


  downloadFile() {
    this.spinner.show();
    window.open(
      this.opportunityDetails.announceDetailsAttachementFileStorageUrl
    );
    this.spinner.hide();
  }
}
