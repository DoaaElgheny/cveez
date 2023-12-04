import { DatePipe } from '@angular/common';
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
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalConfig } from 'src/app/_metronic/partials';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { GeneralServicesService } from 'src/app/services/api/general-services.service';

@Component({
  selector: 'app-agent-representative-information',
  templateUrl: './agent-representative-information.component.html',
  styleUrls: ['./agent-representative-information.component.scss'],
})
export class AgentRepresentativeInformationComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal')
  private modalContent: TemplateRef<AgentRepresentativeInformationComponent>;
  private modalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public agentForm: FormGroup = new FormGroup({});
  public minDate: any;
  logoAttach: any;
  logoFileName: any;
  commercialName: any;
  commercialStorageFileName: any;
  isPdf: boolean;
  mobileNumber: any;
  public countriesList: Array<any> = [];
  public lang: string = String(localStorage.getItem('language'));
  private dialogSize: 'sm' | 'lg' = 'sm';
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public selectedCountryIso: any;
  agentDetails: any;
  notValid = false;
  successLoad=false;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private agentService: AgentManagementService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private generalServices: GeneralServicesService,
    private ngbDateParserFormatter: NgbDateParserFormatter,

  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
  }
  ngOnInit(): void {
    this.getProfileData();
    this.generalServices.getCountriesList().subscribe({
      next: (value) => {
        this.countriesList = value;
      },
      error: (err) => {
        console.log(err);
      },
    });


  }

  getProfileData() {
    this.spinner.show();
    this.agentService.getAgentProfile().subscribe((res) => {
      let exdate = new Date(res.expirationDate);
      var ngbDateStruct = {
        day: exdate.getDate(),
        month: exdate.getMonth() + 1,
        year: exdate.getFullYear(),
      };

      const indexOfS = Object.values(this.CountryISO).indexOf(
        res.countryCodeIso as unknown as CountryISO
      );

      const key = Object.keys(this.CountryISO)[indexOfS];

      this.selectedCountryIso = key;
  
      this.logoAttach = res.logoImageStorageFileUrl;
      this.logoFileName = res.logoImageStorageFileName;
      this.commercialName = res.commercialRegistertionNoImageStorageFileName;
      this.commercialStorageFileName =
        res.commercialRegistertionNoImageStorageFileUrl;
      this.isPdf = this.commercialStorageFileName?.includes('.pdf');
      this.agentDetails = res;
      this.mobileNumber = res.mobileNumber;
      this.initForm();
      this.agentForm.patchValue(res);
      
      this.agentForm.get('expirationDate')?.setValue(ngbDateStruct);
      this.spinner.hide();
      this.successLoad = true;
      this.cdr.detectChanges();
    });
  }

  public initForm() {
    this.agentForm = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      description: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ]),
      ],
      commercialRegistrationNo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]),
      ],
      commercialRegistertionNoImageName: [],
      commercialRegistertionNoImageStorageFileName: [],
      logoImageName: [],
      logoImageStorageFileName: [],
      expirationDate: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      linkedInAccountLink: [''],
      isAllowNotification: false,
      mobileNumber: [''],
      countryCode: [966],
      countryCodeIso: ['sa'],
      email: [''],
    });
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  deleteCmmircalImage() {
    this.commercialName = null;
    this.commercialStorageFileName = null;
    this.agentForm.get('commercialRegistertionNoImageName')?.setValue(null);
    this.agentForm
      .get('commercialRegistertionNoImageStorageFileName')
      ?.setValue(null);
  }

  public uploadlogoImg(data: any) {
    this.logoAttach = null;
    this.logoFileName = null;
    this.agentForm.get('logoImageName')?.setValue(data.storageFileName);
    this.agentForm
      .get('logoImageStorageFileName')
      ?.setValue(data.storageFileName);
  }

  deleteImage() {
    this.logoAttach = null;
    this.logoFileName = null;
    this.agentForm.get('logoImageName')?.setValue(null);
    this.agentForm.get('logoImageStorageFileName')?.setValue(null);
  }

  public uploadcommericalImg(data: any) {
    this.commercialName = null;
    this.commercialStorageFileName = null;
    this.agentForm
      .get('commercialRegistertionNoImageName')
      ?.setValue(data.storageFileName);
    this.agentForm
      .get('commercialRegistertionNoImageStorageFileName')
      ?.setValue(data.storageFileName);
  }
  validationOfDate() {
   
    let myDate = this.agentForm.value.expirationDate;
    if (myDate.year && myDate.month && myDate.day) {
     this.onDateSelect(myDate)
     
    } else {
      this.notValid = true;
    }
  }
  public isDateValid(date: NgbDateStruct): boolean {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return !isNaN(jsDate.getTime());
  }

  public onDateSelect(date: NgbDateStruct): void {
    if (this.isDateValid(date)) {
      
      // Do something here
      this.notValid = false;
    } else {
      this.notValid = true;
    }}
    public onEnterKey(event: KeyboardEvent): void {
      event.preventDefault();
    }
  public submit() {
    if (this.agentForm.invalid && this.notValid === false) {
      Object.keys(this.agentForm.controls).forEach((field) => {
        // {1}
        const control = this.agentForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }

    let myDate = this.agentForm.value.expirationDate;

    const date: NgbDate = new NgbDate(myDate.year, myDate.month, myDate.day);
    const jsDate = new Date(date.year, date.month - 1, date.day + 1);
    this.agentForm.get('expirationDate')?.setValue(jsDate);

    this.spinner.show();
    this.agentService
      .updateInformationAgentProfile(this.agentForm.value)
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.toastr.success(this.translate.instant('facility.updateSuccess'));

          this.modalService.dismissAll('Cross click');
          this.cdr.detectChanges();
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        }
      );
  }

  public onInputChange(event: any, fieldName: string) {
    if (event.isNumberValid) {
      if (fieldName === 'mobileNumber') {
        this.agentForm
          .get('mobileNumber')
          ?.setValue(
            event.phoneNumber.replace(/\s/g, '').split(event.dialCode)[1]
          );
        this.agentForm.get('countryCode')?.setValue(event.dialCode);
        this.agentForm.get('countryCodeIso')?.setValue(event.iso2Code);
      }
    } else {
      if (fieldName === 'mobileNumber') {
        this.agentForm.get('mobileNumber')?.markAsTouched({ onlySelf: true });
        this.agentForm.get('mobileNumber')?.setErrors({ incorrect: true });
      }
    }
  }
}
