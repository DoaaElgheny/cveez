import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePostComponent } from './component/create-post/create-post.component';
import { ManagePostService } from 'src/app/services/api/manage-post.service';
import { LoginModalComponent } from '../../SharedComponent/SharedComponent/login-modal/login-modal.component';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-snap-job',
  templateUrl: './snap-job.component.html',
  styleUrls: ['./snap-job.component.scss'],
})
export class SnapJobComponent implements OnInit {
  currentUser: any;
  totalCount: any;
  data: any;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private confirmationDialogService: ConfirmationDialogService,
    private managePostService: ManagePostService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.getAllPosts();
  }
  getUserData() {
    this.spinner.show();
    this.authService.getcurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error?.error?.message);
      },
    });
  }

  getAllPosts() {
    this.spinner.show();
    this.managePostService.getAllPosts({}).subscribe({
      next: (res) => {
        res.items.map((i:any)=>i.openMenue=false);
        this.data = res.items;

        this.totalCount = res.totalCount;
        console.log(this.data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error?.error?.message);
      },
    });
  }

  deletePost(id?: number) {
    this.confirmationDialogService
      .confirm(
        this.translate.instant('Are you Sure!!!!!!!!!'),

        this.translate.instant('managePackage.changeText')
      )
      .then((confirmed: any) => {
        this.spinner.show();

        if (confirmed) {
          this.managePostService.deletePost(id).subscribe(
            (data) => {
              this.spinner.hide();
              this.toastr.success(
                this.translate.instant('Post delete Sucessfully')
              );

              this.getAllPosts();
            },
            (err) => {
              this.spinner.hide();
              this.toastr.error(err.error.error.message);
              console.log(err);
            }
          );
        } else {
          this.spinner.hide();
        }
      })
      .catch(() => {
        this.spinner.hide();
      });
  }
  openCreatePost(id: number=0) { 
    const modalRef = this.modalService.open(CreatePostComponent, {});
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.currentUser = this.currentUser;
    modalRef.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getAllPosts();
      }
    });
  }
  
  checkLogged() {
    const loginModal = this.modalService.open(LoginModalComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    loginModal.componentInstance.expiredMode = true;

    loginModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
      }
    });
  }
}
function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
