import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { FormsModule } from '@angular/forms';

import { PaymentPackageComponent } from './payment-package.component';
@NgModule({
  declarations: [PaymentPackageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PaymentPackageComponent,
      },
    ]),
    TranslationModule,
    FormsModule,
  ],
})
export class PaymentPackageModule {}
