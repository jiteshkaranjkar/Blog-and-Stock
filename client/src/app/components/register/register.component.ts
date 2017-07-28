import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFrmGrp:FormGroup;
  message :string;
  messageClass: string;
  emailValid :boolean;
  emailValidMessage : string;
  usernameValid  :boolean;
  usernameValidMessage : string;
  processing : boolean = false;

  constructor(private frmBldr: FormBuilder, private authService:AuthService, private router:Router) { }


  ngOnInit() {
     this.registerFrmGrp = this.frmBldr.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]+$/)])],
            email: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50),  Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15),  Validators.pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/)])],
            confirmPassword: ['', [Validators.required]]
        }, {  validator: this.matchingPasswords('password', 'confirmPassword')});
  }


  matchingPasswords(password, confirmPassword)
  {
    return (group:FormGroup) => {
      if(group.controls[password].value === group.controls[confirmPassword].value){
        return null;
      }
      else {
        return { 'matchingPasswords':true }
      }
    }
  }

  disableForm()
  {
    this.registerFrmGrp.controls['username'].disable();
    this.registerFrmGrp.controls['email'].disable();
    this.registerFrmGrp.controls['password'].disable();
    this.registerFrmGrp.controls['confirmPassword'].disable();
  }

  enableForm()
  {
    this.registerFrmGrp.controls['username'].enable();
    this.registerFrmGrp.controls['email'].enable();
    this.registerFrmGrp.controls['password'].enable();
    this.registerFrmGrp.controls['confirmPassword'].enable();
  }

  registerUser(formData: any)
  {
    this.disableForm();
    this.processing = true;
    const user = {username:formData.username, email: formData.email, password: formData.password};
    this.authService.registerUser(user).subscribe(
    data => {
    if(data.success)
      {
        this.messageClass = 'alert alert-success'
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else{
        this.enableForm();
        this.messageClass = 'alert alert-danger'
        this.message = data.message;
        this.processing = false;
      }
    });
  }


  checkUsername(userName)
  {
    if(this.registerFrmGrp.get('username').value !== "")
    {
      this.authService.checkUsername(this.registerFrmGrp.get('username').value).subscribe(
      data => {
        if(data.success)
          {
            this.usernameValid = true;
            this.usernameValidMessage = data.message;
          } else{
            this.usernameValid = false;
            this.usernameValidMessage = data.message;
          }
        });
    }
  }

  checkEmail()
  {
    if(this.registerFrmGrp.get('email').value !== "")
    {
      this.authService.checkEmail(this.registerFrmGrp.get('email').value).subscribe(
      data => {
        if(data.success)
          {
            this.emailValid = true;
            this.emailValidMessage = data.message;
          } else{
            this.emailValid = false;
            this.emailValidMessage = data.message;
          }
        });
    }
  }

}