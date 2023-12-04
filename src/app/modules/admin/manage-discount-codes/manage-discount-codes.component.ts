import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  CodeStatus,
  DiscountCondtion,
} from 'src/app/services/enums/discount-code.enum';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { AddDiscountCodeComponent } from './add-discount-code/add-discount-code.component';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { ManageDiscountCodesService } from 'src/app/services/api/manage-discount-codes.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-discount-codes',
  templateUrl: './manage-discount-codes.component.html',
  styleUrls: ['./manage-discount-codes.component.scss'],
})
export class ManageDiscountCodesComponent implements OnInit {
  totalCount: number = 0;
  searchText: string = '';
  page: number = 1;
  pageSize: number = 10;
  allCodes: any[] = [];
  codeStatus: any = CodeStatus;
  codestatusDecision: string = '';
  discountCondtion: any = DiscountCondtion;
  filterObj = this.initFilterObj();
  fromSearchInput: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private manageDiscountCodeservice: ManageDiscountCodesService
  ) {}

  ngOnInit(): void {
    this.getListData();
  }

  getListData() {
    if(!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;
    this.filterObj.text = this.searchText;
    this.filterObj.CodeStatus = this.codestatusDecision;
    this.filterObj.maxResultCount = this.pageSize;

    this.manageDiscountCodeservice
      .getDiscountCodes(this.filterObj)
      .subscribe((res) => {
        this.allCodes = res.items;
        this.totalCount = res.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      });
  }

  initFilterObj() {
    return {
      text: this.searchText,
      sorting: 'id',
      skipCount: 0,
      CodeStatus: this.codestatusDecision,
      maxResultCount: this.pageSize,
    };
  }

  changAccountState(code: any) {
    let oldVal = code.codeStatus;
    code.codeStatus =
      code.codeStatus == CodeStatus.Active
        ? CodeStatus.Inactive
        : CodeStatus.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('viewProfile.confirmation'),
        code.codeStatus == CodeStatus.Inactive
          ? this.translate.instant('ManageDiscountCode.DoYouWantToChange')
          : this.translate.instant('ManageDiscountCode.DoYouWantToChange')
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let userstate = { id: code.id, codeStatus: code.codeStatus };
        if (confirmed) {
          this.manageDiscountCodeservice.setCodeStatus(userstate).subscribe({
            next: (data) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('ManageDiscountCode.ChangedSuccessfully')
              );
              this.getListData();
            },
            error: (err) => {
              this.spinner.hide();
              this.toastr.error(err.error.error.message);
            },
          });
        } else {
          this.spinner.hide();
          code.codeStatus = oldVal;
          this.getListData();
          this.cdr.detectChanges();
        }
      })
      .catch(() => {
        code.codeStatus = code.codeStatus == CodeStatus.Active
          ? CodeStatus.Active
          : CodeStatus.Inactive;
        this.getListData();
      });
  }

  async openAddDiscountCodeModal() {
    const addModal = this.modalService.open(AddDiscountCodeComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    addModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getListData();
      }
    });
  }

  async openAddPartnerModal() {
    const addModal = this.modalService.open(AddPartnerComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    addModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getListData();
      }
    });
  }

  downloadXLX() {
    this.spinner.show();
    window.open(
      `${environment.api_url}api/app/manage-discount-code/export-sheet-codes??Text=${this.searchText}&CodeStatus=${this.codestatusDecision}`
    );
    this.spinner.hide();
    this.toastr.success(
      this.translate.instant('ManageDiscountCode.FileExportedSuccessfully')
    );
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
