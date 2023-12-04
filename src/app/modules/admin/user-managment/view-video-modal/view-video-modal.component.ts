import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalConfig } from 'src/app/_metronic/partials';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { StatusVideoModalComponent } from '../status-video-modal/status-video-modal.component';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';

@Component({
  selector: 'app-view-video-modal',
  templateUrl: './view-video-modal.component.html',
  styleUrls: ['./view-video-modal.component.scss']
})
export class ViewVideoModalComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ViewVideoModalComponent>;
  private modalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  Member:any;
  videoLink:any;
  videoURl:any;
  copied:boolean;
  constructor(private modalService: NgbModal
    , private cdr: ChangeDetectorRef,

    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private agentManagementService:AgentManagementService,
    private jobSekerManagementService: JobSekerManagementService,
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
  closeFunction()
  {
    this.modalService.dismissAll('Cross click');
  }
  ngOnInit(): void {
    this.getVideo();
  }
  copyInputMessage(inputElement:any){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  copy() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '30';
    selBox.value = this.videoLink ;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 4000);
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  getVideo()
  {
    this.spinner.show();
    this.jobSekerManagementService.getVideo(this.Member.id).subscribe((result) => {
      this.spinner.hide();
     this.videoLink=result.linkVedio;
     this.videoURl=result.vedioAttachementFileStorageURL;

    },
    (error) => {
      this.spinner.hide();

      this.toastr.error(error.error.error.message, '');
      console.log(error);

    });
  }
  AcceptState()
  {
    this.spinner.show();
    this.jobSekerManagementService.changeVideoStatus({id:this.Member.id,
      vedioStatus:0,rejectionReason:''
    }).subscribe((result) => {
      this.spinner.hide();
     this.toastr.success( this.translate.instant('jobSeeker.acceptanceVideo'));
     this.modalService.dismissAll('Cross click');
    },
    (error) => {
      this.spinner.hide();

      this.toastr.error(error.error.error.message);
      console.log(error);
      this.modalService.dismissAll('Cross click');
    });

  }
  RejectState()
  {
    this.closeFunction();
    const myAddModle = this.modalService.open(StatusVideoModalComponent, {
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
