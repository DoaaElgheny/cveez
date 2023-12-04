import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('src/app/modules/visitor/about-us/about-us.module').then(
        (m) => m.AboutUsModule
      ),
  },
  
  {
    path: 'notification',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import(
        './modules/SharedComponent/SharedComponent/notifitcation/notifitcation.module'
      ).then((m) => m.NotifitcationModule),
  },
  {
    path: 'auth',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import(
        'src/app/modules/visitor/privacy-policy/privacy-policy.module'
      ).then((m) => m.PrivacyPolicyModule),
  },
  {
    path: 'news-blogs',
    loadChildren: () =>
      import(
        'src/app/modules/visitor/news_blogs/news_blogs.module'
      ).then((m) => m.NewsBlogsModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./modules/SharedComponent/layout/client-layout.module').then(
        (m) => m.ClientLayoutModule
      ),
  },
  /////snap//////////////////////////////////
  {
    path: 'snap-job',
   
    loadChildren: () =>
      import('src/app/modules/snap/snap-job/snap-job.module').then(
        (m) => m.SnapJobModule
      ),
  },
  //End
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/SharedComponent/errors/errors.module').then(
        (m) => m.ErrorsModule
      ),
  },
   { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
