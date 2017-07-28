import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private flashMsg: FlashMessagesService, private authService:AuthService){}
  
  ngOnInit() {
  }

  onLogoutClick()
  {
    this.authService.logout();
    this.flashMsg.show('You are logged out', {cssClass: 'alert-info'});
    this.router.navigate(['/']);
  }

}
