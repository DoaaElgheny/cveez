import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  get(arg0: string): string | undefined {
    throw new Error('Method not implemented.');
  }
  // Private properties
  private langIds: any = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService
  ) {
    // add new langIds to the list
    this.translate.addLangs(['en']);

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
    this.translate.use(this.getSelectedLanguage());
    this.setLanguage(this.getSelectedLanguage());
  }

  setLanguage(lang: string) {
    if (lang) {
      // this.translate.use(this.translate.getDefaultLang());

      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
      this.translate.use(lang);

      document.documentElement.setAttribute('lang', lang == 'ar' ? 'en' : 'ar');
      if (lang == 'ar') {
        document.querySelector('body')?.setAttribute('dir', 'rtl');
      } else {
        document.querySelector('body')?.setAttribute('dir', 'ltr');
        
      }
      
    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
}
