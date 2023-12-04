import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MyOrderJopSeekerService } from 'src/app/services/api/my-order-jop-seeker.service';
import { PackageConditionService } from 'src/app/services/common/package-condition.service';
import { OpportunityAcceptanceState } from 'src/app/services/enums/opportunity.enum';
import {
  Payment,
  ConditionType,
} from 'src/app/services/enums/payment-conditions.enum';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-save-job',
  templateUrl: './save-job.component.html',
  styleUrls: ['./save-job.component.scss'],
})
export class SaveJobComponent implements OnInit {
  isDetails: any;
  totalCount: number;
  date: string = '';
  searchText: string = '';
  page: number = 1;
  pageSize: number = 10;
  allOrder: any[] = [];
  filterObj = this.initFilterObj();
  theOpportunityAcceptanceState = OpportunityAcceptanceState;
  orderDetails: any;
  
  payment: any = Payment;
  logoConditions: boolean;
  ShowOpportunityCondition: boolean;
  yearsExperienceId: any;
  paymentType:any
  constructor(
    private cdr: ChangeDetectorRef,
    private packageConditionService: PackageConditionService,
    private myOrderService: MyOrderJopSeekerService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.yearsExperienceId = this.authService.getyearsExperienceId();
    this.packageConditionService.getConditionPackage();
    this.getConditionPackage();
    this.getAllOrdersData();
  }
  getConditionPackage() {

    this.packageConditionService.ShowOpportunityCondition$.subscribe(
      (val: any) => {
        this.ShowOpportunityCondition = val;
      }
    );
    this.packageConditionService.logoConditions$.subscribe((val: any) => {
      this.logoConditions = val;
    });
    
    this.packageConditionService.paymentType$.subscribe(
      (val: any) => {
        this.paymentType = val;
      }
    );
    this.cdr.detectChanges()
  }
  getAllOrdersData() {
    this.spinner.show();
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;

    this.filterObj.maxResultCount = this.pageSize;

    this.myOrderService.getallSavedJob(this.filterObj).subscribe((res) => {
      this.allOrder = res.items;
      if(this.allOrder){
        this.isDetails=null
        this.orderDetails=null}
      if (
        this.allOrder.length > 0 &&
        this.paymentType === this.payment.Paied
      ) {
        this.isDetails = this.allOrder[0]?.id;
       
          this.showDetails(this.allOrder[0]);
       
      }
      this.totalCount = res.totalCount;
      this.spinner.hide();
      this.cdr.detectChanges();
    });
  }

  initFilterObj() {
    return {
      sorting: 'id',
      skipCount: 0,
      maxResultCount: this.pageSize,
    };
  }

  reload(event: any) {
    this.spinner.show();
    this.getAllOrdersData();
    this.spinner.hide();
  }

  showDetails(item: any) {
    
    this.isDetails = item?.id;
    this.myOrderService.getDetails(item?.id).subscribe((res) => {
      this.orderDetails = res;
      this.spinner.hide();
      this.cdr.detectChanges();
    });
  }

  details(event: any) {
    this.isDetails = event.isDetails;
    this.orderDetails = event.object;
  }

  downloadFile(file: any) {
    this.spinner.show();
    window.open(file);
    this.spinner.hide();
  }
}
