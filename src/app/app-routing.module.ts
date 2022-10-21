import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'partners',
    title: 'Partners',
    loadChildren: () => import('./pages/partners/partners.module').then( m => m.PartnersPageModule)
  },
  {
    path: 'login',
    title: 'Login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile',
    title: 'Profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'about',
    title: 'About',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'event',
    title: 'Events',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/event/event.module').then( m => m.EventPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./pages/event-detail/event-detail.module').then(m => m.EventDetailPageModule)
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
