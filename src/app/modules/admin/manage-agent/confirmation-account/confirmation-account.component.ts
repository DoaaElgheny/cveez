import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalConfig } from 'src/app/_metronic/partials';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';

@Component({
  selector: 'app-confirmation-account',
  templateUrl: './confirmation-account.component.html',
  styleUrls: ['./confirmation-account.component.scss']
})
export class ConfirmationAccountComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ConfirmationAccountComponent>;
  private modalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  Member:any;
  reason:String;
  reasonEmpty=false;
  constructor(private modalService: NgbModal
    , private cdr: ChangeDetectorRef,

    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private agentManagementService:AgentManagementService
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
  closeFunction()
  {
    this.modalService.dismissAll('Cross click');
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
  ngOnInit(): void {
  }
  valid()
  {
    if(this.reason!=null&&this.reason!='')
    {
      this.reasonEmpty=false;
    }
    else{
      this.reasonEmpty=true;
    }
  }
  Reject()
  {
    if(this.reason!=null&&this.reason!='')
    {
      this.reasonEmpty=false;
    this.spinner.show();
    this.agentManagementService.changAcceptanceState({id:this.Member.id,
      acceptanceState:4,rejectedReason:this.reason
    }).subscribe((result) => {
      this.spinner.hide();
     this.toastr.success( this.translate.instant('jobSeeker.rejection'));
     this.modalService.dismissAll('Cross click');
    },
    (error) => {
      this.spinner.hide();

      this.toastr.error(error.error.error.message);
      console.log(error);
      this.modalService.dismissAll('Cross click');
    });
  }
else{
this.reasonEmpty=true;
}
}
}
