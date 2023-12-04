import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { FavoriteSearchComponent } from './favorite-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModule } from '../../SharedComponent/SharedComponent/filter/filter.module';
@NgModule({
  declarations: [FavoriteSearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: FavoriteSearchComponent,
      },
    ]),
    ReactiveFormsModule,
    TranslationModule,
    NgbPaginationModule,
    FormsModule,
    FilterModule
  ],
})
export class FavoriteSearchModule {}
