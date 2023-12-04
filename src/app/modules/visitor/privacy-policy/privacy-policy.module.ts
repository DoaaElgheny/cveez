import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { PrivacyPolicyComponent } from './privacy-policy.component'
import { FooterModule } from '../../SharedComponent/SharedComponent/footer/footer.module';
import { HeaderModule } from '../../SharedComponent/SharedComponent/header/header.module';

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: PrivacyPolicyComponent,
      },
    ]),
    TranslationModule,
  ]
})
export class PrivacyPolicyModule { }
