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
import { MangePackageComponent } from './mange-package.component';
import { ModalManagePackageComponent } from './modal-manage-package/modal-manage-package.component';

@NgModule({
  declarations: [MangePackageComponent, ModalManagePackageComponent],
  imports: [
    TranslationModule,
    CommonModule,
    InlineSVGModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MangePackageComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    TranslationModule,
  ],
  providers: [],
})
export class MangePackageModule {}
