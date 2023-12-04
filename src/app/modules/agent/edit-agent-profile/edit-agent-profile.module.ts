import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { EditAgentProfileComponent } from './edit-agent-profile.component';
import { ModalChangePasswordComponent } from './model/modal-change-password/modal-change-password.component';
import { AgentInformationComponent } from './model/agent-information/agent-information.component';
import { AgentRepresentativeInformationComponent } from './model/agent-representative-information/agent-representative-information.component';
import { NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { VerficationCodeComponent } from './model/verfication-code/verfication-code.component';
import { NgbDateCustomParserFormatter } from 'src/app/services/myNgbDateParserFormatter';
@NgModule({
  declarations: [
    EditAgentProfileComponent,
    ModalChangePasswordComponent,
    AgentInformationComponent,
    AgentRepresentativeInformationComponent,
    VerficationCodeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditAgentProfileComponent,
      },
    ]),
    UploadFileModule,
    TranslationModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelephoneInputModule,
  ],
  exports:[NgxIntlTelephoneInputModule,UploadFileModule],
  providers: [
    
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }  // <-- add this
  ],
})
export class EditAgentProfileModule {}
