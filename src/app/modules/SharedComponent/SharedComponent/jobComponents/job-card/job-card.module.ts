import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCardComponent } from './job-card/job-card.component';
import { TranslationModule } from 'src/app/i18n';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InlineSVGModule } from 'ng-inline-svg-2';



@NgModule({
  declarations: [
    JobCardComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    HttpClientModule,
    NgxSpinnerModule,
    InlineSVGModule
  ],exports:[JobCardComponent]
})
export class JobCardModule { }
