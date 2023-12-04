import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManageStripePaymentService {
  constructor(private webApi: WebApiService) {}

  payment(body: any) {
    debugger
    return this.webApi.post(
      `api/app/manage-stripe-payment/payment`,body
    );
  }
}