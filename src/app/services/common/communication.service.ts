import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../Constants/constants';


@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private fixed = new BehaviorSubject<boolean>(false);
  private messageNo = new BehaviorSubject<Number>(0);
  private headerClassHome= new BehaviorSubject<boolean>(false);

  
  currentUser: any;
  private settingsPlatform = new BehaviorSubject<any[]>([]);
  fixed$ = this.fixed.asObservable();
  messageNo$ = this.messageNo.asObservable();
  headerClassHome$=this.headerClassHome.asObservable();
  settingsPlatform$ = this.settingsPlatform.asObservable();

  constructor(

  ) {}

  updateFixedValue(value: boolean) {
    this.fixed.next(value);
  }

  updateUnReadNotification(value:any) {
    this.messageNo.next(value);
  }
  // getUnReadNotification() {
  //   this.manageUserNotificationRepository.getUnReadNotifications().subscribe(data => {
  //     this.messageNo.next(data.length);
  //   });
  // }

  getHeaderClass(val:any){
    this.headerClassHome.next(val)
  }

  //get condition Package
  

 
  
}
