import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';

import { TranslationModule } from 'src/app/i18n';
import { ManageOpportunityComponent } from './manage-opportunity.component';
import { EditOpportunityComponent } from './edit-opportunity/edit-opportunity.component';
import { RejectModalComponent } from './reject-modal/reject-modal.component';
import { AcceptanceDecisionComponent } from './acceptance-decision/acceptance-decision.component';

@NgModule({
  declarations: [
    ManageOpportunityComponent,
    EditOpportunityComponent,
    RejectModalComponent,
    AcceptanceDecisionComponent,
  ],
  imports: [
    TranslationModule,
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageOpportunityComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    TranslationModule,
  ],
  providers: [],
})
export class ManageOpportunityModule {}
