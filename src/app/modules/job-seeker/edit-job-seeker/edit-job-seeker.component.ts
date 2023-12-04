import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from 'src/app/i18n';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageClientService } from 'src/app/services/api/manage-client.service';
import { JobSeekerInformationComponent } from './models/job-seeker-information/job-seeker-information.component';
import { JobSeekerBackgroundInformationComponent } from './models/job-seeker-background-information/job-seeker-background-information.component';
import { ChangePassword } from '../../auth/models/change-password';
import { ChangePasswordComponent } from './models/change-password/change-password.component';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';
import { VideoStatus } from 'src/app/services/enums/video-status';
import { AuthService } from '../../auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { NotCompleteComponent } from './models/not-complete/not-complete.component';

@Component({
  selector: 'app-edit-job-seeker',
  templateUrl: './edit-job-seeker.component.html',
  styleUrls: ['./edit-job-seeker.component.scss'],
})
export class EditJobSeekerComponent implements OnInit {
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
  userspecializations: any;
  userYearsExperience: any;
  id: number;
  theLanguage: any;
  attachment: any;
  thevideoStatus = VideoStatus;
  constructor(
    private manageClientService: ManageClientService,
    private managejobseekerService: JobSekerManagementService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getDeatiles(0);
   
    this.theLanguage = this.translationService.getSelectedLanguage();
  }

  getDeatiles(id: any) {
    this.spinner.show();
    this.manageClientService.userDetails(id).subscribe(
      (res) => {
        this.userData = res;
        this.userCountry = res.country;
        this.userJobLevel = res.jobLevel;
        this.userNationality = res.nationality;
        this.userProfessionalCertificates = res.professionalCertificates;
        this.userQualifications = res.qualifications;
        this.userSkills = res.skills;
        this.userspecializations = res.specializations;
        this.userYearsExperience = res.yearsExperience;
        this.userTitles = res.titles;
        this.attachment = res.attachementFileStorageURL;

        if(res.cvAttachementFileStorageName==null)
        {
          this.openModal();
        }
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

  openModal() {
    const infoModel = this.modalService.open(NotCompleteComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    infoModel.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
     
      }
    });
  }
  openSeekerInfo() {
    const infoModel = this.modalService.open(JobSeekerInformationComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });
    infoModel.componentInstance.seekerData = this.userData;

    infoModel.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getDeatiles(0);
      }
    });
  }

  openSeekerBackgroundInfo() {
    const backInfoModel = this.modalService.open(
      JobSeekerBackgroundInformationComponent,
      {
        size: 'xl',
        keyboard: false,
        centered: true,
      }
    );

    backInfoModel.componentInstance.seekerData = this.userData;

    backInfoModel.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getDeatiles(0);
      }
    });
  }

  openChangePasswordModal() {
    const changeModel = this.modalService.open(ChangePasswordComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });
    changeModel.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getDeatiles(0);
      }
    });
  }
  paymentRoute(){
    this.router.navigate(['/client/payment-package']);
    window.scrollTo(0, 0);
  }

  public uploadPersonalImg(data: any) {
    this.managejobseekerService
      .editPersonalImage({
        attachementName: data.storageFileName,
        attachementFileStorageName: data.storageFileName,
      })
      .subscribe(
        (res) => {
          this.toastr.success(
            this.translate.instant('profileToastr.profilePicture')
          );
          this.authService.image = this.authService.getImage();
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(error.masage);
        }
      );
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
