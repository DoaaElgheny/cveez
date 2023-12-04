import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { ManageClientService } from 'src/app/services/api/manage-client.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';

import { TranslationModule } from 'src/app/i18n';
import { MangeClassificationComponent } from './mange-classification.component';
import { ConfirmationDialogService } from '../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { ModalMangeClassificationComponent } from './modal-mange-classification/modal-mange-classification.component';
import { UploadFileModule } from '../../SharedComponent/upload-file/upload-file.module';
@NgModule({
  declarations: [
    MangeClassificationComponent,
    ModalMangeClassificationComponent,
  ],
  imports: [
    UploadFileModule,
    TranslationModule,
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: MangeClassificationComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    TranslationModule,
    ReactiveFormsModule,
  ],
  providers: [ConfirmationDialogService],
})
export class MangeClassificationModule {}
