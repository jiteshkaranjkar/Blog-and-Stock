import { FlashMessagesService } from 'angular2-flash-messages';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { StockService } from './services/stock.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NonAuthGuard } from './guards/nonAuth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
//import { GoogleChart } from 'angular2-google-chart/directives/angular2-google-chart.directive';

@NgModule({
  declarations: [ AppComponent, NavbarComponent, HomeComponent, UserComponent, DashboardComponent, RegisterComponent, 
      LoginComponent, ProfileComponent, BlogComponent, PortfolioComponent],//, GoogleChart],
  imports: [ BrowserModule, AppRoutingModule, ReactiveFormsModule, HttpModule, FlashMessagesModule],
  providers: [AuthService, BlogService, StockService, AuthGuard, NonAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }