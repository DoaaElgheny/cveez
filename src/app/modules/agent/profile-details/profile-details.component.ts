import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from 'src/app/i18n';
import { TranslateService } from '@ngx-translate/core';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';
import { VideoStatus } from 'src/app/services/enums/video-status';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Payment,
  ConditionType,
} from 'src/app/services/enums/payment-conditions.enum';
import { LoginModalComponent } from 'src/app/modules/SharedComponent/SharedComponent/login-modal/login-modal.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Constants } from 'src/app/services/Constants/constants';
import { ViewVideoModalComponent } from './view-video-modal/view-video-modal.component';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  videoLink: any;
  videoURl: any;
  copied: boolean;
  userData: any;
  userCountry: any;
  userJobLevel: any;
  userNationality: any;
  userProfessionalCertificates: any;
  userTitles: any;
  userQualifications: any;
  userSkills: any;
  userYearsExperience: any;
  id: number;
  theLanguage: any;
  attachment: any;
  iSdownloadCv: any;
  thevideoStatus = VideoStatus;
  condtionsToCurrentUser: any
  payment: any = Payment;
  conditionType: any = ConditionType;
  CveezDownloadCondition: any = null;
  numberOfOriginalValue: number = 0;
  numberofUpdatedValue: number = 0;
  iSBackBtn:any;
  currentUser: any;
 
  constructor(
    private _location: Location,
    private managejobseekerService: JobSekerManagementService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private translateService: TranslateService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const id = this.route.snapshot.paramMap.get('id');
    this.iSdownloadCv = this.route.snapshot.paramMap.get('cv');
    this.iSBackBtn = this.route.snapshot.paramMap.get('backbtn');
    console.log(this.iSBackBtn);
    this.cdr.detectChanges()
    this.getDeatiles(id);
    this.theLanguage = this.translationService.getSelectedLanguage();
    this.PackageCondition()
  }
PackageCondition(){
  this.condtionsToCurrentUser = JSON.parse(
    String(localStorage.getItem('condtions-to-current-user'))
  );
  if (this.condtionsToCurrentUser?.paymentType === this.payment.Paied) {
    this.CveezDownloadCondition =
      this.condtionsToCurrentUser?.getConditions.find(
        (condition: any) =>
          condition.conditionType === this.conditionType.CveezDownload
      );
    this.numberOfOriginalValue = parseInt(
      this.CveezDownloadCondition?.originalValue
    );
    this.numberofUpdatedValue = parseInt(
      this.CveezDownloadCondition?.updateValue
    );
  }
  this.cdr.detectChanges()
}
  getDeatiles(id: any) {
    this.spinner.show();
    this.managejobseekerService.getJobSeekerById(id).subscribe(
      (res) => {
        this.userData = res;
        this.userSkills = res.skills;
        this.attachment = res.attachementFileStorageURL;
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.masage);
      }
    );
    this.cdr.detectChanges();
  }

  copy(value: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '30';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 4000);
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  backClicked() {
    this._location.back();
  }
  downloadCvFromMyOrder(){
    window.open(
      `${this.userData?.cvAttachementFileStorageURL}`,
      '_blank'
    );
  }
  downloadCv(seekerId?: string) {
    
    if (this.condtionsToCurrentUser?.paymentType === this.payment.Paied) {
      if (this.condtionsToCurrentUser?.getConditions?.length > 0) {
        this.condtionsToCurrentUser?.getConditions.forEach((element: any) => {
          if (this.iSdownloadCv == 'false') {
            window.open(
              `${this.userData?.cvAttachementFileStorageURL}`,
              '_blank'
            );
            this.PackageCondition()
          } else if (
            element.conditionType === this.conditionType.CveezDownload &&
            parseInt(element.updateValue) > 0
          ) {
            window.open(
              `${this.userData?.cvAttachementFileStorageURL}`,
              '_blank'
            );
            this.PackageCondition()
            if (
              this.currentUser.roles[0] === Constants.AllRoles.cveezAgent &&
              this.iSdownloadCv == 'true'
            ) {
              this.spinner.show();
              this.managejobseekerService.downloadCv(seekerId).subscribe({
                next: (res) => {
         
                  this.authService.getconditionsToCurrentUser();
                  setTimeout(() => {
                     this.PackageCondition()
                  }, 1000);
                 
                  this.spinner.hide();
                  this.toastr.success(
                    this.translateService.instant(
                      'viewProfileuser.CVDownloadedSuccessfully'
                    )
                  );
                },
                error: (err) => {
                  this.spinner.hide();
                  this.toastr.error(err.error.error.message);
                },
              });
            }
          } else if (
            element.conditionType === this.conditionType.CveezDownload &&
            parseInt(element.updateValue) === 0
          ) {
            const loginModal = this.modalService.open(LoginModalComponent, {
              size: 'md',
              keyboard: false,
              centered: true,
            });

            loginModal.componentInstance.expiredMode = true;
            loginModal.componentInstance.expiredText =
              this.translateService.instant('Search.RenewDownloadText');

            loginModal.result.then(hideFn, hideFn).catch((result) => {
              if (result) {
              }
            });
          }
        });
      } else {
        this.spinner.show();
        window.open(`${this.userData?.cvAttachementFileStorageURL}`, '_blank');
        this.managejobseekerService.downloadCv(seekerId).subscribe({
          next: (res) => {
            this.authService.getconditionsToCurrentUser();
            this.PackageCondition()
            this.spinner.hide();
            this.toastr.success(
              this.translateService.instant(
                'viewProfileuser.CVDownloadedSuccessfully'
              )
            );
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message);
          },
        });
      }
    } else if (
      this.condtionsToCurrentUser?.paymentType === this.payment.Expired
    ) {
      this.openRenewalPackage();
    }
  }

  showVideo() {
    if (this.userData?.vedioStatus === this.thevideoStatus.Accepted &&
      this.userData?.vedioAttachementFileStorageURL !== null) {
        const viewVideoModal = this.modalService.open(ViewVideoModalComponent, {
          size: 'md',
          keyboard: false,
          centered: true,
        });

        viewVideoModal.componentInstance.videoLink =
          this.userData?.vedioAttachementFileStorageURL;
        viewVideoModal.componentInstance.vedioStatus = this.userData?.vedioStatus;

        viewVideoModal.result.then(hideFn, hideFn).catch((result) => {
          if (result) {
          }
        });
      }
  }

  openRenewalPackage() {
    const loginModal = this.modalService.open(LoginModalComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    loginModal.componentInstance.expiredMode = true;
    loginModal.componentInstance.expiredText = this.translateService.instant(
      'Search.RenewAddText'
    );

    loginModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
      }
    });
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
