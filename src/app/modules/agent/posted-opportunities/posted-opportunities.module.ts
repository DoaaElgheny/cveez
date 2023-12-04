import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { PostedOpportunitiesComponent } from './posted-opportunities.component';
import { NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewDetailsModalComponent } from './view-details-modal/view-details-modal.component';
import { DoneSuccessfullyComponent } from './done-successfully/done-successfully.component';

@NgModule({
  declarations: [PostedOpportunitiesComponent, ViewDetailsModalComponent,DoneSuccessfullyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PostedOpportunitiesComponent,
      },
    ]),
    TranslationModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule ,
    NgbDropdownModule,
  ],
  

})
export class PostedOpportunitiesModule {}
