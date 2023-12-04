import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ManageContactUsComponent } from './manage-contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/i18n';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalManageContactUsComponent } from './modal-manage-contact-us/modal-manage-contact-us.component';
import { ReadMoreComponent } from './read-more/read-more.component';

@NgModule({
  declarations: [
    ManageContactUsComponent,
    ModalManageContactUsComponent,
    ReadMoreComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageContactUsComponent,
      },
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
  exports: [ReadMoreComponent],
})
export class ManageContactUsModule {}
