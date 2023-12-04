import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class FollowAgentService {
  constructor(private webApi: WebApiService) {}
  addFollow(body: any) {
    return this.webApi.post('/api/app/manage-follow-agent/agent-follow', body);
  }
}
