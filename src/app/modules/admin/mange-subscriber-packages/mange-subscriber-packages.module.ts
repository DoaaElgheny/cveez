import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { TranslationModule } from 'src/app/i18n';
import { MangeSubscriberPackagesComponent } from './mange-subscriber-packages.component';

@NgModule({
  declarations: [MangeSubscriberPackagesComponent],
  imports: [
    TranslationModule,
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: MangeSubscriberPackagesComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    TranslationModule,
    NgbDatepickerModule,
  ],
  providers: [DatePipe],
})
export class MangeSubscriberPackagesModule {}
