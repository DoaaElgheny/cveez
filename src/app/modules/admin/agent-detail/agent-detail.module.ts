import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AgentDetailComponent } from './agent-detail.component';
import { TranslationModule } from 'src/app/i18n';

@NgModule({
  declarations: [AgentDetailComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslationModule,
    RouterModule.forChild([
      {
        path: '',
        component: AgentDetailComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
  ],
})
export class AgentDetailModule {}
