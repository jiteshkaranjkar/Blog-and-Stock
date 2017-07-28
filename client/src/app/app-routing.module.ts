import  { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { AuthGuard } from './guards/auth.guard';
import { NonAuthGuard } from './guards/nonAuth.guard';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'dashboard',  component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: 'register',  component: RegisterComponent, canActivate:[NonAuthGuard]},
  { path: 'profile',  component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'blog',  component: BlogComponent, canActivate: [AuthGuard] },
  { path: 'portfolio',  component: PortfolioComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [  ],
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [],
  bootstrap: []
})
export class AppRoutingModule { }