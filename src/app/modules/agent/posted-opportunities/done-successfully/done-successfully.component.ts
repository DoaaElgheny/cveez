import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-done-successfully',
  templateUrl: './done-successfully.component.html',
  styleUrls: ['./done-successfully.component.scss'],
})
export class DoneSuccessfullyComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}
