import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root'
})
export class MyOrderJopSeekerService {

  constructor(private webApi: WebApiService) {}
  getAllRequest(param?: any) {
    return this.webApi.get('api/app/manage-request/my-requests', param);
  }
  getDetails(id:any)
  {
    return this.webApi.get(`api/app/manage-opportunity/${id}/opportunity-to-apply-job-seeker`);
  }
  savedJob(body:any)
  {
    return this.webApi.post(`api/app/manage-saved-opportunity/saved-opportunity`,body);
  }
  unSavedJob(id:any)
  {
    return this.webApi.post(`api/app/manage-saved-opportunity/un-saved-opportunity/${id}`);
  }

  getallSavedJob(params:any)
  {
    return this.webApi.get(`api/app/manage-saved-opportunity/my-saved-opportunities`,params);
  }

}
