import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/i18n';
import { FollowAgentComponent } from './follow-agent.component';

@NgModule({
  declarations: [FollowAgentComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule
  ],
  exports: [FollowAgentComponent]
})
export class FollowAgentModule {}
