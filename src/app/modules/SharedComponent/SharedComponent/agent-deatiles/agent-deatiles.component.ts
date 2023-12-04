import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';

@Component({
  selector: 'app-agent-deatiles',
  templateUrl: './agent-deatiles.component.html',
  styleUrls: ['./agent-deatiles.component.scss'],
})
export class AgentDeatilesComponent implements OnInit {
  @Input() agentData: any;
  @Input() agentID: any;
  currentUser: any;
  roles = Constants.AllRoles;
  constructor(private authService: AuthService, public router: Router) {}
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  callWattsApp(phoneNumber: any) {
    let href = 'text';
    // if (this.deviceInfo.device == 'iPhone') {
    //   return window.open('https://wa.me/966533352906/?text=' + href, '_blank');
    // } else {
    return window.open(
      `https://api.whatsapp.com/send?phone=${phoneNumber}`,
      '_blank'
    );
    // }
  }
}
