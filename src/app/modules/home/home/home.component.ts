import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../auth';
import { ManageClassificationService } from 'src/app/services/api/manage-classification.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/common/communication.service';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LoginModalComponent } from 'src/app/modules/SharedComponent/SharedComponent/login-modal/login-modal.component';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'src/app/i18n/translation.service';
import { ViewVideoComponent } from '../view-video/view-video.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: any;
  paymentType: any;
  yearsExperienceId: any;
  apiURL = environment.api_url;
  public url = this.apiURL + 'api/app/manage-opportunity/search-country';
  search: String = '';
  apiMode = 'https';
  apiParam = 'text';
  public query = '';
  tab = 0;
  searchKeyword: string = '';
  countryName: string = '';
  lang = this.translate.getSelectedLanguage();
  images = [
    // '/assets/imgs/home-bg.jpg',
    '../../../../assets/imgs/1_Resized.jpg',
    '../../../../assets/imgs/2_Resized.jpg',
    '../../../../assets/imgs/3_Resized.jpg',
    '../../../../assets/imgs/4_Resized.jpg',
    '../../../../assets/imgs/background-png4.png',

  ];

  constructor(
    private authService: AuthService,
    private _ManageClassificationService: ManageClassificationService,
    private _AgentManagementService: AgentManagementService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translate: TranslationService,
    public router: Router,
    private communicationService: CommunicationService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.communicationService.getHeaderClass(true);
  }
  totalCount: number;
  payMent: number = 0;
  page: number = 1;
  pageSize: number = 8;
  allClassification: any[] = [];
  filterObj = this.initFilterObj();
  allAgent: any[] = [];
  @ViewChild('ngcarousel', { static: true }) ngCarousel!: NgbCarousel;

  @ViewChild('carousel')
  carousel: any;
  nextFun() {
    this.carousel.next();
    window.scrollTo(0, 0);
  }

  prevFun() {
    this.carousel.prev();
    window.scrollTo(0, 0);
  }
  wattsApp() {
    let href='cveez';

      return window.open('https://api.whatsapp.com/send?phone=971543349643', '_blank');
    
  }
  ngOnInit() {
    this.spinner.show();
    this.currentUser = this.authService.getCurrentUser();

    this.paymentType = this.authService.getpaymentType();
    this.yearsExperienceId = this.authService.getyearsExperienceId();
    this.getAllClassification();
    this.getAgentsData();
  }

  ngOnDestroy(): void {
    this.communicationService.getHeaderClass(false);
  }

  goToDefaultPage() {
    this.authService.goToDefaultPage(
      this.currentUser,
      this.paymentType,
      this.yearsExperienceId
    );
  }

  getAllClassification() {
    this.spinner.show();
    this._ManageClassificationService
      .getClassificationsList()
      .subscribe((res) => {
        this.allClassification = res.slice(0, 8);
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

  getAgentsData() {
    this.spinner.show();
    this._AgentManagementService.getAgents().subscribe((res) => {
      this.allAgent = res;
      this.totalCount = res.totalCount;
      this.spinner.hide();
      this.cdr.detectChanges();
    });
  }

  searchChange(event: any) {
    this.searchKeyword = event.target.value;
    this.search = event.target.value;
    localStorage.setItem('seachKey', this.searchKeyword);
  }

  submitSearch() {
    localStorage.setItem('pageID','1')
    this.router.navigateByUrl('client/job-search');
  }

  handleResultSelected(e: any) {
    localStorage.setItem('countryId', e.id);
    this.search = e ? e.countryAr : '';
    this.countryName = e.countryAr;
  }

  redirectToSearch(classificationId: any): void {
    localStorage.setItem('classificationId', classificationId);
    this.router.navigateByUrl(`client/job-search`);
  }
  openViewVideoModal() {
    const modalRef = this.modalService.open(ViewVideoComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.result.then(hideFn, hideFn).catch((result) => {
    });
  }

  viewAgent(agentId: any) {
    if (!this.currentUser) {
      const loginModal = this.modalService.open(LoginModalComponent, {
        size: 'md',
        keyboard: false,
        centered: true,
      });

      loginModal.result.then(hideFn, hideFn).catch((result) => {
        if (result) {
        }
      });
    } else {
      this.router.navigateByUrl(`/client/show-agent/${agentId}`);
    }
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
