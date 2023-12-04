import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from 'src/app/i18n';
import { ManageClientService } from 'src/app/services/api/manage-client.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-agent',
  templateUrl: './show-agent.component.html',
  styleUrls: ['./show-agent.component.scss'],
})
export class ShowAgentComponent implements OnInit {
  agentData: any;
  id: any;
  constructor(
    private _location: Location,
    private manageClientService: ManageClientService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getDeatiles(this.id);
  }

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

  backClicked() {
    this._location.back();
  }
}
