import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer.component';
import { TranslationModule } from 'src/app/i18n';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, TranslationModule],
  exports: [FooterComponent],
})
export class FooterModule {}
