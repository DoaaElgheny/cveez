import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AddOpportunitiesComponent } from './add-opportunities.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UploadFileModule } from '../../SharedComponent/upload-file/upload-file.module';
import { TranslationModule } from 'src/app/i18n';

@NgModule({
  declarations: [AddOpportunitiesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AddOpportunitiesComponent,
      },

    ]),
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgMultiSelectDropDownModule,
    UploadFileModule,
    TranslationModule,
  ]
})
export class AddOpportunitiesModule { }
