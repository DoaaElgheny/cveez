import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ViewAgentDetailsComponent } from './view-agent-details.component';
import { FollowAgentModule } from '../../SharedComponent/SharedComponent/follow-agent/follow-agent.module';

@NgModule({
  declarations: [ViewAgentDetailsComponent],
  imports: [
    CommonModule,
    FollowAgentModule,
    RouterModule.forChild([
      {
        path: '',
        component: ViewAgentDetailsComponent,
      },
    ]),
  ],
})
export class ViewAgentDetailsModule {}
