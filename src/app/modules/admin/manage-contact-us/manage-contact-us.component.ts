import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ContactUsService } from 'src/app/services/api/contact-us.service';
import { ComplaintType } from 'src/app/services/enums/complaintType.enum';
import { MessageType } from 'src/app/services/enums/messageType.enum';
import { ModalManageContactUsComponent } from './modal-manage-contact-us/modal-manage-contact-us.component';
import { UserType } from 'src/app/services/enums/contact-us.enum';

@Component({
  selector: 'app-manage-contact-us',
  templateUrl: './manage-contact-us.component.html',
  styleUrls: ['./manage-contact-us.component.scss'],
})
export class ManageContactUsComponent implements OnInit {
  constructor(
    private _ContactUsService: ContactUsService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public datepipe: DatePipe
  ) {}
  from: any;
  to: any;
  dateText1: any;
  dateText2: any;
  // startDate: any;
  theMessageTypeSelect: any;
  totalCount: number;
  payMent: number = 0;
  // السطر ده فايدته انه شايل الداتا اللي جايه من اليوزر ويحطها هنا
  //جايه من اليوزر عن طريق ال ngmodal في ال اتش تى ام ال
  MessageTypeStatus = '';
  userTypeStatus = '';
  page: number = 1;
  pageSize: number = 9;
  allMessages: any[] = [];
  //السطر ده لازمته انه شايل ال انم فقط 32
  theMessageType = MessageType;
  theuserType = UserType;
  complain = ComplaintType;
  fromSearchInput: boolean = false;
  filterObj = this.initFilterObj();
  ngOnInit(): void {
    this.getAllMessages();
  }
  getAllMessages() {
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
    this.filterObj.MessageType = this.MessageTypeStatus;
    this.filterObj.UserType = this.userTypeStatus;
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
    this._ContactUsService.getAllMessage(this.filterObj).subscribe((res) => {
      this.allMessages = res.items;
  
      // why  we use this.totalCount?
      this.totalCount = res.totalCount;
      this.spinner.hide();
      this.cdr.detectChanges();
    });
  }

  initFilterObj() {
    return {
      From: null,
      To: null,
      Sorting: 'id',
      MessageType: this.MessageTypeStatus,
      UserType: this.userTypeStatus,
      SkipCount: 0,
      MaxResultCount: this.pageSize,
    };
  }

  rest() {
  this.dateText1 ='';
  this.dateText2 ='';
    this.MessageTypeStatus = '';
    this.userTypeStatus = '';
    this.getAllMessages();
  }

  selectMessageType(message: any, event: any) {

    let data = {
      id: message.id,
      // complaintType: message.complaintType,
      complaintType: event.target.value,
    };
    this._ContactUsService.setComplain(data).subscribe(
      (res) => {
        this.cdr.detectChanges();
        this.spinner.hide();
        this.toastr.success(
          this.translate.instant('manageContactUs.statusChangedSuccessfully')
        );
        this.getAllMessages();
        this.theMessageTypeSelect = null;
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.masage);
      }
    );
  }
  open(id?: number, reply?: any) {
    const modalRef = this.modalService.open(ModalManageContactUsComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.reply = reply;
    modalRef.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getAllMessages();
       
      }
    });
  }
}
function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
