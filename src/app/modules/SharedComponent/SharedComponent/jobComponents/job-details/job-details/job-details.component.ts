import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { ManageOpportunityService } from 'src/app/services/api/manage-opportunity.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DoneSuccessfullyComponent } from '../done-successfully/done-successfully.component';
import {
  Payment,
  ConditionType,
} from 'src/app/services/enums/payment-conditions.enum';
import { Constants } from 'src/app/services/Constants/constants';
@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  @Input() orderDetails: any;
  @Input() forApply: any;
  @Input() isSaved: boolean;
  @Input() isApplyShow: boolean;
  isJobSeeker: boolean;
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  currentUser: any;
  
  payment: any = Payment;
  conditionType: any = ConditionType;
  @Input() logoConditions: boolean;

  constructor(
    private spinner: NgxSpinnerService,
    public router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    private manageOpportunityService: ManageOpportunityService,
    private modalService: NgbModal
  ) {}
  roles = Constants.AllRoles;
  ngOnInit(): void {
 
    this.currentUser = this.authService.getCurrentUser();
      if(this.currentUser &&  this.currentUser['roles'][0] === Constants.AllRoles.cveezJobSeeker){
        this.isJobSeeker=true
      }
  }

  reload(event: any) {
    this.bindValue.emit({
      success: true,
    });
  }

  downloadFile(file: any) {
    this.spinner.show();
    window.open(file);
    this.spinner.hide();
  }

  viewAgent(agentId: any) {
    this.router.navigateByUrl(`/client/show-agent/${agentId}`);
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
              .subscribe((res) => {
                this.openDoneSuccessfully(id);
              });
          } else {
            this.reload(event);
          }
        })
        .catch(() => {
          this.reload(event);
        });
    }
  }

  openDoneSuccessfully(id: number) {
    let mymodel = this.modalService.open(DoneSuccessfullyComponent, {
      size: 'sm',
      keyboard: false,
      centered: true,
    });
    mymodel.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.reload(event);
      }
    });
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
