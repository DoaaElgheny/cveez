import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from 'src/app/i18n';
import { AgentDeatilesComponent } from './agent-deatiles.component';
import { FollowAgentModule } from '../follow-agent/follow-agent.module';

@NgModule({
  declarations: [AgentDeatilesComponent],
  imports: [
    CommonModule,
    TranslationModule,
    HttpClientModule,
    NgxSpinnerModule,
    InlineSVGModule,
    FollowAgentModule,
  ],
  exports: [AgentDeatilesComponent],
})
export class AgentDeatilesModule {}
