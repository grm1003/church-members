import { Routes } from '@angular/router';
import { Home } from './core/pages/home/home';
import { CreateUser } from './core/pages/create-user/create-user';
import { DeleteUser } from './core/components/delete-user/delete-user.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: Home },
  { path: 'members/create', component: CreateUser },
  { path: 'members/delete', component: DeleteUser },
];
