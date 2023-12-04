import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalChangePasswordComponent } from './model/modal-change-password/modal-change-password.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentRepresentativeInformationComponent } from './model/agent-representative-information/agent-representative-information.component';
import { AgentInformationComponent } from './model/agent-information/agent-information.component';
import { ManageClientService } from 'src/app/services/api/manage-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslationService } from 'src/app/i18n';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-agent-profile',
  templateUrl: './edit-agent-profile.component.html',
  styleUrls: ['./edit-agent-profile.component.scss'],
})
export class EditAgentProfileComponent implements OnInit {
  agentData: any;
  id: number;
  pageNumber: number;
  videoLink: any;
  videoURl: any;
  copied: boolean;
  constructor(
    private modalService: NgbModal,
    private manageClientService: ManageClientService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translationService: TranslationService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getDeatiles(0);
  }
 
  async openModal() {
    const myAddModle = this.modalService.open(ModalChangePasswordComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });
    myAddModle.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getDeatiles(0);
        
      }
    });
  }

  async openAgentInfo() {
    const myAddModle = this.modalService.open(AgentInformationComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });
    myAddModle.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getDeatiles(0);
        
      }
    });
  }

  async openAgentRepresentativeInfo() {
    const myAddModle = this.modalService.open(
      AgentRepresentativeInformationComponent,
      {
        size: 'xl',
        keyboard: false,
        centered: true,
      }
    );
    myAddModle.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getDeatiles(0);
        
      }
    });
  }
  paymentPackage(){
    window.scrollTo(0, 0);
    this.router.navigate(['/client/payment-package'])
  }
  getDeatiles(id: any) {
    this.spinner.show();
    this.manageClientService.agentDetails(id).subscribe(
      (res) => {
        this.agentData = res;
        
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.masage);
      }
    );
    this.cdr.detectChanges();
  }

  copy(value: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '30';
    selBox.value = value;
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

  callWattsApp(phoneNumber: any) {
    let href = 'text';
    // if (this.deviceInfo.device == 'iPhone') {
    //   return window.open('https://wa.me/966533352906/?text=' + href, '_blank');
    // } else {
      return window.open(
        `https://api.whatsapp.com/send?phone=${phoneNumber}` ,
        '_blank'
      );
    // }
  }
}
function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
