import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientLayoutComponent } from './client-layout/client-layout.component';

import { TranslationModule } from 'src/app/i18n';
import { ClientRoutingModule } from './client-routing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderModule } from '../SharedComponent/header/header.module';
import { FooterModule } from '../SharedComponent/footer/footer.module';

const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: ClientRoutingModule,
  },
];

@NgModule({
  declarations: [ClientLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgxSpinnerModule,
    HeaderModule,
    FooterModule
  ],
  exports: [RouterModule],
})
export class ClientLayoutModule {}
