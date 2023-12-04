import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ManageDiscountCodesService } from 'src/app/services/api/manage-discount-codes.service';
import { DiscountCondtion } from 'src/app/services/enums/discount-code.enum';

@Component({
  selector: 'app-add-discount-code',
  templateUrl: './add-discount-code.component.html',
  styleUrls: ['./add-discount-code.component.scss'],
})
export class AddDiscountCodeComponent implements OnInit {
  public addForm: FormGroup = new FormGroup({});
  public partners: Array<any> = [];
  public discountCoundtion: any = DiscountCondtion;
  public disabledInput: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private manageDiscountCode: ManageDiscountCodesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.spinner.show();
    this.getData();
  }

  public initForm() {
    this.addForm = this.formbuilder.group({
      marketingPartnerId: [, Validators.compose([Validators.required])],
      code: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9.]*$'),
        ]),
      ],
      discountCondtion: [
        this.discountCoundtion.Rate,
        Validators.compose([Validators.required]),
      ],
      rate: [
        { value: null, disabled: this.disabledInput },
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ]),
      ],
      duration: [
        { value: null, disabled: !this.disabledInput },
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
    });
  }

  getData() {
    this.manageDiscountCode.getAllPartner().subscribe({
      next: (res) => {
        this.partners = res;
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      },
    });
  }

  public setInputReady(coundtion: any) {
    this.disabledInput = !this.disabledInput;
    if (coundtion == this.discountCoundtion.Rate) {
      this.addForm.get('rate')?.enable();
      this.addForm.get('duration')?.setValue(0);
      this.addForm.get('duration')?.disable();
    } else if (coundtion == this.discountCoundtion.Duration) {
      this.addForm.get('duration')?.enable();
      this.addForm.get('rate')?.setValue(0);
      this.addForm.get('rate')?.disable();
    }
  }

  submit() {
    Object.keys(this.addForm.controls).forEach((field) => {
      // {1}
      const control = this.addForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}\
      return;
    });
    if (
      this.addForm.get('rate')?.value == null &&
      this.addForm.get('duration')?.value == null
    ) {
      this.addForm.get('rate')?.setErrors({ NotChoosed: true });
      return;
    }

    if (
      this.addForm.get('discountCondtion')?.value == 1 &&
      this.addForm.get('rate')?.value != null
    ) {
      this.addForm.get('duration')?.setValue(0);
    } else if (
      this.addForm.get('discountCondtion')?.value == 2 &&
      this.addForm.get('duration')?.value != null
    ) {
      this.addForm.get('rate')?.setValue(0);
    }

    if (this.addForm.valid) {
      this.spinner.show();

      this.manageDiscountCode.addDiscountCode(this.addForm.value).subscribe({
        next: (res) => {
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant(
              'ManageDiscountCode.DiscountCodeAddedSuccessfully'
            )
          );

          this.modalService.dismissAll('Cross click');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.spinner.hide();
          this.modalService.dismissAll('Cross click');
          this.toastr.error(err.error.error.message);
        },
      });
    }
  }
}
