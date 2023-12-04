import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManageClientService {
  constructor(private webApi: WebApiService) {}
  getAllAgent(param?: any) {
    return this.webApi.get('api/app/manage-agent', param);
  }
  changeStatus(body: any) {
    return this.webApi.post('api/app/manage-user/set-user-account-state', body);
  }
  resentEmail(body: any) {
    return this.webApi.post(
      `api/app/manage-user/resend-confirmation-email?email=${body}`
    );
  }

  changAccountState(body: any) {
    return this.webApi.put(
      `api/app/manage-agent/set-agent-account-state`,
      body
    );
    // return this.webApi.delete('api/app/manage-client/' + memberId);
  }

  agentDetails(id: any) {
    return this.webApi.get(`api/app/manage-agent/${id}/agent-details`);
  }

  userDetails(id: any) {
    return this.webApi.get(`api/app/manage-job-seeker/${id}/by-id`);
  }

  editAgent(body: any) {
    return this.webApi.put(`api/app/manage-agent/edit-agent`, body );
  }
}
