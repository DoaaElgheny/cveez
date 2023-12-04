import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';
import { ChangePassword } from 'src/app/modules/auth/models/change-password';

@Injectable({
  providedIn: 'root',
})
export class AgentManagementService {
  constructor(private webApi: WebApiService) {}

  resentEmail(body: any) {
    return this.webApi.post(
      `api/app/manage-account/resend-email?email=${body}`
    );
  }
  changAcceptanceState(body: any) {
    return this.webApi.put(
      `api/app/manage-agent/set-agent-acceptance-state`,
      body
    );
    // return this.webApi.delete('api/app/manage-client/' + memberId);
  }

  changePassword(changepassword: ChangePassword) {
    return this.webApi.post(
      'api/app/manage-account/change-password',
      changepassword
    );
  }

  getAgentProfile() {
    return this.webApi.get('api/app/manage-agent/0/agent-details');
  }
  updateInformationAgentProfile(body: any) {
    return this.webApi.put('api/app/manage-agent/edit-agent', body);
  }
  updateRepresentiveAgentProfile(body: any) {
    return this.webApi.put(
      'api/app/manage-agent/edit-representative-agent',
      body
    );
  }

  selectPackage(packageObj: any) {
    return this.webApi.post(
      `api/app/manage-agent/select-package-agent`,
      packageObj
    );
  }

  SendEmailsToUnsubscribe(id: number) {
    return this.webApi.post(
      `api/app/manage-agent/${id}/send-emails-to-un-subscribe-agents`
    );
  }

  getAgents() {
    return this.webApi.get(`api/app/manage-agent/agents`);
  }
  getAllAgent() {
    return this.webApi.get('/api/app/manage-agent/agents');
  }
}
