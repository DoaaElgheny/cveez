import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})

// MangeOpportunityComponent
export class MangeSubscriberPackagesService {
  constructor(private webApi: WebApiService) {}
  getsubScriberPackages(body?: any) {
    return this.webApi.get('api/app/manage-package/subscriber-packages', body);
  }

  getpackage(body?: any) {
    return this.webApi.get('api/app/manage-package/package', body);
  }
}
