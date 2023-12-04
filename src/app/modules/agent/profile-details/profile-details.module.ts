import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileDetailsComponent } from './profile-details.component';
import { TranslationModule } from 'src/app/i18n';
import { ViewVideoModalComponent } from './view-video-modal/view-video-modal.component';

@NgModule({
  declarations: [ProfileDetailsComponent, ViewVideoModalComponent],
  imports: [
    CommonModule,
    TranslationModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileDetailsComponent,
      },
    ]),
  ],
})
export class ProfileDetailsModule {}
