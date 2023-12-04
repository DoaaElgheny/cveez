import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private webApi: WebApiService) {}
  getAllNotifications(param?: any) {

    return this.webApi.get('api/app/manage-notification', param);
  }
}
