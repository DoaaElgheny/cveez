import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationModule } from 'src/app/i18n';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactUsComponent } from './contact-us.component';

@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContactUsComponent,
      },
    ]),
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ContactUsModule {}
