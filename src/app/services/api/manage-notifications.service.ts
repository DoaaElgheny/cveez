import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManageNotificationsService {
  constructor(private webApi: WebApiService) {}
  getAllManageNotifications(param?: any) {
    return this.webApi.get('/api/app/manage-notification-by-admin', param);
  }
  addNotifications(notificationDataObj: any) {
    return this.webApi.post(
      '/api/app/manage-notification-by-admin',
      notificationDataObj
    );
  }
  getNotificationById(notificId: any) {
    return this.webApi.get(
      `/api/app/manage-notification-by-admin/${notificId}/by-id
      `
    );
  }
  editNotification(notificationDataObj: any) {
    return this.webApi.put(
      '/api/app/manage-notification-by-admin/edit',
      notificationDataObj
    );
  }
  deleteNotification(notificId: any) {
    return this.webApi.delete(
      `/api/app/manage-notification-by-admin/${notificId}`
    );
  }
}
