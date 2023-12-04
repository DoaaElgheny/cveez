import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { TranslationService } from 'src/app/i18n';
import { ManageClientService } from 'src/app/services/api/manage-client.service';
import { AuthService } from '../../auth/services/auth.service';
import { Constants } from 'src/app/services/Constants/constants';
import { AnyAaaaRecord } from 'dns';

@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.scss'],
})
export class AgentDetailComponent implements OnInit {
  constructor(
    private manageClientService: ManageClientService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private authService:AuthService,
    private translationService: TranslationService
  ) {}
  agentData: any;
  id: number;
  pageNumber: number;
  videoLink:any;
  videoURl:any;
  currentUser:any
  copied:boolean;
  isAdmin:boolean;
  params:any
  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
   
      this.params = {params};
     
    }
  );
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.getDeatiles(id);
    } else {
      this.getDeatiles(0);
    }
    this.currentUser = this.authService.getCurrentUser();
    if(this.currentUser &&  this.currentUser['roles'][0] === Constants.AllRoles.cveezSuperAdmin){
      this.isAdmin=true
    }
  }

  // id:any
  getDeatiles(id: any) {
    this.spinner.show();
    this.manageClientService.agentDetails(id).subscribe(
      (res) => {
        this.agentData = res;
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

  goBack() {
    this.route.queryParams
    .subscribe(params => {
      let fff={params}
     
      this.router.navigate(['/admin/manage-agent'],{queryParams:fff['params']});
   
     
    }
  );
   
    
  }
  copy(value:any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '30';
    selBox.value = value ;
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
