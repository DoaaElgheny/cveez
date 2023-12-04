import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManagePackageService {
  constructor(private webApi: WebApiService) {}
  getAllPackages(param?: any) {
   
    return this.webApi.get('/api/app/manage-package/packages', param);
  }

  changePackageToggle(body: any) {
    return this.webApi.post('api/app/manage-package/set-package-type', body);
  }
  deletePackage(packageId: any) {
    return this.webApi.delete(`api/app/manage-package/${packageId}`);
  }
  addPackage(PackageObj: any) {
    return this.webApi.post('/api/app/manage-package', PackageObj);
  }
  getPackageById(packageId: any) {
    return this.webApi.get(
      `/api/app/manage-package/${packageId}/package-by-id`
    );
  }
  editPackage(PackageObj: any) {
    return this.webApi.put('/api/app/manage-package/edit', PackageObj);
  }
  getConditions(type: any) {
    return this.webApi.get(
      `api/app/manage-package/conditions?subscribersType=${type}`
    );
  }
}
// /api/app/manage-package/edit
