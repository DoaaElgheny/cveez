import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from 'src/app/i18n';

import { LoginModalComponent } from './login-modal.component';

@NgModule({
  declarations: [LoginModalComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslationModule,
  ],
  exports: [LoginModalComponent]
})
export class LoginModalModule { }
