import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/i18n';
import { HeaderComponent } from './header.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TranslationModule,
    RouterModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule {}
