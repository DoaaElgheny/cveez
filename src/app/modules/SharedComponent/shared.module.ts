import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageChangeComponent } from './SharedComponent/language-change';
import { ConfirmationDialogComponent } from './SharedComponent/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { FilterComponent } from 'src/app/modules/SharedComponent/SharedComponent/filter/filter.component';
import { TranslationModule } from 'src/app/i18n';
import { FollowAgentComponent } from './SharedComponent/follow-agent/follow-agent.component';
import { HeaderComponent } from './SharedComponent/header/header.component';
import { AgentDeatilesComponent } from './SharedComponent/agent-deatiles/agent-deatiles.component';
// import { Conf}
@NgModule({
  declarations: [LanguageChangeComponent, FilterComponent, HeaderComponent, AgentDeatilesComponent],
  imports: [CommonModule, LanguageChangeComponent, TranslationModule],
  exports: [LanguageChangeComponent, FilterComponent],
  providers: [ConfirmationDialogService],
})
export class SharedModule {}
