import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from 'src/app/i18n';
import { UserDeatilComponent } from './user-deatil.component';

@NgModule({
  declarations: [UserDeatilComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslationModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserDeatilComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
  ],
})
export class UserDetailModule {}
