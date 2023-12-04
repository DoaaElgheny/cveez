import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(private webApi: WebApiService) {}

  getAllMessage(param?: any) {
    return this.webApi.get('api/app/manage-contact-us/contact-us', param);
  }
  setComplain(body: any) {
    return this.webApi.post(
      'api/app/manage-contact-us/set-complaint-type',
      body
    );
  }

  sendContactUsMessage(obj: any) {
    return this.webApi.post(`api/app/manage-contact-us/contact-us`, obj);
  }

  sendContactUsReply(obj: any) {
    return this.webApi.post(`api/app/manage-contact-us/reply`, obj);
  }

  // addClassification(classificationObj: any) {
  //   return this.webApi.post(
  //     '/api/app/manage-classification',
  //     classificationObj
  //   );
  // }
}
