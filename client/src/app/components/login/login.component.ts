import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFrmGrp:FormGroup;
  message :string;
  messageClass: string;
  processing : boolean = false;
  previousUrl;

  constructor(private frmBldr: FormBuilder, private router:Router, private authService:AuthService, private authGuard: AuthGuard) { }

  ngOnInit() {
     this.loginFrmGrp = this.frmBldr.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
        });

    if(this.authGuard.redirectUrl)
      {
        this.messageClass = 'alert alert-danger';
        this.message = 'You must be logged in to view that page.';
        this.previousUrl = this.authGuard.redirectUrl;
        this.authGuard.redirectUrl = undefined;        
      }
        
  }

  disableForm()
  {
    this.loginFrmGrp.controls['username'].disable();
    this.loginFrmGrp.controls['password'].disable();
  }

  enableForm()
  {
    this.loginFrmGrp.controls['username'].enable();
    this.loginFrmGrp.controls['password'].enable();
  }

  submitLogin(formData: any)
  {
    //console.log("Login Component - " + formData.username + " -- " + formData.password);
    this.disableForm();
    this.processing = true;
    const user = {username:formData.username, password: formData.password};
    
    this.authService.login(user).subscribe(
    data => {
        if(data.success)
          {
            this.messageClass = 'alert alert-success'
            this.message = data.message;
            this.authService.storeUserData(data.token, data.user);
            setTimeout(() => {
              if(this.previousUrl){
              this.router.navigate([this.previousUrl]);
              }else{
              this.router.navigate(['/dashboard']);
              }
            }, 2000);
          } else{
            this.enableForm();
            this.messageClass = 'alert alert-danger'
            this.message = data.message;
            this.processing = false;
          }});
  }

}
