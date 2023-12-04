import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { TranslationModule } from 'src/app/i18n';
import { ManageTitlesComponent } from './manage-titles.component';
import { EditTitlesComponent } from './edit-titles/edit-titles.component';

@NgModule({
  declarations: [
    ManageTitlesComponent,
    EditTitlesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageTitlesComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    TranslationModule,
    NgMultiSelectDropDownModule
  ]
})
export class ManageTitlesModule { }
