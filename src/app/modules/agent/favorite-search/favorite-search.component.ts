import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchJobSeekerService } from 'src/app/services/api/search-job-seeker.service';
import { AuthService } from '../../auth/services/auth.service';
import { Constants } from 'src/app/services/Constants/constants';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-favorite-search',
  templateUrl: './favorite-search.component.html',
  styleUrls: ['./favorite-search.component.scss'],
})
export class FavoriteSearchComponent implements OnInit {
  pageSize = 9;
  page = 1;
  currentPage = 1;
  firstTime: boolean;
  collectionSize: number = 0;
  searchObj: any;
  seachKey: any = '';
  data: any;
  
  currentUser: any;
  currentUserName: string = String(
    localStorage.getItem('name') ? localStorage.getItem('name') : ''
  );
  fromSearchInput: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    private searchJobSeekerService: SearchJobSeekerService,
    private spinnerService: NgxSpinnerService
  ) {
    if (
      this.authService.getCurrentUser().roles[0] !==
      Constants.AllRoles.cveezAgent
    ) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
     this.firstTime = true;
  }

  handleSearch(event: any) {
    ///if (!event) {
    //  this.page = 1;
   // }
    this.searchObj = event;
    this.loadData();
  }

  loadData(target?: any) {
    
    console.log(this.currentPage);
    
    if (!this.fromSearchInput) {
      this.spinnerService.show();
    }
    let startIndex = 0;
    if (this.firstTime) {
      startIndex =
        (Number(localStorage.getItem('pageIDFavourite')||1) - 1) *
        this.pageSize;
    } else {
      startIndex = (this.currentPage - 1) * this.pageSize;
    }

    let filterObj: any;

    filterObj = {
      text: this.seachKey,
      skipCount: startIndex,
      maxResultCount: this.pageSize,
      ...this.searchObj,
    };
    let obj = Object.keys(filterObj).forEach(
      (k) => filterObj[k] == null && delete filterObj[k]
    );

    this.searchJobSeekerService.getSearchJobSeeker(filterObj).subscribe({
      next: (res) => {
        this.data = res.items;
        this.collectionSize = res.totalCount;
        this.spinnerService.hide();
        this.firstTime=false
         document
         .getElementById('serach-sec')
         ?.scrollIntoView({ behavior: 'smooth' });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinnerService.hide();
      },
    });
    if (this.firstTime) {
 
      setTimeout(() => {
        this.currentPage = Number(
          localStorage.getItem('pageIDFavourite')||1
        );
        this.cdr.detectChanges();
      }, 1000);
     
    }
  }
  profileDetails(id:any){
  
    localStorage.setItem('pageIDFavourite', this.currentPage.toString());
    window.open(`${environment.web_url}client/profile-details/${id}/true/false`, '_blank')
    // this.router.navigate([`/client/profile-details/${id}/true`])
   }
  scrollToElement($element: any): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
