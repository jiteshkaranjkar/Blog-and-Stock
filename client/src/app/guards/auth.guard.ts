import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  redirectUrl;

  constructor(private authService: AuthService, private router: Router)
  { }

  canActivate(route: ActivatedRouteSnapshot, snapshot : RouterStateSnapshot) {
    if(this.authService.loggedIn()) {
        return true;
    }else{ 
        this.redirectUrl = snapshot.url;
        this.router.navigate(['/login']);
        return false;
    }
  }
}