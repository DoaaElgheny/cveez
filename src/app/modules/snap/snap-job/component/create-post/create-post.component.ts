import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManagePostService } from 'src/app/services/api/manage-post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  @Input() currentUser: any;
  content: any;
  @Input() id: any;
  public form: FormGroup = new FormGroup({});

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    private managePostService: ManagePostService,
    public activeModal: NgbActiveModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  
    // if (this.id !== 0) {
    //   this.getByID();
    // }
  }

  getByID() {
    this.managePostService.getByID(this.form.value).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.form.patchValue(res);
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      },
    });
  }

  initForm() {
    this.form = this.fb.group({
      id: [],
      content: [false, Validators.required],
      postAttachements: this.fb.array(this.initImages(0)),
    });
  }

  initImages(Length = 0): FormGroup[] {
    let ImagesFromArray: FormGroup[] = [];
    for (let index = 0; index < Length; index++) {
      let Images = this.fb.group({
        attachementName: [null],

        attachementType: [null],
        attachementFileStorageName: [null],
      });
      ImagesFromArray.push(Images);
    }
    return ImagesFromArray;
  }

  uploadImage(data: any) {
    this.convertToFormArray(this.form.get('postAttachements')).push(
      this.initImages(1)[0]
    );

    this.form.get('postAttachements')!.value[
      this.form.get('postAttachements')!.value.length - 1
    ]['attachementType'] = 2;
    this.form.get('postAttachements')!.value[
      this.form.get('postAttachements')!.value.length - 1
    ]['attachementName'] = data.fileName;
    this.form.get('postAttachements')!.value[
      this.form.get('postAttachements')!.value.length - 1
    ]['attachementFileStorageName'] = data.storageFileName;
    this.form.get('postAttachements')!.value[
      this.form.get('postAttachements')!.value.length - 1
    ]['attachementFileStorageURL'] =
      `${environment.BlobUrl}` + data.storageFileName;
    this.cdr.detectChanges();
  }
  convertToFormArray(formControl: any): FormArray {
    return formControl as FormArray;
  }
  submit() {
    if (this.form.valid) {
      // this.addGym.get('nameAr')?.setValue(this.addGym.get('nameEn')?.value);
      this.spinner.show();
      if (this.id === 0) {
        this.managePostService.addPost(this.form.value).subscribe({
          next: (res) => {
            this.spinner.hide();
            this.toastr.success(
              this.translate.instant('editGroup.AdUpdatedSuccessfully')
            );
            this.activeModal.dismiss('Cross click');
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          },
        });
      } else {
        this.managePostService.editPost(this.form.value).subscribe({
          next: (res) => {
            this.spinner.hide();
            this.toastr.success(
              this.translate.instant('editGroup.AdUpdatedSuccessfully')
            );
            this.activeModal.dismiss('Cross click');
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          },
        });
      }
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field); // {2}
        control?.markAsTouched({ onlySelf: true });
        return;
      });
    }
  }
  onFocusOut(event: any) {
    const id = event.srcElement.parentElement.parentElement.getAttribute('id');
    const content = event.target.innerText;
    event.target.innerText = content;
    this.content = content;
    this.form.get('content')?.setValue(content);
    this.cdr.detectChanges();
  }
}
