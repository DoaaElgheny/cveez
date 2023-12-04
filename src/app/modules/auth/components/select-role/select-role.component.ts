import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss'],
})
export class SelectRoleComponent implements OnInit {
  constructor(private router: Router) {}
  chooise: boolean;

  ngOnInit(): void {}

  next() {
    if (this.chooise === true) {
      this.router.navigateByUrl(`auth/job-seeker-registration`);
    }
    if (this.chooise === false) {
      this.router.navigateByUrl(`auth/agent-registration`);
    }
  }
}
