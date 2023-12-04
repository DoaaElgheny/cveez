import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ManagePostService {
  constructor(private webApi: WebApiService) {}
  getAllPosts(param?: any) {
    return this.webApi.get('api/app/manage-post', param);
  }
  getByID(id?: number) {
    return this.webApi.get(`api/app/manage-post/${id}`);
  }
  addPost(body: any) {
    return this.webApi.post('api/app/manage-post', body);
  }

  deletePost(postId: any) {
    return this.webApi.delete(`api/app/manage-post/${postId}`);
  }
  addPackage(PackageObj: any) {
    return this.webApi.post('/api/app/manage-package', PackageObj);
  }
 
  editPost(PackageObj: any) {
    return this.webApi.put('/api/app/manage-package/edit', PackageObj);
  }

 
}
// /api/app/manage-package/edit
