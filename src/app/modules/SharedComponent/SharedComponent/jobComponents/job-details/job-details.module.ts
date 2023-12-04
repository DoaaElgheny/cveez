import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDetailsComponent } from './job-details/job-details.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from 'src/app/i18n';
import { SavedJobModule } from '../saved-job/saved-job.module';
import { ConfirmationAccountComponent } from 'src/app/modules/admin/manage-agent/confirmation-account/confirmation-account.component';
import { DoneSuccessfullyComponent } from './done-successfully/done-successfully.component';

// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  declarations: [JobDetailsComponent, DoneSuccessfullyComponent],
  imports: [
    CommonModule,
    SavedJobModule,
    TranslationModule,
    HttpClientModule,
    NgxSpinnerModule,
    InlineSVGModule,
    NgCircleProgressModule.forRoot({
      radius: 46,
      outerStrokeWidth: 10,
      innerStrokeWidth: 5,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      // animationDuration: 300,
      startFromZero: false,
    }),
  ],
  exports: [JobDetailsComponent],
  providers: [ConfirmationAccountComponent, DoneSuccessfullyComponent],
})
export class JobDetailsModule {}
