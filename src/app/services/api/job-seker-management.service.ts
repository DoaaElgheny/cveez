import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class JobSekerManagementService {
  constructor(private webApi: WebApiService) {}

  getJobSeeker(param?: any) {
    return this.webApi.get('api/app/manage-job-seeker', param);
  }

  resentEmail(body: any) {
    return this.webApi.post(
      `api/app/manage-account/resend-email?email=${body}`
    );
  }

  changeStatus(body: any) {
    return this.webApi.put(
      'api/app/manage-job-seeker/set-job-seeker-state',
      body
    );
  }

  getVideo(id: any) {
    return this.webApi.get(`api/app/manage-job-seeker/${id}/vedios`);
  }

  changeVideoStatus(body: any) {
    return this.webApi.put('api/app/manage-job-seeker/set-vedio-status', body);
  }

  getJobSeekerById(id: any) {
    return this.webApi.get(`api/app/manage-job-seeker/${id}/by-id`);
  }

  completeJobSeekerData(body: any) {
    return this.webApi.put(`api/app/manage-job-seeker/complete-profile`, body);
  }

  getAllPackages() {
    return this.webApi.get(`api/app/manage-package/package-list`);
  }

  selectPackage(packageObj: any) {
    return this.webApi.post(
      `api/app/manage-job-seeker/select-package`,
      packageObj
    );
  }

  editJobSeeker(body: any) {
    return this.webApi.put(
      `api/app/manage-job-seeker/edit-personal-data`,
      body
    );
  }

  editJobSeekerSkills(body: any) {
    return this.webApi.put(`api/app/manage-job-seeker/edit-skills`, body);
  }

  editPersonalImage(body: any) {
    return this.webApi.put(
      `api/app/manage-job-seeker/edit-image-profile`,
      body
    );
  }

  SendEmailsToUnsubscribe(id: number) {
    return this.webApi.post(
      `api/app/manage-job-seeker/${id}/send-emails-to-un-subscribe-job-seekers`
    );
  }

  downloadCv(seekerId?: string) {
    return this.webApi.post(`api/app/manage-package/download-cV/${seekerId}`);
  }
}
