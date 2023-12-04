import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root'
})
export class SearchJobSeekerService {

  constructor(private webApi: WebApiService) {}

  getSearchJobSeeker(params:any)
  {
    return this.webApi.get('api/app/manage-job-seeker/search',params)
  }
}
