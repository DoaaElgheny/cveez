import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManagePackageService } from 'src/app/services/api/manage-package.service';
import { SubscribersType } from 'src/app/services/enums/PackageSubscribersType.enum';
import { ConditionValue } from 'src/app/services/enums/condition-value';
import { DurationPackage } from 'src/app/services/enums/duration-package';
import { UserSubscriptionCondition } from 'src/app/services/enums/user-subscription-condition';

@Component({
  selector: 'app-modal-manage-package',
  templateUrl: './modal-manage-package.component.html',
  styleUrls: ['./modal-manage-package.component.scss'],
})
export class ModalManagePackageComponent implements OnInit {
  @Input() id: number;
  @Input() data: any;
  lang: string | null = localStorage.getItem('language');
  packageEdit: any;
  packagenModalForm: FormGroup;
  packageCondationsFormArray: FormArray;
  conditionValue = ConditionValue;
  userSubscriptionCondition = UserSubscriptionCondition;
  condationsArr: any[] = [];
  theSubscribersType = SubscribersType;
  theDurationPackage=DurationPackage;
  isWeek=false;
  isDay=false;
  isMonth=false;
  constructor(
    public activeModal: NgbActiveModal,
    private _ManagePackageService: ManagePackageService,
    private formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.addPackage();
    if (this.id) {
      this.getDataByID();
    
    }
  }
  changeDuration()
  {
    if(this.packagenModalForm.get('durationPackage')?.value
    ===this.theDurationPackage.Day)
    {
      this.isDay=true;
      this.isMonth=false;
      this.isWeek=false;
    }
    if(this.packagenModalForm.get('durationPackage')?.value
    ===this.theDurationPackage.Month)
    {
      this.isDay=false;
      this.isMonth=true;
      this.isWeek=false;
    }
    if(this.packagenModalForm.get('durationPackage')?.value
    ===this.theDurationPackage.Week)
    {
      this.isDay=false;
      this.isMonth=false;
      this.isWeek=true;
    }

    this.packagenModalForm.get('subscriptionPeriod')?.setValue(null);
  }
  listOfMonths = [
    { num: 1 },
    { num: 2 },
    { num: 3 },
    { num: 4 },
    { num: 5 },
    { num: 6 },
    { num: 7 },
    { num: 8 },
    { num: 9 },
    { num: 10 },
    { num: 11 },
    { num: 12 },
    
  ];
  listOfWeeks = [
    { num: 1 },
    { num: 2 },
    { num: 3 }, 
  ];
  listOfDays = [
    { num: 1 },
    { num: 2 },
    { num: 3 }, 
    { num: 4 }, 
    { num: 5 }, 
    { num: 6 }, 
  ];
  addPackage(length = 0) {
    this.packagenModalForm = this.formbuilder.group({
      id: null,
      nameAr: [
        null,
        [
          Validators.required,
          Validators.pattern('^[\u0621-\u064A0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      nameEn: [
        null,
        [
          Validators.required,
          Validators.pattern('^[ A-Za-z_0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      descriptionAr: [
        null,
        [
          Validators.required,
          // Validators.maxLength(300),
          // Validators.pattern('^[\u0621-\u064A0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      descriptionEn: [
        null,
        [
          Validators.required,
          // Validators.maxLength(150),
          // Validators.pattern('^[ A-Za-z_0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      subscriptionPeriod: [null, [Validators.required]],
      price: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]+([.][0-9]+)?$'),
        ],
      ],
      durationPackage:[null, [Validators.required]],
      subscribersType: [null, [Validators.required]],
      packageCondations: this.formbuilder.array(
        this.packageCondationsDetailsForms(length)
      ),
    });

    this.packagenModalForm
      .get('subscribersType')
      ?.valueChanges.subscribe((subscribersType: any) => {
        this.getCondition(subscribersType);
      });
  }

  getDataByID() {
    this._ManagePackageService.getPackageById(this.id).subscribe({
      next: (data: any) => {
        data.packageCondations.map(
          (i: any) => (i.name = this.lang === 'ar' ? i.nameAr : i.nameEn)
        );
        data.packageCondations.map((element: any) => {
          if (element.value == '') {
            element.value = true;
          }
          return element;
        });
        this.packageEdit = data;
        this.packagenModalForm.patchValue(this.packageEdit);
        if(this.packagenModalForm.get('durationPackage')?.value
        ===this.theDurationPackage.Day)
        {
          this.isDay=true;
          this.isMonth=false;
          this.isWeek=false;
        }
        if(this.packagenModalForm.get('durationPackage')?.value
        ===this.theDurationPackage.Month)
        {
          this.isDay=false;
          this.isMonth=true;
          this.isWeek=false;
        }
        if(this.packagenModalForm.get('durationPackage')?.value
        ===this.theDurationPackage.Week)
        {
          this.isDay=false;
          this.isMonth=false;
          this.isWeek=true;
        }
      },
      error: () => {},
    });
  }

  packageCondationsDetailsForms(length: any): FormGroup[] {
    let packageCondationsDetailsForms: FormGroup[] = [];
    for (let index = 0; index < length; index++) {
      let packageCondationsDetailsForm = this.formbuilder.group({
        condationId: [null, Validators.required],
        value: [null],
        conditionType: [null, Validators.required],
        name: [null, Validators.required],
        conditionValue: [null, Validators.required],
      }); 
      
      packageCondationsDetailsForm
    .get('value')
    ?.valueChanges.subscribe((value: any) => {
      if(value===true && Number(packageCondationsDetailsForm.get('condationId')?.value)===4){
         
        }
    });
      packageCondationsDetailsForms.push(packageCondationsDetailsForm);
    }
   
    return packageCondationsDetailsForms;
  }

  getCondition(type: any) {
    this.spinner.show();
    
    this._ManagePackageService.getConditions(type).subscribe({
      next: (data: any) => {
     
        this.convertToFormArray().clear();
        data.map((i: any) => {
          (i.condationId = i.id), (i.value = null);
        });
        data.forEach((element: any) => {
          this.convertToFormArray(
            this.packagenModalForm.get('packageCondations')
          ).push(this.packageCondationsDetailsForms(1)[0]);
        });
        let obj = { packageCondations: data };
        if (this.packageEdit) {
          obj.packageCondations.forEach((element: any) => {
            let findId = this.packageEdit.packageCondations.find(
              (i: any) => i.condationId == element.condationId
            );
            if (findId) {
              element.value = findId.value;
            }
          });
        }
        this.packagenModalForm.patchValue(obj);
        this.spinner.hide();
      },
      error: () => {},
    });
  }

  savePackageForm() {
    // remove value if null or false
    let packageCondations =
      this.packagenModalForm.value.packageCondations.filter(
        (i: any) => i.value != null && i.value != false
      );
    const newArr = packageCondations.map((element: any) => {
      if (element.value === true) {
        element.value = '';
      }
      return element;
    });
    this.packagenModalForm.value.packageCondations = newArr;

    Object.keys(this.packagenModalForm.controls).forEach((field) => {
      // {1}
      const control = this.packagenModalForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });
    if (this.packagenModalForm.valid) {
      const newArr = packageCondations.map((element: any) => {
        if (element.value !== '') {
          element.value = element.value.toString();
        }
        return element;
      });
      this.spinner.show();
      if (this.id) {
        this._ManagePackageService
          .editPackage(this.packagenModalForm.value)
          .subscribe({
            next: (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('managePackage.editTostar')
              );
              this.modalService.dismissAll('Cross click');
              this.cdr.detectChanges();
            },
            error: (err) => {
            
              this.spinner.hide();
              this.toastr.error(err.error.error.message);
            },
          });
      } else {
        this._ManagePackageService
          .addPackage(this.packagenModalForm.value)
          .subscribe({
            next: (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('managePackage.AddedSuccessfully')
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

  convertToFormArray(formControl?: any) {
    return this.packagenModalForm.controls.packageCondations as FormArray;
  }
}
