import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CompleteJobSeekerComponent } from './complete-job-seeker.component';
@NgModule({
  declarations: [ CompleteJobSeekerComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CompleteJobSeekerComponent,
      },

    ]),
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelephoneInputModule,
    NgbDatepickerModule,
    UploadFileModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class CompleteJobSeekerModule { }
