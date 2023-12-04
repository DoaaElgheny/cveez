import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { OtpComponent } from './components/otp/otp.component';
import { getChangedComponent } from './components/get-changed/get-changed.component';
import { SetNewPasswordComponent } from './components/set-new-password/set-new-password.component';

import { ActivateSucComponent } from './components/activate-suc/activate-suc.component';
import { JobSeekerRegistrationComponent } from './components/job-seeker-registration/job-seeker-registration.component';
import { AgentRegistrationComponent } from './components/agent-registration/agent-registration.component';
import { SelectRoleComponent } from './components/select-role/select-role.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        // data: { returnUrl: window.location.pathname },
      },
      {
        path: 'job-seeker-registration',
        component: JobSeekerRegistrationComponent,
      },
      {
        path: 'agent-registration',
        component: AgentRegistrationComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'set-new-password',
        component: SetNewPasswordComponent,
      },
      {
        path: 'otp/:email/:isPassword',
        component: OtpComponent,
      },
      {

        path: 'activate-suc',
        component: ActivateSucComponent,
      },
      {
        path: 'Changed/:email',
        component: getChangedComponent,
      },

      {
        path: 'complete-job-seeker',
        loadChildren: () =>
          import(
            'src/app/modules/job-seeker/complete-job-seeker/complete-job-seeker.module'
          ).then((m) => m.CompleteJobSeekerModule),
      },
      
      {
        path: 'select-role',
        component: SelectRoleComponent,
      },
      {
        path: 'payment-package',
        loadChildren: () =>
          import(
            'src/app/modules/job-seeker/payment-package/payment-package.module'
          ).then((m) => m.PaymentPackageModule),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
