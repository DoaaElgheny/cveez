import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbAccordion, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderModule } from '../../SharedComponent/SharedComponent/header/header.module';
import { FooterModule } from '../../SharedComponent/SharedComponent/footer/footer.module';
import { NewsBlogsComponent } from './news_blogs.component';
import { TranslationModule, TranslationService } from 'src/app/i18n';

@NgModule({
  declarations: [NewsBlogsComponent],
  imports: [
    NgbCarouselModule,
    CommonModule,
    TranslationModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: NewsBlogsComponent,
      },
    ]),
  ],
})
export class NewsBlogsModule {}
