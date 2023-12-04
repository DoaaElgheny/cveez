import { Routes } from '@angular/router';

const AdminRouting: Routes = [
  //Doaaa Elgheny
  {
    path: '',
    loadChildren: () =>
      import('./manage-agent/manage-agent.module').then(
        (m) => m.ManageAgentModule
      ),
  },
  {
    path: 'manage-agent',
    loadChildren: () =>
      import('./manage-agent/manage-agent.module').then(
        (m) => m.ManageAgentModule
      ),
  },
  {
    path: 'agent-detail/:id',
    loadChildren: () =>
      import('./agent-detail/agent-detail.module').then(
        (m) => m.AgentDetailModule
      ),
  },

  {
    path: 'user-managment',
    loadChildren: () =>
      import('./user-managment/user-managment.module').then(
        (m) => m.UserManagmentModule
      ),
  },
  {
    path: 'manage-opportunity',
    loadChildren: () =>
      import('./manage-opportunity/manage-opportunity.module').then(
        (m) => m.ManageOpportunityModule
      ),
  },
  {
    path: 'mange-classification',
    loadChildren: () =>
      import('./mange-classification/manage-classification.module').then(
        (m) => m.MangeClassificationModule
      ),
  },
  {
    path: 'mange-subscriber-packages',
    loadChildren: () =>
      import(
        './mange-subscriber-packages/mange-subscriber-packages.module'
      ).then((m) => m.MangeSubscriberPackagesModule),
  },
  {
    path: 'mange-package',
    loadChildren: () =>
      import('./mange-package/manage-package.module').then(
        (m) => m.MangePackageModule
      ),
  },
  {
    path: 'user-deatil/:id',
    loadChildren: () =>
      import('./user-deatil/user-deatil.module').then(
        (m) => m.UserDetailModule
      ),
  },
  {
    path: 'manage-discount-codes',
    loadChildren: () =>
      import('./manage-discount-codes/manage-discount-codes.module').then(
        (m) => m.ManageDiscountCodesModule
      ),
  },
  {
    path: 'manage-contact-us',
    loadChildren: () =>
      import('./manage-contact-us/manage-contact-us.module').then(
        (m) => m.ManageContactUsModule
      ),
  },
  {
    path: 'manage-titles',
    loadChildren: () =>
      import('./manage-titles/manage-titles.module').then(
        (m) => m.ManageTitlesModule
      ),
  },
  {
    path: 'edit-opportunity/:id/:agentId',
    loadChildren: () =>
      import(
        'src/app/modules/admin/edit-opportunity/edit-opportunity.module'
      ).then((m) => m.EditOpportunityModule),
  },
  {
    path: '',
    redirectTo: '/members',
    pathMatch: 'full',
  },
  {
    path: 'mange-notification',
    loadChildren: () =>
      import('./manage-notifications/manage-notifications.module').then(
        (m) => m.ManageNotificationsModule
      ),
  },
  // {
  //   path: '**',
  //   redirectTo: 'error/404',
  // },
];

export { AdminRouting };
