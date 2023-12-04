import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HeaderModule } from '../SharedComponent/SharedComponent/header/header.module';
import { TranslationModule } from 'src/app/i18n';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { FooterModule } from '../SharedComponent/SharedComponent/footer/footer.module';
import { LoginModalModule } from '../SharedComponent/SharedComponent/login-modal/login-modal.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewVideoComponent } from './view-video/view-video.component';
@NgModule({
  declarations: [HomeComponent, ViewVideoComponent],
  imports: [
    CommonModule,
    NgxTypeaheadModule,
    HomeRoutingModule,
    HeaderModule,
    TranslationModule,
    FooterModule,
    LoginModalModule,
    NgbCarouselModule
  ],
})
export class HomeModule {}
