import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewJobComponent } from './view-job.component';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationAccountComponent } from '../../admin/manage-agent/confirmation-account/confirmation-account.component';
import { TranslationModule } from 'src/app/i18n';
import { SavedJobModule } from '../../SharedComponent/SharedComponent/jobComponents/saved-job/saved-job.module';
import { JobDetailsModule } from '../../SharedComponent/SharedComponent/jobComponents/job-details/job-details.module';

@NgModule({
  declarations: [ViewJobComponent],
  imports: [
    CommonModule,
    SavedJobModule,

    RouterModule.forChild([
      {
        path: '',
        component: ViewJobComponent,
      },
    ]),
    TranslationModule,
    JobDetailsModule,
  ],
  providers: [ConfirmationAccountComponent],
})
export class ViewJobModule {}
