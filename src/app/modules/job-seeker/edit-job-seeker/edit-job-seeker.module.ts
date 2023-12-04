import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from 'src/app/i18n';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';

import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { EditJobSeekerComponent } from './edit-job-seeker.component';
import { JobSeekerInformationComponent } from './models/job-seeker-information/job-seeker-information.component';
import { ChangePasswordComponent } from './models/change-password/change-password.component';
import { JobSeekerBackgroundInformationComponent } from './models/job-seeker-background-information/job-seeker-background-information.component';
import { JobSeekerVerificationCodeComponent } from './models/job-seeker-verification-code/job-seeker-verification-code.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NotCompleteComponent } from './models/not-complete/not-complete.component';

@NgModule({
  declarations: [
    EditJobSeekerComponent,
    JobSeekerInformationComponent,
    ChangePasswordComponent,
    JobSeekerBackgroundInformationComponent,
    JobSeekerVerificationCodeComponent,
    NotCompleteComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditJobSeekerComponent,
      },
    ]),
    TranslationModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    UploadFileModule,
    NgxIntlTelephoneInputModule,
    NgxSpinnerModule,
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
})
export class EditJobSeekerModule {}
