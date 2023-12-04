import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotifitcationComponent } from './notifitcation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/i18n';
import { NgbDatepickerModule ,NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
 
@NgModule({
  declarations: [NotifitcationComponent],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    TranslationModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotifitcationComponent,
      },
    ]),
  ],
  providers: [DatePipe],
})
export class NotifitcationModule {}
