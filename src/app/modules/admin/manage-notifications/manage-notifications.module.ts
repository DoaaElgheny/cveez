import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManageNotificationsComponent } from './manage-notifications.component';
import { TranslationModule } from 'src/app/i18n';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalManageNotificationsComponent } from './modal-manage-notifications/modal-manage-notifications.component';

@NgModule({
  declarations: [
    ManageNotificationsComponent,
    ModalManageNotificationsComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageNotificationsComponent,
      },
    ]),
    NgbDatepickerModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDropdownModule,
    TranslationModule,
    NgbDropdownModule,
  ],
  providers: [DatePipe],
})
export class ManageNotificationsModule {}
