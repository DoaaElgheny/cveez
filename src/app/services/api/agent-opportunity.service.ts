import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class AgentOpportunityService {
  constructor(private webApi: WebApiService) {}
  addOpportunityAgent(body: any) {
    return this.webApi.post('api/app/manage-opportunity/opportunity', body);
  }
  getJobTitles() {
    return this.webApi.get('api/app/manage-job-title/job-titles');
  }
  
  getJobTitlesForOpportunity(agentId:any) {
    return this.webApi.get(
      `api/app/manage-job-title/job-title-for-opportunity/${agentId}`
    );
  }

  getJobLevels() {
    return this.webApi.get(`api/app/manage-job-level/job-levels`);
  }
  getJobTypes() {
    return this.webApi.get(`api/app/manage-job-type/job-types`);
  }
  getCountry() {
    return this.webApi.get(`api/app/manage-country`);
  }
  getSalaryRanges() {
    return this.webApi.get(`api/app/manage-salary-range/salary-ranges`);
  }
  getProbationPeriods() {
    return this.webApi.get(`api/app/manage-probation-period/probation-periods`);
  }
  getJobHours() {
    return this.webApi.get(`api/app/manage-job-hour/job-hours`);
  }
  getSpecializations() {
    return this.webApi.get(`api/app/manage-specialization/specializations`);
  }
  getQualifications() {
    return this.webApi.get(`api/app/manage-qualification/qualifications`);
  }

  getYearsExperiences() {
    return this.webApi.get(`api/app/manage-years-experience/years-experiences`);
  }

  getProfessionalCertificates() {
    return this.webApi.get(
      `api/app/manage-professional-certificate/professional-certificates`
    );
  }
  getAgeRanges() {
    return this.webApi.get(`api/app/manage-age-range/age-ranges`);
  }
  getClassificationList() {
    return this.webApi.get(`api/app/manage-classification/classification-list`);
  }
  getAllOpportunity(params: any) {
    return this.webApi.get(
      'api/app/manage-opportunity/my-opportunities',
      params
    );
  }
  isHide(body: any) {
    return this.webApi.put('api/app/manage-opportunity/is-hide', body);
  }
  changeStatus(body: any) {
    return this.webApi.put(
      'api/app/manage-opportunity/set-opportunity-state',
      body
    );
  }
  getbyId(id: any) {
    return this.webApi.get(
      `api/app/manage-opportunity/${id}/opportunity-details`
    );
  }
  editOpportunity(body: any) {
    return this.webApi.put('api/app/manage-opportunity/edit-opportunity', body);
  }

  getOpportunitiesList(IsAccepted?: any) {
    return this.webApi.get(
      'api/app/manage-opportunity/my-opportunity-list',
      IsAccepted
    );
  }

  getRequestsByAgent(object: any) {
    return this.webApi.get(`api/app/manage-request/requests-for-agent`, object);
  }

  toggleBinOpportunity(object: any) {
    return this.webApi.post(`api/app/manage-request/is-bin`, object);
  }

  setIsShowForOpportunity(object: any) {
    return this.webApi.post(`api/app/manage-request/is-show`, object);
  }
}
