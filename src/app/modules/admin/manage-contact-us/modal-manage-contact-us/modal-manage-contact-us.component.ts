import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ContactUsService } from 'src/app/services/api/contact-us.service';

@Component({
  selector: 'app-modal-manage-contact-us',
  templateUrl: './modal-manage-contact-us.component.html',
  styleUrls: ['./modal-manage-contact-us.component.scss'],
})
export class ModalManageContactUsComponent implements OnInit {
  @Input() name: any;
  @Input() id: number;
  @Input() reply: any;
  messageModalForm: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private _ContactUsService: ContactUsService,
    private formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.messageModalForm.get('id')?.setValue(this.id);
 
  }
  handelForm(messageModalForm: FormGroup) {
   
  }
  // sendMessage() {}
  initForm() {
    this.messageModalForm = this.formbuilder.group({
      id: [],
      reply: [null, [Validators.required]],
    });
  }
  // **************
  sendForm() {
    Object.keys(this.messageModalForm.controls).forEach((field) => {
      // {1}
      const control = this.messageModalForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });

    if (this.messageModalForm.valid) {
      this.spinner.show();
      this._ContactUsService
        .sendContactUsReply(this.messageModalForm.value)
        .subscribe(
          (res) => {
            this.spinner.hide();
            this.toastr.success(
              this.translate.instant('manageContactUs.replySentSuccessfully')
            );

            this.modalService.dismissAll('Cross click');
            this.cdr.detectChanges();
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          }
        );
    }
  }
}
