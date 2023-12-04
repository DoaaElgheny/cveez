import { Routes } from '@angular/router';
import { AuthGuard } from '../../auth/services/auth.guard';
const ClientRoutingModule: Routes = [
  {
    path: 'edit-agent-profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        'src/app/modules/agent/edit-agent-profile/edit-agent-profile.module'
      ).then((m) => m.EditAgentProfileModule),
  },
  {
    path: 'favorite-search',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        'src/app/modules/agent/favorite-search/favorite-search.module'
      ).then((m) => m.FavoriteSearchModule),
  },
  {
    path: 'posted-opportunities',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        'src/app/modules/agent/posted-opportunities/posted-opportunities.module'
      ).then((m) => m.PostedOpportunitiesModule),
  },
  {
    path: 'add-opportunity/:id',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        'src/app/modules/agent/add-opportunities/add-opportunities.module'
      ).then((m) => m.AddOpportunitiesModule),
  },
  {
    path: 'manage-agent-orders/:id',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        'src/app/modules/agent/manage-agent-orders/manage-agent-orders.module'
      ).then((m) => m.ManageAgentOrdersModule),
  },
  {
    path: 'profile-details/:id/:cv/:backbtn',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        'src/app/modules/agent/profile-details/profile-details.module'
      ).then((m) => m.ProfileDetailsModule),
  },
  // job-seeker
  {
    path: 'edit-job-seeker',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        'src/app/modules/job-seeker/edit-job-seeker/edit-job-seeker.module'
      ).then((m) => m.EditJobSeekerModule),
  },
  {
    path: 'payment-package',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        'src/app/modules/job-seeker/payment-package/payment-package.module'
      ).then((m) => m.PaymentPackageModule),
  },
  {
    path: 'my-orders',
    loadChildren: () =>
      import('src/app/modules/job-seeker/my-orders/my-orders.module').then(
        (m) => m.MyOrdersModule
      ),
  },

  // {
  //   path: 'profile-details/:id',
  //   loadChildren: () =>
  //     import(
  //       'src/app/modules/agent/profile-details/profile-details.module'
  //     ).then((m) => m.ProfileDetailsModule),
  // },
  {
    path: 'save-opportunity',
    loadChildren: () =>
      import('src/app/modules/job-seeker/save-job/save-job.module').then(
        (m) => m.SaveJobModule
      ),
  },
  {
    path: 'view-job/:id',
    loadChildren: () =>
      import('src/app/modules/job-seeker/view-job/view-job.module').then(
        (m) => m.ViewJobModule
      ),
  },
  {
    path: 'job-search',
    loadChildren: () =>
      import('src/app/modules/visitor/job-search/job-search.module').then(
        (m) => m.JobSearchModule
      ),
  },
  {
    path: 'view-agent-details',
    loadChildren: () =>
      import(
        'src/app/modules/visitor/view-agent-details/view-agent-details.module'
      ).then((m) => m.ViewAgentDetailsModule),
  },


  {
    path: 'show-agent/:id',
    loadChildren: () =>
      import('src/app/modules/job-seeker/show-agent/show-agent.module').then(
        (m) => m.ShowAgentModule
      ),
  },

  {
    path: 'contact-us',
    loadChildren: () =>
      import('src/app/modules/visitor/contact-us/contact-us.module').then(
        (m) => m.ContactUsModule
      ),
  },
 
];

export { ClientRoutingModule };
