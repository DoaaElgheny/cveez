import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageClassificationService } from 'src/app/services/api/manage-classification.service';
import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';

@Component({
  selector: 'app-edit-opportunity',
  templateUrl: './edit-opportunity.component.html',
  styleUrls: ['./edit-opportunity.component.scss'],
})
export class EditOpportunityComponent implements OnInit {
  public allClassifications: any[] = [];
  public ClassificationId: any = '';
  public opportunityId: any = '';
  public emptyInput: boolean = false;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private manageOpportunityService: ManageOpportunityService,
    private manageClassificationService: ManageClassificationService
  ) {}

  ngOnInit(): void {
    this.getClassificationListData();
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  getClassificationListData() {
    this.spinner.show();
    this.manageClassificationService.getClassification().subscribe({
      next: (res) => {
        this.allClassifications = res.items;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      },
    });
  }

  editOpportunity() {
    if (this.ClassificationId == null || this.ClassificationId == '') {
      this.emptyInput = true;
      return;
    }

    this.spinner.show();
    this.manageOpportunityService
      .editClassificationByAdmin({
        id: this.opportunityId,
        classificationId: this.ClassificationId,
      })
      .subscribe({
        next: (res) => {
          console.info(res);
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant(
              'ManageOpportunity.OpportunityUpdatedSuccessfully'
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
}
