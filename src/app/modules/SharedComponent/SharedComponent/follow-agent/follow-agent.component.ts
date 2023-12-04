import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Constants } from 'src/app/services/Constants/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FollowAgentService } from 'src/app/services/api/follow-agent.service';
@Component({
  selector: 'app-follow-agent',
  templateUrl: './follow-agent.component.html',
  styleUrls: ['./follow-agent.component.scss'],
})
export class FollowAgentComponent implements OnInit {
  @Input() isFollow: boolean;
  @Input() agentId: number;
  currentUser: any;
  
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private translate: TranslateService,
    private toasterService: ToastrService,
    private authService: AuthService,
    private _followService: FollowAgentService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService // private mangeFavouriteRepository: MangeFollowAgent
  ) {}

  ngOnInit(): void {}

  changeFollowAgent() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.toasterService.error(
        this.translate.instant('ViewDetails.pleaseLogin')
      );
    } else if (
      this.currentUser.roles[0] !== Constants.AllRoles.cveezJobSeeker
    ) {
      this.toasterService.error(
        this.translate.instant('ViewDetails.mustLoginAsJobSeeker')
      );
    } else {
      this.isFollow = !this.isFollow;
      this._followService.addFollow({ agentId: this.agentId }).subscribe(
        () => {
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant(
              this.isFollow
                ? 'ViewDetails.followedSuccessfully'
                : 'ViewDetails.unfollowedSuccessfully'
            )
          );
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
          console.log(err);
        }
      );
    }
  }
}
// this.toastr.success( this.translate.instant('jobSeeker.acceptance'));
