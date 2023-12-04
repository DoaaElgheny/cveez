import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManageClassificationService {
  constructor(private webApi: WebApiService) {}
  getClassification(param?: any) {
    return this.webApi.get('/api/app/manage-classification', param);
  }
  changeToggleType(body: any) {
    return this.webApi.post(
      '/api/app/manage-classification/set-classification-type',
      body
    );
  }
  deleteClassification(classificationId: any) {
    return this.webApi.delete(
      `api/app/manage-classification/${classificationId}`
    );
  }
  addClassification(classificationObj: any) {
    return this.webApi.post(
      '/api/app/manage-classification',
      classificationObj
    );
  }
  // getclassificationById(classificationId: any) {
  //   return this.webApi.get(
  //     `/api/app/manage-classification/${classificationId}/package-by-id`
  //   );
  // }
  getClassificationById(classificationId: any) {
    return this.webApi.get(
      `/api/app/manage-classification/${classificationId}/by-id`
    );
  }
  editClassification(classificationObj: any) {
    return this.webApi.put(
      '/api/app/manage-classification/edit',
      classificationObj
    );
  }

  getClassificationsList() {
    return this.webApi.get(`api/app/manage-classification/classification-list`);
  }
}
