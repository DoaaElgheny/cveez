import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { ManageAgentOrdersComponent } from './manage-agent-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModule } from '../../SharedComponent/SharedComponent/filter/filter.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  declarations: [ManageAgentOrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageAgentOrdersComponent,
      },
    ]),
    NgCircleProgressModule.forRoot({
      radius: 46,
      outerStrokeWidth: 10,
      innerStrokeWidth: 5,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      // animationDuration: 300,
      startFromZero: false,
    }),
    ReactiveFormsModule,
    TranslationModule,
    NgbPaginationModule,
    FormsModule,
    FilterModule,
  ],
})
export class ManageAgentOrdersModule {}
