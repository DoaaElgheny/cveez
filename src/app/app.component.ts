import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { TranslationService } from './i18n';
// language list

import { locale as enLang } from './i18n/vocabs/en';
import { locale as arLang } from './i18n/vocabs/ar';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { AuthService } from './modules/auth';
@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  //  @HostListener('window:unload', ['$event'])
  // async unloadHandler(event:any) {
  //   if (event.currentTarget.performance.navigation.type !== PerformanceNavigation.TYPE_RELOAD) {
  //     if (localStorage.getItem('remeberMe') === 'false') {
  //     localStorage.clear();}
  //   }
  // }

  constructor(
    private authService: AuthService,
    private translationService: TranslationService,
    private modeService: ThemeModeService // private db: AngularFireDatabase
  ) {
    // register translations
    this.translationService.loadTranslations(enLang, arLang);
  }

  ngOnInit() {
    this.modeService.init();
  }
  onActivate(event: Event) {
    window.scrollTo(0, 0);
  }
 
}
