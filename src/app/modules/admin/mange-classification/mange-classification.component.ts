import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageClassificationService } from 'src/app/services/api/manage-classification.service';
import { ClassificationType } from 'src/app/services/enums/classification.enum';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { ModalMangeClassificationComponent } from './modal-mange-classification/modal-mange-classification.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-mange-classification',
  templateUrl: './mange-classification.component.html',
  styleUrls: ['./mange-classification.component.scss'],
})
export class MangeClassificationComponent implements OnInit {
  constructor(
    private _ManageClassificationService: ManageClassificationService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal
  ) {}

  totalCount: number;
  payMent: number = 0;
  // السطر ده فايدته انه شايل الداتا اللي جايه من اليوزر ويحطها هنا
  //جايه من اليوزر عن طريق ال ngmodal في ال اتش تى ام ال
  classificationTypeStatus = '';
  searchText: string = '';
  page: number = 1;
  pageSize: number = 9;
  allClassification: any[] = [];
  //السطر ده لازمته انه شايل ال انم فقط 32
  theClassificationType = ClassificationType;
  filterObj = this.initFilterObj();
  fromSearchInput: boolean = false;

  ngOnInit(): void {
    this.getAllClassification();
  }
  getAllClassification() {
    if(!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;
    this.filterObj.name = this.searchText;
    this.filterObj.type = this.classificationTypeStatus;
    this.filterObj.maxResultCount = this.pageSize;
    this._ManageClassificationService
      .getClassification(this.filterObj)
      .subscribe((res) => {
        this.allClassification = res.items;
     
        this.totalCount = res.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      });
  }
  initFilterObj() {
    return {
      name: this.searchText,
      sorting: 'id',
      skipCount: 0,
      type: this.classificationTypeStatus,
      maxResultCount: this.pageSize,
    };
  }
  //changState of toggle
  changState(oneClassification: any) {
    let oldVal = oneClassification.type;
    oneClassification.type =
      oneClassification.type == this.theClassificationType.Active
        ? this.theClassificationType.Inactive
        : this.theClassificationType.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('managePackage.changeConfirmation'),
        oneClassification.type == this.theClassificationType.Inactive
          ? this.translate.instant('managePackage.changeText')
          : this.translate.instant('managePackage.changeText')
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let userstate = {
          id: oneClassification.id,
          type: oneClassification.type,
        };
        if (confirmed) {
          this._ManageClassificationService
            .changeToggleType(userstate)
            .subscribe(
              (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('manageClassification.changeStatus')
                );

                this.getAllClassification();
              },
              (err) => {
                this.spinner.hide();
                this.toastr.error(err.error.error.message);
                console.log(err);
              }
            );
        } else {
          this.spinner.hide();
          oneClassification.type = oldVal;
          this.cdr.detectChanges();
          this.getAllClassification();
        }
      })
      .catch(() => {
        oneClassification.type == this.theClassificationType.Active
          ? this.theClassificationType.Active
          : this.theClassificationType.Inactive;
        this.getAllClassification();
      });
  }

  deleteClassification(sendId: number, sendName: string) {
    this.confirmationDialogService
      .confirm(
        this.translate.instant('managePackage.deleteConfirmation'),
        this.translate.instant('manageClassification.deleteText'),
        sendName
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.spinner.show();
          this._ManageClassificationService
            .deleteClassification(sendId)
            .subscribe(
              (result) => {
                this.spinner.hide();
                this.getAllClassification();
                this.cdr.detectChanges();
                this.toastr.success(
                  this.translate.instant('manageClassification.deleteSuccess')
                );
              },
              (err) => {
                this.spinner.hide();
                console.log(err);
              }
            );
        } else {
        }
      })
      .catch(() =>
        console.log(
          'User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'
        )
      );
  }

  openModal(id?: number) {
    const modalRef = this.modalService.open(ModalMangeClassificationComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getAllClassification();
        
      }
    });
  }

  // clssificationModalForm: FormGroup = new FormGroup({
  //   name: new FormControl(),
  //   description: new FormControl(),
  //   attachementFileStorageName: new FormControl(),
  // });
}
function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
