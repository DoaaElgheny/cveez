import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalMemberComponent } from './modal-member/modal-member.component';
import { ManageClientService } from 'src/app/services/api/manage-client.service';
import { FormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationAccountComponent } from './confirmation-account/confirmation-account.component';
import { ManageAgentComponent } from './manage-agent.component';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { TranslationModule } from 'src/app/i18n';

@NgModule({
  declarations: [
    ManageAgentComponent,
    ModalMemberComponent,
    ConfirmationAccountComponent,
  ],
  imports: [
    TranslationModule,
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageAgentComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    TranslationModule,
  ],
  providers: [
    ManageClientService,
    ConfirmationAccountComponent,
    AgentManagementService,

  ],
})
export class ManageAgentModule {}
