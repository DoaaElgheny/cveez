import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { MyOrderJopSeekerService } from 'src/app/services/api/my-order-jop-seeker.service';
import { LoginModalComponent } from '../../../login-modal/login-modal.component';
import { Constants } from 'src/app/services/Constants/constants';

@Component({
  selector: 'app-saved-job',
  templateUrl: './saved-job.component.html',
  styleUrls: ['./saved-job.component.scss'],
})
export class SavedJobComponent implements OnInit {
  @Input() isSaved = false;
  @Input() Id: any;
  currentUser: any;
  hideComponent:boolean
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private cdr: ChangeDetectorRef,
    private myOrderService: MyOrderJopSeekerService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toasterService: ToastrService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if(!this.currentUser|| this.currentUser['roles'][0] == Constants.AllRoles.cveezJobSeeker) {
      this.hideComponent=false
    }else{
      this.hideComponent=true
    }
  }
  savedJob() {
 
    if (!this.currentUser) {
      this.openLoginModel();
    } else if(this.currentUser['roles'][0] == Constants.AllRoles.cveezJobSeeker) {
      this.spinner.show();
      this.isSaved = !this.isSaved;
      this.myOrderService
        .savedJob({ opportunityId: this.Id })
        .subscribe((res) => {
          this.toasterService.success(
        this.isSaved?this.translate.instant('AddOpportunities.saveOpportunitySuccess')
         :this.translate.instant('AddOpportunities.saveOpportunityError') );
         this.bindValue.emit({
      result:true
        });
          this.spinner.hide();
          this.cdr.detectChanges();
        });
    }
  }
  openLoginModel() {
    const loginModal = this.modalService.open(LoginModalComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    loginModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
      }
    });
  }
}
function hideFn(reason: any): PromiseLike<never> {
  throw new Error('Function not implemented.');
}
