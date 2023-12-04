import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManageReplyService {
  constructor(private webApi: WebApiService) {}

  addReply(body: any) {
    return this.webApi.post('api/app/manage-reply', body);
  }

  editReply(body: any) {
    return this.webApi.post('api/app/manage-reply/edit', body);
  }

  getReply(param?: any) {
    return this.webApi.get('api/app/manage-reply');
  }
  
  deleteReply(replyId: any) {
    return this.webApi.delete(`api/app/manage-post/${replyId}`);
  }
 
}
