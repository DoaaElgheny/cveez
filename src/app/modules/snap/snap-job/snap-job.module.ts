import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { FooterModule } from '../../SharedComponent/SharedComponent/footer/footer.module';
import { HeaderModule } from '../../SharedComponent/SharedComponent/header/header.module';
import { SnapJobComponent } from './snap-job.component';
import { CreatePostComponent } from './component/create-post/create-post.component';
import { ProfileDetailComponent } from './component/profile-detail/profile-detail.component';
import { UploadFileModule } from '../../SharedComponent/upload-file/upload-file.module';

@NgModule({
  declarations: [SnapJobComponent, CreatePostComponent, ProfileDetailComponent],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    UploadFileModule,
    RouterModule.forChild([
      {
        path: '',
        component: SnapJobComponent,
      },
    ]),
    TranslationModule,
  ]
})
export class SnapJobModule { }
