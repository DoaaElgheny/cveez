import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MangeSubscriberPackagesService } from 'src/app/services/api/subscriber-packages.service';
import { SubscribersType } from 'src/app/services/enums/PackageSubscribersType.enum';
import { SubscriptionValidity } from 'src/app/services/enums/subscription-validity.enum';

@Component({
  selector: 'app-mange-subscriber-packages',
  templateUrl: './mange-subscriber-packages.component.html',
  styleUrls: ['./mange-subscriber-packages.component.scss'],
})
export class MangeSubscriberPackagesComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private mangeSubscriberPackagesService: MangeSubscriberPackagesService
  ) {}
  page: number = 1;
  theSubscribersType = SubscribersType;
  pageSize: number = 10;
  theSubscriberPackages: any;
  packageList: any;
  subscriptionValidity = SubscriptionValidity;
  dateText1: any;
  dateText2: any;
  startDate: any;
  endDate: any;
  searchText: string = '';
  packageId: any = '';
  totalCount: number;
  thesubscriptionValidity: number = 1;
  filterObj = this.initFilterObj();
  fromSearchInput: boolean = false;

  ngOnInit(): void {
    this.getSubscriberPackages();
    this.getPackageList();
  }

  rest() {
    this.thesubscriptionValidity = 1;
    this.dateText1 = null;
    this.dateText2 = null;
    this.searchText = '';
    this.packageId = '';

    this.getSubscriberPackages();
  }

  initFilterObj() {
    return {
      sorting: 'id',
      SubscriptionValidity: this.thesubscriptionValidity,
      StartSubscriptionDate: null,
      EndSubscriptionDate: null,
      SubscriberName: this.searchText,
      PackageId: this.packageId,
      skipCount: 0,
      maxResultCount: this.pageSize,
    };
  }

  getSubscriberPackages() {
    if(!this.fromSearchInput) {
      this.spinner.show();
    }
    if (this.dateText1 != null && this.dateText1 != '') {
      this.startDate = this.dateText1;
      let myDate1 = this.startDate;


      const date1: NgbDate = new NgbDate(
        myDate1.year,
        myDate1.month,
        myDate1.day
      );
      const jsDate1 = new Date(date1.year, date1.month - 1, date1.day);
      this.startDate = this.datepipe.transform(jsDate1, 'yyyy-MM-dd');
    } else {
      this.startDate = '';
    }

    if (this.dateText2 != null && this.dateText2 != '') {
      this.endDate = this.dateText2;

      let myDate2 = this.endDate;
      const date2: NgbDate = new NgbDate(
        myDate2.year,
        myDate2.month,
        myDate2.day
      );
      const jsDate2 = new Date(date2.year, date2.month - 1, date2.day);
      this.endDate = this.datepipe.transform(jsDate2, 'yyyy-MM-dd');
    } else {
      this.endDate = '';
    }

    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;
    this.filterObj.SubscriberName = this.searchText;
    this.filterObj.StartSubscriptionDate = this.startDate;
    this.filterObj.EndSubscriptionDate = this.endDate;
    this.filterObj.PackageId = this.packageId;
    this.filterObj.SubscriptionValidity = this.thesubscriptionValidity;
    this.filterObj.maxResultCount = this.pageSize;
    this.mangeSubscriberPackagesService
      .getsubScriberPackages(this.filterObj)
      .subscribe(
        (res) => {
          
          this.theSubscriberPackages = res.items;
          this.totalCount = res.totalCount;
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        }
      );
  }

  getPackageList() {
    this.mangeSubscriberPackagesService.getpackage().subscribe(
      (res) => {
        
        this.packageList = res;
        this.cdr.detectChanges();
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      }
    );
  }
}
