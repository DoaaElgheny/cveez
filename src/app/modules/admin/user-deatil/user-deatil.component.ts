import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { Constants } from 'src/app/services/Constants/constants';
import { ManageClientService } from 'src/app/services/api/manage-client.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-user-deatil',
  templateUrl: './user-deatil.component.html',
  styleUrls: ['./user-deatil.component.scss'],
})
export class UserDeatilComponent implements OnInit {
  constructor(
    private manageClientService: ManageClientService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService:AuthService,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService
  ) {}
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
  currentUser:any
  theLanguage: any;
  isAdmin:boolean
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getDeatiles(id);
    } else {
      this.getDeatiles(0);
    }
   
    this.theLanguage = this.translationService.getSelectedLanguage();
    this.currentUser = this.authService.getCurrentUser();
    if(this.currentUser &&  this.currentUser['roles'][0] === Constants.AllRoles.cveezSuperAdmin){
      this.isAdmin=true
    }
  }
goBack(){
    this.route.queryParams
    .subscribe(params => {
      let fff={params}
   
      this.router.navigate(['admin/user-managment'],{queryParams:fff['params']});

    })
}
  // id:any
  getDeatiles(id: any) {
    this.spinner.show();
    this.manageClientService.userDetails(id).subscribe(
      (res) => {
        this.userData = res;
        this.userCountry = res.country;
        this.userJobLevel = res.jobLevel;
        this.userNationality = res.nationality;
        // this.userProfessionalCertificates = res.professionalCertificates;
        this.userQualifications = res.qualifications;
        this.userSkills = res.skills;
        this.userspecializations = res.specializations;
        this.userYearsExperience = res.yearsExperience;
        this.userTitles = res.titles;
    
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

  ngOnDestroy() {}
}
