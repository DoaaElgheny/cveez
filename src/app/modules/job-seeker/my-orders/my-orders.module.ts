import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyOrdersComponent } from './my-orders.component';
import { TranslationModule } from 'src/app/i18n';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JobCardModule } from '../../SharedComponent/SharedComponent/jobComponents/job-card/job-card.module';
import { JobDetailsModule } from '../../SharedComponent/SharedComponent/jobComponents/job-details/job-details.module';

@NgModule({
  declarations: [MyOrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MyOrdersComponent,
      },
    
    ]),
    TranslationModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
 
    JobCardModule,
    JobDetailsModule
  ],
})
export class MyOrdersModule {}
