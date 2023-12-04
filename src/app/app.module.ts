import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { WebApiService } from './services/webApi.service';
import { ConfirmationDialogService } from './modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { PackageConditionService } from './services/common/package-condition.service';


import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { MessagingService } from './services/api/messaging.service';
import { initializeApp } from "firebase/app";
import { environment } from 'src/environments/environment';
initializeApp(environment.firebase);
function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({ timeOut: 4000, preventDuplicates: true }),
    AngularFireModule.initializeApp(environment.firebase),
      AngularFireAuthModule,
      AngularFirestoreModule,
      AngularFireStorageModule,
      AngularFireDatabaseModule,
  ],
  providers: [
    WebApiService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    ConfirmationDialogService,
    PackageConditionService,
    MessagingService,AngularFireDatabase,
  
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
