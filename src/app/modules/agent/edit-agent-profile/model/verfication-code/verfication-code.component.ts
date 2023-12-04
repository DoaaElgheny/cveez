import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ModalConfig } from 'src/app/_metronic/partials';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';

@Component({
  selector: 'app-verfication-code',
  templateUrl: './verfication-code.component.html',
  styleUrls: ['./verfication-code.component.scss'],
})
export class VerficationCodeComponent implements OnInit, OnDestroy {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal')
  private modalContent: TemplateRef<VerficationCodeComponent>;
  private modalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  formvalue: any;
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
  codeCharactersForm: FormGroup;
  hasError: boolean;
  isPassword: boolean;
  returnUrl: string;

  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  email: any;
  constructor(
    private formbuilder: FormBuilder,
    private modalService: NgbModal,
    private agentService: AgentManagementService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private generalService: GeneralServicesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.codeCharactersForm
      .get('email')
      ?.setValue(this.formvalue.agentRepresentativeEmail);
  }

  initForm() {
    this.codeCharactersForm = this.formbuilder.group({
      email: [null, Validators.required],
      char1: [null, Validators.required],
      char2: [null, Validators.required],
      char3: [null, Validators.required],
      char4: [null, Validators.required],
    });
  }

  movetoNext(e: any) {
    if (e.srcElement.value != '') {
      e.preventDefault();
      let nextControl: any = e.srcElement.nextElementSibling;
      // Searching for next similar control to set it focus
      while (true) {
        if (nextControl) {
          if (nextControl.type === e.srcElement.type) {
            nextControl.focus();
            return;
          } else {
            nextControl = nextControl.nextElementSibling;
          }
        } else {
          return;
        }
      }
    }
  }
  resendCode() {
    this.generalService
      .getCode(this.formvalue.agentRepresentativeEmail)
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant('otpPage.resendSuccess'),

          );
          this.cdr.detectChanges();
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        }
      );
  }
  submit() {
    if (this.codeCharactersForm.valid) {
      const formValue = this.codeCharactersForm.value;
      const { char1, char2, char3, char4 } = formValue;
      let enteredCode = char1 + char2 + char3 + char4;
      this.hasError = false;
      this.spinner.show();
      this.generalService
        .verfiyCode({
          code: enteredCode,
          email: this.codeCharactersForm.value.email,
        })
        .subscribe(
          (res) => {
            this.spinner.hide();
            if (res) {
              this.toastr.success(
                this.translate.instant('facility.emailVerfiy'),

              );
              this.spinner.show();
              this.agentService
                .updateRepresentiveAgentProfile(this.formvalue)
                .subscribe(
                  (res) => {
                    this.spinner.hide();
                    this.toastr.success(
                      this.translate.instant('facility.updateSuccess'),

                    );

                    this.modalService.dismissAll('Cross click');
                    this.cdr.detectChanges();
                  },
                  (err) => {
                    this.spinner.hide();
                    this.toastr.error(err.error.error.message);
                  }
                );
            } else {
              this.toastr.error(
                this.translate.instant('facility.emailNotVerfiy')
              );
              this.formvalue.agentRepresentativeEmail = this.email;
              this.spinner.show();
              this.agentService
                .updateRepresentiveAgentProfile(this.formvalue)
                .subscribe(
                  (res) => {
                    this.spinner.hide();
                    this.toastr.success(
                      this.translate.instant(
                        'facility.updateSuccessWithoutEmail'
                      )
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
            this.cdr.detectChanges();
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          }
        );
    } else {
      this.toastr.error(this.translate.instant('facility.codeRequired'));
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }
}
