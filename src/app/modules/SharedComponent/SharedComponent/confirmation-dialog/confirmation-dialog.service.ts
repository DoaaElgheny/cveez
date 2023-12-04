import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class ConfirmationDialogService {
  constructor(private modalService: NgbModal, private translate: TranslateService,) {}

  public confirm(
    title: string,
    message: string,
    data: string = '',
    isDelet = true,
    btnOkText: string = this.translate.instant('jobSeeker.ok'),
    btnCancelText: string = this.translate.instant('jobSeeker.cancel'),
    dialogSize: 'sm' | 'lg' = 'sm'
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      size: dialogSize,
      centered: true,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.isDelet = isDelet;
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }
}
