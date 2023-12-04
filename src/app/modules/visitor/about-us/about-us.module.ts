import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us.component';
import { TranslationModule } from 'src/app/i18n/translation.module';
import { NgbAccordion, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderModule } from '../../SharedComponent/SharedComponent/header/header.module';
import { FooterModule } from '../../SharedComponent/SharedComponent/footer/footer.module';

@NgModule({
  declarations: [AboutUsComponent],
  imports: [
    NgbCarouselModule,
    CommonModule,
    TranslationModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutUsComponent,
      },
    ]),
  ],
})
export class AboutUsModule {}
