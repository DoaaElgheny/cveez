import { Injectable } from '@angular/core';
import { WebApiService } from 'src/app/services/webApi.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralServicesService {
  constructor(private webApi: WebApiService) {}

  // get countries list
  getCountriesList() {
    return this.webApi.get('api/app/manage-country');
  }

  // get nationalities list
  getNationalitesList() {
    return this.webApi.get('api/app/manage-nationality/nationalities');
  }

  getSkills() {
    return this.webApi.get('api/app/manage-skill/skills');
  }

  getProfessionalCertification() {
    return this.webApi.get(
      `api/app/manage-professional-certificate/professional-certificates`
    );
  }

  getQualifications() {
    return this.webApi.get(`api/app/manage-qualification/qualifications`);
  }

  getSpecializations() {
    return this.webApi.get(`api/app/manage-specialization/specializations`);
  }

  getJobTitles() {
    return this.webApi.get(`api/app/manage-job-title/job-titles`);
  }

  getJobHours() {
    return this.webApi.get(
      `api/app/manage-job-hour/job-hours`
    );
  }

  getJobTypes() {
    return this.webApi.get(
      `api/app/manage-job-type/job-types`
    );
  }
  
  getYearsExperiences() {
    return this.webApi.get(`api/app/manage-years-experience/years-experiences`);
  }

  getJobLevel() {
    return this.webApi.get(`api/app/manage-job-level/job-levels`);
  }

  getCode(body: any) {
    return this.webApi.post(
      `api/app/manage-account/generate-verification-code?email=${body}`
    );
  }

  verfiyCode(body: any) {
    return this.webApi.post(
      'api/app/manage-account/validate-verification-code',
      body
    );
  }
}
