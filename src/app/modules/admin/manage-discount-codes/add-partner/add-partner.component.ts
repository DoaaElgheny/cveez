import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { ManageDiscountCodesService } from 'src/app/services/api/manage-discount-codes.service';
@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss'],
})
export class AddPartnerComponent implements OnInit {
  public addForm: FormGroup = new FormGroup({});
  public CountryISO: any = '';
  public PhoneNumberFormat: any = null;
  public SearchCountryField: any = null;
  public selectedCountryIso: any = '';
  public mobileNumber: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private manageDiscountCode: ManageDiscountCodesService
  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
  }

  ngOnInit(): void {
    this.initForm();
  }

  public initForm() {
    this.addForm = this.formbuilder.group({
      name: [null, Validators.compose([Validators.required])],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      mobileNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Mobile),
        ]),
      ],
      countryCode: [null, Validators.compose([Validators.required])],
      countryCodeIso: [null, Validators.compose([Validators.required])],
      rate: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ]),
      ],
    });
  }

  public onInputChange(event: any) {
    if (event.isNumberValid) {
      this.addForm
        .get('mobileNumber')
        ?.setValue(
          event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
        );
      this.addForm.get('countryCode')?.setValue(event.dialCode);
      this.addForm.get('countryCodeIso')?.setValue(event.iso2Code);
    } else {
      this.addForm.get('mobileNumber')?.markAsTouched({ onlySelf: true });
      this.addForm.get('mobileNumber')?.setErrors({ required: true });
    }
  }

  submit() {
    Object.keys(this.addForm.controls).forEach((field) => {
      // {1}
      const control = this.addForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });
    if (this.addForm.valid) {
      this.spinner.show();

      this.manageDiscountCode.addPartner(this.addForm.value).subscribe({
        next: (res) => {
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant(
              'ManageDiscountCode.PartnerAddedSuccessfully'
            )
          );
          this.modalService.dismissAll('Cross click');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        },
      });
    }
  }
}
