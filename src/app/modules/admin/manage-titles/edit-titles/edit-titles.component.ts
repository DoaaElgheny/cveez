import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageTitleService } from 'src/app/services/api/manage-title.service';
@Component({
  selector: 'app-edit-titles',
  templateUrl: './edit-titles.component.html',
  styleUrls: ['./edit-titles.component.scss'],
})
export class EditTitlesComponent implements OnInit {
  allTitles: any[] = [];
  title: any = null;
  emptyInput: boolean = false;
  addForm: FormGroup = new FormGroup({});
  dropdownSettingsSingle: IDropdownSettings = {};
  dropdownSettingsSingleEnglish: IDropdownSettings = {};
  lang: string = String(localStorage.getItem('language'));
  searchText: string | undefined = this.lang === 'ar' ? 'بحث' : 'Search';

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formbuilder: FormBuilder,
    private manageTitleService: ManageTitleService
  ) {}

  ngOnInit(): void {
    this.initAddForm();

    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: 'id',
      textField: 'nameAr',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: this.searchText,
    };

    this.dropdownSettingsSingleEnglish = {
      singleSelection: true,
      idField: 'id',
      textField: 'nameEn',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: this.searchText,
    };
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  initAddForm() {
    this.addForm = this.formbuilder.group({
      id: [null],
      nameAr: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[\u0621-\u064A0-9 @./#%$!:/"&*+-]+$'),
        ]),
      ],
      nameArId: [null],
      nameEn: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[ A-Za-z_0-9 @./#%$!:/"&*+-]+$'),
        ]),
      ],
      nameEnId: [null],
      idIsExist: [null],
    });
    this.getTitlesListData();
  }

  getTitlesListData() {
    this.spinner.show();
    this.manageTitleService.getAllTitlesDrobdown().subscribe({
      next: (res) => {
        this.allTitles = res;
        this.addForm
          .get('id')
          ?.setValue(this.title?.id ? this.title?.id : null);
        this.addForm
          .get('nameArId')
          ?.setValue(this.title ? [this.title] : null);
        this.addForm
          .get('nameAr')
          ?.setValue(this.title?.nameAr ? this.title?.nameAr : null);

        this.addForm.get('nameEnId')?.setValue([this.title]);
        this.addForm.get('nameEn')!.setValue(this.title?.nameEn);
        this.addForm.get('idIsExist')?.setValue(this.title?.id);
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      },
    });
  }

  onItemSelectSingle(item: any, selectFrom?: any, object?: any) {
    this.addForm.get('idIsExist')?.setValue(item.id);

    if ('nameAr' in item) {
      this.addForm.get('nameAr')!.setValue(item.nameAr);
      this.addForm.get('nameEnId')?.setValue(
        this.allTitles.filter((obj: any) => {
          if (obj.id === item.id) {
            this.addForm.get('nameEn')!.setValue(obj.nameEn);
            this.addForm.get('nameEn')!.markAsUntouched();
            return obj;
          }
        })
      );
    } else {
      this.addForm.get('nameEn')!.setValue(item.nameEn);
      this.addForm.get('nameArId')?.setValue(
        this.allTitles.filter((obj: any) => {
          if (obj.id === item.id) {
            this.addForm.get('nameAr')!.setValue(obj.nameAr);
            this.addForm.get('nameAr')!.markAsTouched();
            return obj;
          }
        })
      );
    }

    object._placeholder = '';
  }

  onItemDeSelectSingle(selectFrom?: any) {
    this.addForm.get('idIsExist')?.setValue(null);
    this.addForm.get(selectFrom)!.setValue(null);
    this.addForm.get(`${selectFrom}Id`)!.setValue(null);
    this.addForm.get(selectFrom)!.markAllAsTouched();
  }

  onSearchResultt(object?: any, selectedField?: any) {
    let result = object._data?.filter((item: any) => {
      if (item.text === object.filter.text) {
        return item;
      }
    });

    if (result.length == 0) {
      object._placeholder = object.filter.text;
      this.addForm.get(selectedField)?.setValue(object.filter.text);
      this.addForm.get('idIsExist')?.setValue(null);
      this.addForm.get(`${selectedField}Id`)?.setValue(null);
    } else {
      this.addForm.get('idIsExist')?.setValue(this.title?.id);
    }
  }

  submit() {
    if (!this.addForm.valid) {
      Object.keys(this.addForm.controls).forEach((field) => {
        // {1}
        const control = this.addForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}\
        return;
      });
    } else {
      this.spinner.show();
      if (this.title === null) {
        this.manageTitleService
          .addTitle({
            nameAr: this.addForm.get('nameAr')?.value,
            nameEn: this.addForm.get('nameEn')?.value,
            idIsExist: null,
          })
          .subscribe({
            next: (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('ManageTitles.TitleAddedSuccessfully')
              );
              this.modalService.dismissAll('Cross click');
            },
            error: (err) => {
              this.spinner.hide();
              this.toastr.error(err.error.error.message);
              this.modalService.dismissAll('Cross click');
            },
          });
      } else {
        this.manageTitleService
          .editTitle({
            id: this.title?.id,
            nameAr: this.addForm.get('nameAr')?.value,
            nameEn: this.addForm.get('nameEn')?.value,
            idIsExist: this.addForm.get('idIsExist')?.value,
          })
          .subscribe({
            next: (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('ManageTitles.TitleUpdatedSuccessfully')
              );
              this.modalService.dismissAll('Cross click');
            },
            error: (err) => {
              this.spinner.hide();
              this.toastr.error(err.error.error.message);
              this.modalService.dismissAll('Cross click');
            },
          });
      }
    }
  }
}
