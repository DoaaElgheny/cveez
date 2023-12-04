import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from 'src/app/i18n';
import { ShowAgentComponent } from './show-agent.component';
import { AgentDeatilesModule } from '../../SharedComponent/SharedComponent/agent-deatiles/agent-deatiles.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ShowAgentComponent],
  imports: [
    CommonModule,
    TranslationModule,
    HttpClientModule,
    NgxSpinnerModule,
    InlineSVGModule,
    AgentDeatilesModule,

    RouterModule.forChild([
      {
        path: '',
        component: ShowAgentComponent,
      },
    ]),
  ],
  exports: [ShowAgentComponent],
})
export class ShowAgentModule {}
