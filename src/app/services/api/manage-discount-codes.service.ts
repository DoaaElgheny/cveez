import { Injectable } from '@angular/core';
import { WebApiService } from 'src/app/services/webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManageDiscountCodesService {
  constructor(private webApi: WebApiService) {}

  getDiscountCodes(parms: any) {
    return this.webApi.get(`api/app/manage-discount-code`, parms);
  }

  exportSheetCode(parms: any) {
    return this.webApi.get(
      `api/app/manage-discount-code/export-sheet-codes`,
      parms
    );
  }

  addDiscountCode(body: any) {
    return this.webApi.post(`api/app/manage-discount-code`, body);
  }

  discountPrice(object: any) {
    return this.webApi.get(
      `api/app/manage-discount-code/discount-price/${object.id}?code=${object.code}`
    );
  }

  setCodeStatus(body: any) {
    return this.webApi.put(
      `api/app/manage-discount-code/set-code-status`,
      body
    );
  }

  getAllPartner() {
    return this.webApi.get(`api/app/manage-marketing-partner`);
  }

  addPartner(body: any) {
    return this.webApi.post(`api/app/manage-marketing-partner`, body);
  }
}
