import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ManageClassificationService } from 'src/app/services/api/manage-classification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-mange-classification',
  templateUrl: './modal-mange-classification.component.html',
  styleUrls: ['./modal-mange-classification.component.scss'],
})
export class ModalMangeClassificationComponent implements OnInit {
  @Input() name: any;
  @Input() id: number;
  classificationEdit: any;
  classificationModalForm: FormGroup;
  commercialName: any;
  commercialStorageFileName: any;
  constructor(
    public activeModal: NgbActiveModal,
    private _ManageClassificationService: ManageClassificationService,
    private formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.addclassification();
    if (this.id) {
      this.getDataByID();
    }
  }
  // classificationModalForm: FormGroup = new FormGroup({
  //   name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  //   description: new FormControl(null),
  //   attachementFileStorageName: new FormControl(null),
  // });
  handelForm(classificationModalForm: FormGroup) {
    
  }

  addclassification() {
    this.classificationModalForm = this.formbuilder.group({
      id: [],
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
          Validators.pattern('^[\u0621-\u064A0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      descriptionEn: [
        null,
        [
          Validators.required,
          Validators.pattern('^[ A-Za-z_0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      attachementName: [null, [Validators.required]],
      attachementFileStorageName: [null, [Validators.required]],
    });
  }

  saveClassificationForm() {
    Object.keys(this.classificationModalForm.controls).forEach((field) => {
      // {1}
      const control = this.classificationModalForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });

    if (this.classificationModalForm.valid) {
      this.spinner.show();
      if (this.id) {
        this._ManageClassificationService
          .editClassification(this.classificationModalForm.value)
          .subscribe(
            (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('manageClassification.editToastr')
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
        this._ManageClassificationService
          .addClassification(this.classificationModalForm.value)
          .subscribe(
            (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('manageClassification.add')
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

  uploadImg(data: any) {
  

    this.classificationModalForm
      .get('attachementName')
      ?.setValue(data.storageFileName);
    this.classificationModalForm
      .get('attachementFileStorageName')
      ?.setValue(data.storageFileName);
      this.commercialName = null;
      this.commercialStorageFileName = data.storageFileName;
  }
  getDataByID() {
    this._ManageClassificationService.getClassificationById(this.id).subscribe(
      (data: any) => {
        this.classificationEdit = data;
  
        this.classificationModalForm.patchValue(this.classificationEdit);
        this.commercialName = data.attachementFileStorageURL;
        this.commercialStorageFileName = data.attachementFileStorageURL;
      },
      () => {}
    );
  }

  deleteCmmircalImage() {
    this.commercialName = null;
    this.commercialStorageFileName = null;
    this.classificationModalForm.get('attachementName')?.setValue(null);
    this.classificationModalForm
      .get('attachementFileStorageName')
      ?.setValue(null);
  }
}
