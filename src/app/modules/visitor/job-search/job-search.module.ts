import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { JobSearchComponent } from './job-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModule } from 'src/app/modules/SharedComponent/SharedComponent/filter/filter.module';
import { FollowAgentModule } from '../../SharedComponent/SharedComponent/follow-agent/follow-agent.module';
import { SavedJobModule } from 'src/app/modules/SharedComponent/SharedComponent/jobComponents/saved-job/saved-job.module';
import { LoginModalModule } from 'src/app/modules/SharedComponent/SharedComponent/login-modal/login-modal.module';
@NgModule({
  declarations: [JobSearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: JobSearchComponent,
      },
    ]),
    TranslationModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    FilterModule,
    FollowAgentModule,
    SavedJobModule,
    LoginModalModule
  ],
})
export class JobSearchModule {}
