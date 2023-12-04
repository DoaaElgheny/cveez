import {  Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getMessaging, getToken } from 'firebase/messaging';
import { WebApiService } from '../webApi.service';
@Injectable({ providedIn: 'root' })
export class MessagingService {
  currentLanguage: string;
  currentMessage = new BehaviorSubject(null);
  private messageNo = new BehaviorSubject<Number>(0);
  messageNo$ = this.messageNo.asObservable();

  constructor(

    private webApi: WebApiService
  ) {}

  requestPermission() {

    const messaging = getMessaging();
   
    getToken(messaging, {
      vapidKey:
        //  'BBPqKsqXdwNwnn9gmozAaQAHYxVjlzItrt95Cp1IYfwSUMFZ3fKAYmWsXwRnHz6lKtJZdezjHi4KpKKwRCORFB0',
        'BO6isqpqbb877GVa-E3MV2zEhbjSL0O5a10fHhXAnZjOAi-1IvJm6tUiivIL7-hhYO3F5AQfLZzlOeekcI-SHQw',
    })
      .then((currentToken) => {
        if (currentToken) {
          localStorage['firebaestoken'] = currentToken;
          var obj = { deviceId: currentToken };
          this.webApi.post(`api/app/manage-token/token`, obj).subscribe(re=>{
           
          });
        } else {
          localStorage['firebaestoken'] = null;
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  }
  deleteToken() {
    return this.webApi.delete(
      `api/app/manage-token?deviceId=${localStorage['firebaestoken']}`
    ).subscribe(re=>{
   
      
    })  }
    getUnReadNotification() {
 
      return this.webApi.get(
        `api/app/manage-notification/un-read-notifications-count`
      ).subscribe(re=>{
     
       this.messageNo.next(re);
     
      }) 
    }
  
    getReadNotifications() {
      return this.webApi.post(
        `/api/app/manage-notification/read-notification`
      ).subscribe(re=>{
     
        this.messageNo.next(0);
       
       })
    }
}
