import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownMenusModule, ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UserManagmentComponent } from './user-managment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/i18n';
import { ViewVideoModalComponent } from './view-video-modal/view-video-modal.component';
import { StatusVideoModalComponent } from './status-video-modal/status-video-modal.component';

@NgModule({
  declarations: [UserManagmentComponent, ViewVideoModalComponent, StatusVideoModalComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserManagmentComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    DropdownMenusModule,
    NgbModule,
    NgbDropdownModule,
    TranslationModule,
   
  ],
  exports:[  NgbDropdownModule, DropdownMenusModule,]

})
export class UserManagmentModule {}
