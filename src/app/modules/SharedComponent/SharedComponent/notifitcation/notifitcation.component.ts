import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/services/api/notification.service';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MessagingService } from 'src/app/services/api/messaging.service';

@Component({
  selector: 'app-notifitcation',
  templateUrl: './notifitcation.component.html',
  styleUrls: ['./notifitcation.component.scss'],
})
export class NotifitcationComponent implements OnInit {
  constructor(
    private _NotificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
    private messageService:MessagingService
  ) {}

  from: any;
  to: any;
  dateText1: any;
  dateText2: any;
  startDate: any;
  totalCount: number;
  payMent: number = 0;
  page: number = 1;
  pageSize: number = 9;
  filterObj = this.initFilterObj();
  allNotifications: any[] = [];

  ngOnInit(): void {
    this.getUserAllNotifications();
    this.messageService.getReadNotifications();
  }
  getUserAllNotifications() {
    this.spinner.show();
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
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.MaxResultCount = this.pageSize;
    if (this.dateText1 != null && this.dateText1 != '') {
      this.from = this.dateText1;
      let myDate1 = this.from;

      const date1: NgbDate = new NgbDate(
        myDate1.year,
        myDate1.month,
        myDate1.day
      );
      const jsDate1 = new Date(date1.year, date1.month - 1, date1.day);
      this.from = this.datepipe.transform(jsDate1, 'yyyy-MM-dd');
    } else {
      this.from = '';
    }
    this.filterObj.From = this.from;
    this.filterObj.To = this.to;
    this._NotificationService
      .getAllNotifications(this.filterObj)
      .subscribe((data) => {
        this.allNotifications = data.items;
        this.totalCount = data.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      });
  }
  initFilterObj() {
    return {
      From: null,
      To: null,
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
    };
  }
}
