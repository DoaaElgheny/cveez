import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManagePackageService } from 'src/app/services/api/manage-package.service';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { SubscribersType } from 'src/app/services/enums/PackageSubscribersType.enum';
import { PackageType } from 'src/app/services/enums/packageType.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalManagePackageComponent } from './modal-manage-package/modal-manage-package.component';
import { DurationPackage } from 'src/app/services/enums/duration-package';

@Component({
  selector: 'app-mange-package',
  templateUrl: './mange-package.component.html',
  styleUrls: ['./mange-package.component.scss'],
})
export class MangePackageComponent implements OnInit {
  constructor(
    private _ManagePackageService: ManagePackageService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal
  ) {}
  totalCount: number;
  payMent: number = 0;
  durationPackage:any=DurationPackage
  // السطر ده فايدته انه شايل الداتا اللي جايه من اليوزر ويحطها هنا
  //جايه من اليوزر عن طريق ال ngmodal في ال اتش تى ام ال
  searchPackages = '';
  searchText: string = '';
  page: number = 1;
  pageSize: number = 9;
  //السطر ده لازمته انه شايل ال انم فقط 32
  theSubscribersType = SubscribersType;
  thePackageType = PackageType;
  filterObj = this.initFilterObj();
  allPakages: any[] = [];
  fromSearchInput: boolean = false;

  ngOnInit(): void {
    this.getUserAllPackages();
  }
  getUserAllPackages() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;
    this.filterObj.name = this.searchText;
    this.filterObj.maxResultCount = this.pageSize;
    this._ManagePackageService
      .getAllPackages(this.filterObj)
      .subscribe((data) => {
        this.allPakages = data.items;
        
        this.totalCount = data.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      });
  }
  initFilterObj() {
    return {
      name: this.searchPackages,
      sorting: 'id',
      skipCount: 0,
      maxResultCount: this.pageSize,
    };
  }
  changePackageToggleType(pakage: any) {
    let oldValueOfToggle = pakage.packageType;
    pakage.packageType =
      pakage.packageType == this.thePackageType.Active
        ? this.thePackageType.Inactive
        : this.thePackageType.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('managePackage.changeConfirmation'),
        pakage.packageType == this.thePackageType.Inactive
          ? this.translate.instant('managePackage.changeText')
          : this.translate.instant('managePackage.changeText')
      )
      .then((confirmed) => {
        this.spinner.show();
        let newToggleTypeBody = {
          id: pakage.id,
          packageType: pakage.packageType,
        };
        if (confirmed) {
          this._ManagePackageService
            .changePackageToggle(newToggleTypeBody)
            .subscribe(
              (newData) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('managePackage.changeToggleTostr')
                );
                this.getUserAllPackages();
              },
              (err) => {
                this.spinner.hide();
                this.toastr.error(err.error.error.message, 'Error');
                console.log(err);
              }
            );
        } else {
          this.spinner.hide();
          pakage.packageType = oldValueOfToggle;
          this.cdr.detectChanges();
          this.getUserAllPackages();
        }
      })
      .catch(() => {
        pakage.packageType == this.thePackageType.Active
          ? this.thePackageType.Active
          : this.thePackageType.Inactive;
        this.getUserAllPackages();
      });
  }
  deletePackage(sendPakageId: number, sendPakageName: string) {
    this.confirmationDialogService
      .confirm(
        this.translate.instant('managePackage.deleteConfirmation'),
        this.translate.instant('managePackage.deleteText'),
        sendPakageName
      )
      .then((confirm: any) => {
        if (confirm) {
          this.spinner.show();
          this._ManagePackageService.deletePackage(sendPakageId).subscribe(
            (result) => {
              this.spinner.hide();
              this.getUserAllPackages();
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
        }
      })
      .catch(() =>
        console.log(
          'User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'
        )
      );
  }
  openModal(id?: number) {
    const modalRef = this.modalService.open(ModalManagePackageComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.getUserAllPackages =
      this.getUserAllPackages.bind(this);

    // modalRef.componentInstance.data = this.data;

    modalRef.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getUserAllPackages();
      }
    });

    // function hideFn(value: any) {
    //   throw new Error('Function not implemented.');
    // }

    // this is functon  end
  }
}
function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
