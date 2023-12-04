import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageNotificationsService } from 'src/app/services/api/manage-notifications.service';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendWay } from 'src/app/services/enums/sendWay.enum';
import { NotifyUserType } from 'src/app/services/enums/NotifyUserType';
import { State } from 'src/app/services/enums/notificationState';
import { ModalManageNotificationsComponent } from './modal-manage-notifications/modal-manage-notifications.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-notifications',
  templateUrl: './manage-notifications.component.html',
  styleUrls: ['./manage-notifications.component.scss'],
})
export class ManageNotificationsComponent implements OnInit {
  constructor(
    private _ManageNotificationsService: ManageNotificationsService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
    private modalService: NgbModal
  ) {}
  totalCount: number;
  payMent: number = 0;
  // السطر ده فايدته انه شايل الداتا اللي جايه من اليوزر ويحطها هنا
  //جايه من اليوزر عن طريق ال ngmodal في ال اتش تى ام ال
  //drop down => filterاو toggle =>change state
  //sendway => معناه نوع الأشعار
  // هنا في الدروب دون
  sendWayInFiltration = '';
  NotifyUserTypeInFiltration = '';
  StateInFiltration = '';
  //السطر ده لازمته انه شايل ال انم فقط 32
  theSendWay = SendWay;
  theNotifyUserType = NotifyUserType;
  messageState = State;
  searchText: string = '';
  page: number = 1;
  pageSize: number = 9;
  allManageNotifications: any[] = [];
  fromSearchInput: boolean = false;
  filterObj = this.initFilterObj();
  from: any;
  to: any;
  dateText1: any;
  dateText2: any;
  // fromSearchInput: boolean = false; // that for reset btn

  ngOnInit(): void {
    this.getMangeNotification();
  }
  getMangeNotification() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    if (this.dateText2 != null && this.dateText2 != '') {
      this.to = this.dateText2;

      let myDate2 = this.to;
      const date2: NgbDate = new NgbDate(
        myDate2.year,
        myDate2.month,
        myDate2.day
      );
      const jsDate2 = new Date(date2.year, date2.month - 1, date2.day);
      this.to = this.datepipe.transform(jsDate2, 'yyyy-MM-dd');
    } else {
      this.to = '';
    }

    this.filterObj.SendDate = this.to;
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;
    this.filterObj.SendWay = this.sendWayInFiltration;
    this.filterObj.UserType = this.NotifyUserTypeInFiltration;
    this.filterObj.State = this.StateInFiltration;
    this.filterObj.Title = this.searchText;
    this.filterObj.maxResultCount = this.pageSize;
    this._ManageNotificationsService
      .getAllManageNotifications(this.filterObj)
      .subscribe((res) => {
        this.allManageNotifications = res.items;
        
        this.totalCount = res.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      });
  }

  initFilterObj() {
    return {
      Title: this.searchText,
      sorting: 'id',
      skipCount: 0,
      SendDate: this.to,
      UserType: this.NotifyUserTypeInFiltration,
      SendWay: this.sendWayInFiltration,
      State: this.StateInFiltration,
      maxResultCount: this.pageSize,
    };
  }
  rest() {
    this.searchText = '';
    this.to = '';
    this.NotifyUserTypeInFiltration = '';
    this.sendWayInFiltration = '';
    this.StateInFiltration = '';
    this.dateText2 = '';
    this.getMangeNotification();
  }
  
  deleteNotiification(sendId: number, sendName: string) {
    this.confirmationDialogService
      .confirm(
        this.translate.instant('managePackage.deleteConfirmation'),
        this.translate.instant('ManageNotifications.deleteText'),
        sendName
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.spinner.show();
          this._ManageNotificationsService.deleteNotification(sendId).subscribe(
            (result) => {
              this.spinner.hide();
              this.getMangeNotification();
              this.cdr.detectChanges();
              this.toastr.success(
                this.translate.instant('ManageNotifications.deleteSuccess')
              );
            },
            (err) => {
              this.spinner.hide();
              console.log(err);
            }
          );
        } else {
        }
      })
      .catch(() =>
        console.log(
          'User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'
        )
      );
  }
  //
  openModal(id?: number) {
    const modalRef = this.modalService.open(
      ModalManageNotificationsComponent,
      {}
    );
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.getMangeNotification =
      this.getMangeNotification.bind(this);

    // modalRef.componentInstance.data = this.data;

    modalRef.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getMangeNotification();
        
      }
    });

    // function hideFn(value: any) {
    //   throw new Error('Function not implemented.');
    // }

    // this is functon  end
  }
}
function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
