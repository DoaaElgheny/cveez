import { Injectable } from '@angular/core';
import { WebApiService } from 'src/app/services/webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManageTitleService {
  constructor(private webApi: WebApiService) {}

  getAllTitles(parms?: any) {
    return this.webApi.get(
      `api/app/manage-job-title/job-title-for-admin`,
      parms
    );
  }

  addTitle(object: any) {
    return this.webApi.post(`api/app/manage-job-title/job-title`, object);
  }

  editTitle(object: any) {
    return this.webApi.put(`api/app/manage-job-title/edit-job-title`, object);
  }

  getAllTitlesDrobdown() {
    return this.webApi.get(`api/app/manage-job-title/job-titles`);
  }
}
