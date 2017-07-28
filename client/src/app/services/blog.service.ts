import { Injectable, OnInit  } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class BlogService {
  backendUrl : string = 'http://localhost:3000';
  options;

  constructor(private authService: AuthService, private http: Http) { }

  createAuthenticationHeaders()
  {
      this.authService.loadToken();
      console.log("createAuthenticationHeaders() - " + this.authService.authToken);
      this.options = new RequestOptions({
          headers: new Headers({
            'Content-Type':'application/json', 
            authorization: this.authService.authToken
          })
      });
  }

  newBlog(blog)
  {
    this.createAuthenticationHeaders();
    //console.log("new Blog Service - " + blog.title);
    return this.http.post(this.backendUrl + '/blogs/newBlog', blog, this.options)
        .map(res => res.json())
        .catch(this.handleError);
  }

  getAllBlogs()
  {
    this.createAuthenticationHeaders();
    return this.http.get(this.backendUrl + '/blogs/getBlogs', this.options)
        .map(res => res.json())
        .catch(this.handleError);
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
