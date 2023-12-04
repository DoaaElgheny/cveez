import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EditTitlesComponent } from './edit-titles/edit-titles.component';
import { JobTitleType } from 'src/app/services/enums/titles.enum';
import { ManageTitleService } from 'src/app/services/api/manage-title.service';

@Component({
  selector: 'app-manage-titles',
  templateUrl: './manage-titles.component.html',
  styleUrls: ['./manage-titles.component.scss']
})
export class ManageTitlesComponent implements OnInit {
  totalCount: number = 0;
  name: string = '';
  page: number = 1;
  pageSize: number = 10;
  allTitles: any[] = [];
  jobTitleType: any = JobTitleType;
  titleType: any = '';
  filterObj = this.initFilterObj();
  fromSearchInput: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private manageTitleService: ManageTitleService
  ) {}

  ngOnInit(): void {
    this.getListData();
  }

  initFilterObj() {
    return {
      Name: this.name,
      JobTitleType: this.titleType,
      sorting: 'id',
      skipCount: 0,
      maxResultCount: this.pageSize,
    };
  }

  rest() {
    this.name = '';
    this.titleType = '';
    this.getListData();
  }

  getListData() {
    if(!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.skipCount = startIndex;
    this.filterObj.Name = this.name;
    this.filterObj.JobTitleType = this.titleType;
    this.filterObj.maxResultCount = this.pageSize;

    this.manageTitleService.getAllTitles(this.filterObj).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.allTitles = res.items;
        this.totalCount = res.totalCount;
        this.cdr.detectChanges();
      },error: (err) => {
        this.spinner.hide();
      },
    });
  }

  openEditTitleModal(title?: any) {
    const editModal = this.modalService.open(EditTitlesComponent, {
      size: 'md',
      keyboard: false,
      centered: true,
    });

    if(title) {
      editModal.componentInstance.title = title;
    }

    editModal.result.then(hideFn, hideFn).catch((result) => {
      if (result) {
        this.getListData();
      }
    });
  }
}

function hideFn(value: any) {
  throw new Error('Function not implemented.');
}
