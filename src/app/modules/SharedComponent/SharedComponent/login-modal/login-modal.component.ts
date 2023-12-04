import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Constants } from 'src/app/services/Constants/constants';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit, OnDestroy {
  @Input() expiredMode: boolean = false;
  @Input() expiredText: string | null = null;
  private unsubscribe: Subscription[] = [];
  yearsExperienceId:any;
  roles = Constants.AllRoles;
  currentUserOfLogin:any;
  constructor(public router: Router, private modalService: NgbModal
    ,    public authService: AuthService,
    ) {}

  ngOnInit(): void {
    this.currentUserOfLogin = this.authService.getCurrentUser();
    this.yearsExperienceId = this.authService.getyearsExperienceId();
  }

  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
