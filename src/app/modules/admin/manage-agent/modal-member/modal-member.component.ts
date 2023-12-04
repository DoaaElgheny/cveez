import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalConfig } from 'src/app/_metronic/partials';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { ConfirmationAccountComponent } from '../confirmation-account/confirmation-account.component';

@Component({
  selector: 'app-modal-member',
  templateUrl: './modal-member.component.html',
  styleUrls: ['./modal-member.component.scss'],
})
export class ModalMemberComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ModalMemberComponent>;
  private modalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  Member: any;
  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,

    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private agentManagementService: AgentManagementService
  ) {}
  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async close(): Promise<void> {
    if (
      this.modalConfig.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig.onClose === undefined ||
        (await this.modalConfig.onClose());
      this.modalRef.close(result);
    }
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.disableDismissButton !== undefined) {
      return;
    }

    if (
      this.modalConfig.shouldDismiss === undefined ||
      (await this.modalConfig.shouldDismiss())
    ) {
      const result =
        this.modalConfig.onDismiss === undefined ||
        (await this.modalConfig.onDismiss());
      this.modalRef.dismiss(result);
    }
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  ngOnInit(): void {}

  AcceptState() {
    this.spinner.show();
    this.agentManagementService
      .changAcceptanceState({
        id: this.Member.id,
        acceptanceState: 2,
        rejectedReason: '',
      })
      .subscribe(
        (result) => {
          this.spinner.hide();
          this.toastr.success(this.translate.instant('jobSeeker.acceptance'));
          this.modalService.dismissAll('Cross click');
        },
        (error) => {
          this.spinner.hide();

          this.toastr.error(error.error.error.message);
          console.log(error);
          this.modalService.dismissAll('Cross click');
        }
      );
  }
  RejectState() {
    const myAddModle = this.modalService.open(ConfirmationAccountComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });
    myAddModle.componentInstance.Member = this.Member;
    myAddModle.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        
      }
    });
  }
}
function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
