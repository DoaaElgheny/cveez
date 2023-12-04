import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/i18n';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';

import { ManageDiscountCodesComponent } from './manage-discount-codes.component';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { AddDiscountCodeComponent } from './add-discount-code/add-discount-code.component';

@NgModule({
  declarations: [
    ManageDiscountCodesComponent,
    AddPartnerComponent,
    AddDiscountCodeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageDiscountCodesComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    TranslationModule,
    NgxIntlTelephoneInputModule
  ],
})
export class ManageDiscountCodesModule {}
