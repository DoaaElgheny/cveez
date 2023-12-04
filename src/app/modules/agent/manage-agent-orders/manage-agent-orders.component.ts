import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AgentOpportunityService } from 'src/app/services/api/agent-opportunity.service';
@Component({
  selector: 'app-manage-agent-orders',
  templateUrl: './manage-agent-orders.component.html',
  styleUrls: ['./manage-agent-orders.component.scss'],
})
export class ManageAgentOrdersComponent implements OnInit {
  pageSize = 9;
  page = 1;
  collectionSize: number = 0;
  searchObj: any;
  data: any;
  currentUserName: string = String(
    localStorage.getItem('name') ? localStorage.getItem('name') : ''
  );
  opportunityId: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private agentOpportunitiesService: AgentOpportunityService,
    private spinnerService: NgxSpinnerService,
    private toaster: ToastrService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.opportunityId = params.id;
    });
  }

  handleSearch(event: any) {
    if (!event) {
      this.page = 1;
    }
    this.searchObj = event;
    this.loadData();
  }

  loadData(target?: any) {
    this.spinnerService.show();
    const startIndex = (this.page - 1) * this.pageSize;
    let filterObj: any;

    filterObj = {
      skipCount: startIndex,
      maxResultCount: this.pageSize,
      ...this.searchObj,
    };

    filterObj.opportunityId = this.opportunityId;
    let obj = Object.keys(filterObj).forEach(
      (k) => (filterObj[k] == null || k.includes('DataView')) && delete filterObj[k]
    );

     this.agentOpportunitiesService.getRequestsByAgent(filterObj).subscribe({
         next: (res) => {
           this.data = res.items;
           this.collectionSize = res.totalCount;
           this.spinnerService.hide();
           target && this.scrollToElement(target);
           this.cdr.detectChanges();
         },
         error: (err) => {
           this.spinnerService.hide();
         },
       });
  }

  toggleBin(item: any) {
    item.isBin = !item.isBin;
    this.spinnerService.show();
    this.agentOpportunitiesService
      .toggleBinOpportunity({ id: item.requestId, isBin: item.isBin })
      .subscribe({
        next: (value) => {
          this.spinnerService.hide();
          this.loadData();
          if(item.isBin) {
            this.toaster.success(
              this.translateService.instant(
                'FavouriteSearch.JobSeekerProfilePinnedSuccessfully'
              )
            );
          } else {
            this.toaster.success(
              this.translateService.instant(
                'FavouriteSearch.JobSeekerProfileUnPinnedSuccessfully'
              )
            );
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.spinnerService.hide();
        },
      });
  }

  setIsShowForOpportunity(item: any) {
   
    if (!item.isShow) {
      this.spinnerService.show();
      this.agentOpportunitiesService
        .setIsShowForOpportunity({ id: item.requestId, isShow: true })
        .subscribe({
          next: (value) => {
            this.spinnerService.hide();
            this.router.navigate([
              `/client/profile-details/${item.jobSeekerId}/false/true`,
            ]);
          },
          error: (err) => {
            this.spinnerService.hide();
          },
        });
    } else {
      this.router.navigate([`/client/profile-details/${item.jobSeekerId}/false/true`]);
    }
  }

  scrollToElement($element: any): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
