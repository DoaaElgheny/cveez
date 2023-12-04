import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbDate,
  NgbDateStruct,
  NgbDatepickerConfig,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageNotificationsService } from 'src/app/services/api/manage-notifications.service';
import { NotifyUserType } from 'src/app/services/enums/NotifyUserType';
import { SendWay } from 'src/app/services/enums/sendWay.enum';

@Component({
  selector: 'app-modal-manage-notifications',
  templateUrl: './modal-manage-notifications.component.html',
  styleUrls: ['./modal-manage-notifications.component.scss'],
})
export class ModalManageNotificationsComponent implements OnInit {
  @Input() id: number;
  editNotifications: any;
  notificationModalForm: FormGroup;
  commercialName: any;
  public minDate: NgbDateStruct;
  theSendWay = SendWay;
  theNotifyUserType = NotifyUserType;
  constructor(
    public activeModal: NgbActiveModal,
    private _ManageNotificationsService: ManageNotificationsService,
    private formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private config: NgbDatepickerConfig
  ) {}
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  ngOnInit(): void {
    this.addANotification();
    if (this.id) {
      this.getDataByID();
    }
  }
  addANotification(length = 0) {
    this.notificationModalForm = this.formbuilder.group({
      id: null,
      titleAr: [
        null,
        [
          Validators.required,
          // Validators.pattern('^[\u0621-\u064A0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      titleEn: [
        null,
        [
          Validators.required,
          // Validators.pattern('^[ A-Za-z_0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      detailsAr: [
        null,
        [
          Validators.required,
          Validators.maxLength(250),
          // Validators.pattern('^[\u0621-\u064A0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      detailsEn: [
        null,
        [
          Validators.required,
          Validators.maxLength(250),
          // Validators.pattern('^[ A-Za-z_0-9 @./#%$!:/"&*+-]+$'),
        ],
      ],
      sendDate: [null, [Validators.required]],
      userType: [null, [Validators.required]],
      sendWay: [null, [Validators.required]],
    });
  }
  saveNotificationForm() {
    Object.keys(this.notificationModalForm.controls).forEach((field) => {
      // {1}
      const control = this.notificationModalForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });

    if (this.notificationModalForm.valid) {
      this.spinner.show();
      let myDate = this.notificationModalForm.value.sendDate;
      const date: NgbDate = new NgbDate(myDate.year, myDate.month, myDate.day);
      const jsDate = new Date(date.year, date.month - 1, date.day + 1);
      this.notificationModalForm.get('sendDate')?.setValue(jsDate);
      if (this.id) {
        this._ManageNotificationsService
          .editNotification(this.notificationModalForm.value)
          .subscribe(
            (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('ManageNotifications.editToastr')
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
        this._ManageNotificationsService
          .addNotifications(this.notificationModalForm.value)
          .subscribe(
            (res) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('ManageNotifications.add')
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
  getDataByID() {
    this._ManageNotificationsService.getNotificationById(this.id).subscribe(
      (data: any) => {
        this.editNotifications = data;
      
        this.notificationModalForm.patchValue(this.editNotifications);
        let exdate = new Date(data.sendDate);
        var ngbDateStruct = {
          day: exdate.getDate(),
          month: exdate.getMonth() + 1,
          year: exdate.getFullYear(),
        };

        this.notificationModalForm.get('sendDate')?.setValue(ngbDateStruct);
        // this.commercialName = data.attachementFileStorageURL;
        // this.commercialStorageFileName = data.attachementFileStorageURL;
      },
      () => {}
    );
  }
}
