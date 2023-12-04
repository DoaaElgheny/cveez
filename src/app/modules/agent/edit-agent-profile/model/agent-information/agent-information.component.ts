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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalConfig } from 'src/app/_metronic/partials';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { VerficationCodeComponent } from '../verfication-code/verfication-code.component';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';
import { EmailValidatorMatch } from './emailValidator';

@Component({
  selector: 'app-agent-information',
  templateUrl: './agent-information.component.html',
  styleUrls: ['./agent-information.component.scss'],
})
export class AgentInformationComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal')
  private modalContent: TemplateRef<AgentInformationComponent>;
  private modalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public representativeForm: FormGroup;
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public countriesList: Array<any> = [];
  private unsubscribe: Subscription[] = [];
  public lang: string = String(localStorage.getItem('language'));
  private dialogSize: 'sm' | 'lg' = 'sm';
  public selectedCountryIso: any;
  public successLoad = false;
  mobileNumber: any;
  oldEmail: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private agentService: AgentManagementService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private generalService: GeneralServicesService
  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
  }

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

  ngOnInit(): void {
    this.getProfileData();
    this.generalService.getCountriesList().subscribe({
      next: (value) => {
        this.countriesList = value;
      },
      error: (err) => {},
    });
  }

  initForm() {
    this.representativeForm = this.fb.group({
      agentRepresentativeName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      agentRepresentativeEmail: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],

      agentRepresentativePosition: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      agentMobileNumber: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Mobile),
        ]),
      ],
      agentCountryCode: 966,
      agentCountryCodeIso: 'sa',
      countryId: [''],
    },
    {
      validator: EmailValidatorMatch.MatchPassword,
    });
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  getProfileData() {
    this.spinner.show();

    this.agentService.getAgentProfile().subscribe((res) => {
    
      const indexOfS = Object.values(this.CountryISO).indexOf(
        res.agentCountryCodeIso as unknown as CountryISO
      );

      const key = Object.keys(this.CountryISO)[indexOfS];
    
      this.selectedCountryIso = key;
      this.oldEmail = res.agentRepresentativeEmail;
      this.initForm();

      this.representativeForm.patchValue(res);
      this.mobileNumber = res.agentMobileNumber;
      this.successLoad = true;
      this.spinner.hide();
      this.cdr.detectChanges();
    });
  }

  submit() {
    if (this.representativeForm.invalid) {
      return;
    }
    Object.keys(this.representativeForm.controls).forEach((field) => { // {1}
      const control = this.representativeForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });

    if (
      this.oldEmail !=
      this.representativeForm.get('agentRepresentativeEmail')?.value
    ) {
      this.generalService
        .getCode(this.representativeForm.get('agentRepresentativeEmail')?.value)
        .subscribe(
          (res) => {
            this.spinner.hide();
            const myAddModle = this.modalService.open(
              VerficationCodeComponent,
              {
                size: 'md',
                keyboard: false,
                centered: true,
              }
            );
            myAddModle.componentInstance.email = this.oldEmail;
            myAddModle.componentInstance.formvalue =
              this.representativeForm.value;
            this.cdr.detectChanges();
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          }
        );
    } else {
      this.spinner.show();
      this.agentService
        .updateRepresentiveAgentProfile(this.representativeForm.value)
        .subscribe(
          (res) => {
            this.spinner.hide();
            this.toastr.success(
              this.translate.instant('facility.updateSuccess')
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

  public onInputChange(event: any, fieldName: string) {
    if (event.isNumberValid) {
      if (fieldName === 'agentMobileNumber') {
        this.representativeForm
          .get('agentMobileNumber')
          ?.setValue(
            event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
          );
        this.representativeForm
          .get('agentCountryCode')
          ?.setValue(event.dialCode);
        this.representativeForm
          .get('agentCountryCodeIso')
          ?.setValue(event.iso2Code);
      }
    } else {
      if (fieldName === 'mobileNumber') {
        this.representativeForm
          .get('mobileNumber')
          ?.markAsTouched({ onlySelf: true });
        // this.agentForm.get('mobileNumber')?.
      } else if (fieldName === 'agentMobileNumber') {
        this.representativeForm
          .get('agentMobileNumber')
          ?.markAsTouched({ onlySelf: true });
      }
    }
  }
}
