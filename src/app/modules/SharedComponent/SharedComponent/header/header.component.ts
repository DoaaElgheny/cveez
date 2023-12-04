import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { AuthService, UserType } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { MessagingService } from 'src/app/services/api/messaging.service';
import { CommunicationService } from 'src/app/services/common/communication.service';
import { PackageConditionService } from 'src/app/services/common/package-condition.service';
import {
  Payment,
  ConditionType,
} from 'src/app/services/enums/payment-conditions.enum';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  currentUser: any;
  isAdmin: boolean;
  homeHeader: boolean;
  roles = Constants.AllRoles;
  imageUrl: any = null;
  tab = 0;
  public messageNo: Number;
  private unsubscribe: Subscription[] = [];
  yearsExperienceId: any;
  constructor(
    private auth: AuthService,
    private communicationService: CommunicationService,
    private translationService: TranslationService,
    public authService: AuthService,
    private messageService: MessagingService,
    private activatedroute: ActivatedRoute,
    private packageConditionService: PackageConditionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUserData();
    // this.messageService.getUnReadNotificationsCount();
  }
  getCurrentUserData() {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.getHomeHeader();
    this.setLanguage(this.translationService.getSelectedLanguage());
    this.currentUser = this.authService.getCurrentUser();
   
    this.authService.getImage();
    this.imageUrl = this.authService.image;

    if (this.currentUser?.roles[0] == Constants.AllRoles.cveezSuperAdmin) {
      this.isAdmin = true;
      this.packageConditionService.getConditionPackage();
      this.messageService.getUnReadNotification();

      this.messageService.messageNo$.subscribe((messageNo) => {
        this.messageNo = messageNo;
      });
    } else {
      this.authService.getconditionsToCurrentUser();

      this.isAdmin = false;
      this.messageService.getUnReadNotification();

      this.messageService.messageNo$.subscribe((messageNo) => {
        this.messageNo = messageNo;
      });
      this.yearsExperienceId = this.authService.getyearsExperienceId();
      console.log(this.yearsExperienceId);
    }
  }

  logout() {
    this.auth.logout();
    this.getCurrentUserData();
  }

  selectLanguage(lang: string) {
    if (lang === 'en') {
      this.translationService.setLanguage('ar');
      this.setLanguage('ar');
    } else {
      this.translationService.setLanguage('en');
      this.setLanguage('en');
    }
    document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    // this.communicationService.getHeaderClass(false);
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  getHomeHeader() {
    this.communicationService.headerClassHome$.subscribe((val: any) => {
      this.homeHeader = val;
    });
  }
  goToNotification() {
    // this.messageService.getUnReadNotification();
    this.messageService.messageNo$.subscribe((messageNo) => {
      this.messageNo = messageNo;
    });
    this.router.navigateByUrl('/notifications');
  }
  getToAbout() {
    this.activatedroute.data.subscribe((data) => {
      if (this.router.routerState.snapshot.url == '/home') {
        document
          .getElementById('about-us')
          ?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.router.navigateByUrl('/home', { state: { id: '1', name: 'tab' } });
      }
    });
  }
  getToOurPartners() {
    this.activatedroute.data.subscribe((data) => {
      if (this.router.routerState.snapshot.url == '/home') {
        document
          .getElementById('our-partners')
          ?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.router.navigateByUrl('/home', { state: { id: '2', name: 'tab' } });
      }
    });
  }
  getToJob() {
    this.activatedroute.data.subscribe((data) => {
      localStorage.setItem('pageID', '1');
      this.router.navigateByUrl('client/job-search');
    });
  }
  goTofavorite() {
    localStorage.setItem('pageIDFavourite', '1');
    this.router.navigateByUrl('/client/favorite-search');
  }
  getToServes() {
    this.activatedroute.data.subscribe((data) => {
      if (this.router.routerState.snapshot.url == '/home') {
        document
          .getElementById('services')
          ?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.router.navigateByUrl('/home', { state: { id: '4', name: 'tab' } });
      }
    });
  }

  getToContactUs() {
    // this.activatedroute.data.subscribe((data) => {
    // if (this.router.routerState.snapshot.url == '/home') {
    //   document
    //     .getElementById('contact-us')
    //     ?.scrollIntoView({ behavior: 'smooth' });
    // } else {
    this.router.navigateByUrl('/client/contact-us', {
      state: { id: '4', name: 'tab' },
    });
    // }
    // });
  }

  changeStatus(input: any) {
    this.tab = input;
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'ar',
    name: 'العربيه',
    flag: './assets/media/flags/saudi-arabia.svg',
  },
];
