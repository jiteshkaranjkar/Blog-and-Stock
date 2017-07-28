import { Injectable, OnInit  } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt'
import { UserComponent } from '../components/user/user.component';

@Injectable()
export class AuthService {
  backendUrl : string = 'http://localhost:3000';
  authToken;
  user;
  options;
  
  constructor(private http: Http)
  { }

  registerUser(user)
  {
      return this.http.post(this.backendUrl + '/authentication/register', user)
                .map(res => res.json())
                .catch(this.handleError);
  }

  checkUsername(username)
  {
      return this.http.get(this.backendUrl + '/authentication/checkUsername/'+ username)
        .map(res => res.json())
        .catch(this.handleError);
  }

  checkEmail(email)
  {
      return this.http.get(this.backendUrl + '/authentication/checkEmail/' + email)
        .map(res => res.json())
        .catch(this.handleError);
  }

  login(user)
  {
    //console.log("Login Service - " + user.username + " -- " + user.password);
     return this.http.post(this.backendUrl + '/authentication/login', user )
          .map(res => res.json())
          .catch(this.handleError);
  }
  
  storeUserData(token, user)
  {
      console.log("storeUserData() - user - " + user + " -Token- " + token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      this.authToken = token;
      this.user = user;
  }

  createAuthenticationHeaders()
  {
      this.loadToken();
      console.log("createAuthenticationHeaders() - " + this.authToken);
      this.options = new RequestOptions({
          headers: new Headers({
            'Content-Type':'application/x-www-form-urlencoded', 
            authorization: this.authToken
          })
      });
  }

  loadToken()
  {
      const token = localStorage.getItem('token');
      this.authToken = token;
  }

  getProfile()
  {
    this.createAuthenticationHeaders();
    return this.http.get(this.backendUrl + '/authentication/profile', this.options)
          .map(res => res.json())
          .catch(this.handleError);
  }

  loggedIn()
  {
    return tokenNotExpired();
  }

  logout()
  {
      this.authToken = null;
      this.user = null;
      localStorage.clear();
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
