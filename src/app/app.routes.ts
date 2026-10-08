import { Routes } from '@angular/router';
import { Home } from './core/pages/home/home';
import { CreateUser } from './core/pages/create-user/create-user';
import { DeleteUser } from './core/components/delete-user/delete-user.component';
import { Familias } from './core/pages/familias/familias';
import { CreateFamilia } from './core/pages/create-familia/create-familia';
import { MemberStats } from './core/pages/member-stats/member-stats';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: Home },
  { path: 'members/create', component: CreateUser },
  { path: 'members/delete', component: DeleteUser },
  { path: 'members/estatisticas', component: MemberStats },
  { path: 'familias', component: Familias },
  { path: 'familias/create', component: CreateFamilia },
];

