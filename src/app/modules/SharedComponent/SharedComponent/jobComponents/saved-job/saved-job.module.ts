import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedJobComponent } from './saved-job/saved-job.component';
import { TranslationModule } from 'src/app/i18n';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InlineSVGModule } from 'ng-inline-svg-2';



@NgModule({
  declarations: [
    SavedJobComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    HttpClientModule,
    NgxSpinnerModule,
    InlineSVGModule
  ],exports:[SavedJobComponent]
})
export class SavedJobModule { }
