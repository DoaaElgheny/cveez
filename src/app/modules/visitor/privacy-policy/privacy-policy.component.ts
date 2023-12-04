import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunicationService } from 'src/app/services/common/communication.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private communicationService: CommunicationService
  ) {
    this.communicationService.getHeaderClass(true);
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.communicationService.getHeaderClass(false);
  }
  downloadPrivacy() {
    this.spinner.show();
    window.open(`/assets/privacy.pdf`);
    this.spinner.hide();
  }
}
