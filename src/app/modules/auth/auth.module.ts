import { getChangedComponent } from './components/get-changed/get-changed.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthComponent } from './auth.component';
import { TranslationModule } from 'src/app/i18n/translation.module';
import { OtpComponent } from './components/otp/otp.component';
import { SetNewPasswordComponent } from './components/set-new-password/set-new-password.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ActivateSucComponent } from './components/activate-suc/activate-suc.component';
import { NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AgentRegistrationComponent } from './components/agent-registration/agent-registration.component';
import { JobSeekerRegistrationComponent } from './components/job-seeker-registration/job-seeker-registration.component';
import { AfterRegisterationSucComponent } from './components/after-registeration-suc/after-registeration-suc.component';
import { BlockCopyPasteDirective } from 'src/app/modules/SharedComponent/block-copy-paste.directive';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { SelectRoleComponent } from './components/select-role/select-role.component';
import { NgbDateCustomParserFormatter } from 'src/app/services/myNgbDateParserFormatter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    LoginComponent,
    OtpComponent,
    ForgotPasswordComponent,
    AuthComponent,
    SetNewPasswordComponent,
    ActivateSucComponent,
    getChangedComponent,
    AgentRegistrationComponent,
    JobSeekerRegistrationComponent,
    AfterRegisterationSucComponent,
    BlockCopyPasteDirective,
    SelectRoleComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbDatepickerModule,
    NgxIntlTelephoneInputModule,
    UploadFileModule,
    NgMultiSelectDropDownModule.forRoot(),
   
  ],
  exports: [ NgxIntlTelephoneInputModule, UploadFileModule],
  providers: [DatePipe, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
    
 
    // <-- add this],
  ],
})
export class AuthModule {}
