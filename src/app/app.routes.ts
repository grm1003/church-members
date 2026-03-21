import { Routes } from '@angular/router';
import { Home } from './core/pages/home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: Home },
  { path: 'members/create', component: Home },
  { path: 'members/delete', component: Home },
];
