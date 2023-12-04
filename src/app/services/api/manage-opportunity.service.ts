import { Injectable } from '@angular/core';
import { WebApiService } from 'src/app/services/webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManageOpportunityService {
  constructor(private webApi: WebApiService) {}

  getAllOpportunities(params: any) {
    return this.webApi.get(`api/app/manage-opportunity`, params);
  }

  setOpportunityState(object: any) {
    return this.webApi.put(
      `api/app/manage-opportunity/set-opportunity-state`,
      object
    );
  }

  setOpportunityVisiablity(object: any) {
    return this.webApi.put(
      `api/app/manage-opportunity/is-hide-by-admin`,
      object
    );
  }

  setOpportunityAcceptanceState(object: any) {
    return this.webApi.put(
      `api/app/manage-opportunity/set-opportunity-acceptance-state`,
      object
    );
  }

  getOpportunityDetailsById(id: any) {
    return this.webApi.get(
      `api/app/manage-opportunity/${id}/opportunity-by-id`
    );
  }

  editClassificationByAdmin(object: any) {
    return this.webApi.put(
      `api/app/manage-opportunity/edit-classification-by-admin`,
      object
    );
  }

  searchOpportunity(object: any) {
    return this.webApi.get(
      `api/app/manage-opportunity/search-opportunity`,
      object
    );
  }

  searchCountry(textObject: any) {
    return this.webApi.get(
      `api/app/manage-opportunity/search-country`,
      textObject
    );
  }

  applyFobSeeker(id: number) {
    return this.webApi.get(
      `api/app/manage-opportunity/${id}/opportunity-to-apply-job-seeker`
    );
  }

  similarOpportunities(body: any) {
    return this.webApi.get(
      `api/app/manage-opportunity/similar-opportunities`,
      body
    );
  }

  requestOpportunity(id: number) {
    return this.webApi.post(`/api/app/manage-request/request/${id}`);
  }
  editOpportunity(body:any) {
    return this.webApi.put(`/api/app/manage-opportunity/edit-opportunity-form-admin`,body);
  }
  
}
