import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/i18n';
import { FilterComponent } from './filter.component';

@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule
  ],
  exports: [FilterComponent]
})
export class FilterModule {}
