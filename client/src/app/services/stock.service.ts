import { Injectable, OnInit  } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class StockService {
  backendUrl : string = 'http://localhost:3000';
  options;

  constructor(private authService: AuthService, private http: Http) { }

  createAuthenticationHeaders()
  {
      this.authService.loadToken();
      //console.log("createAuthenticationHeaders() - " + this.authService.authToken);
      this.options = new RequestOptions({
          headers: new Headers({
            'Content-Type':'application/json', 
            authorization: this.authService.authToken
          })
      });
  }

  newStock(stock)
  {
    this.createAuthenticationHeaders();
    console.log("new Stock Service - " + stock.company);
    return this.http.post(this.backendUrl + '/stocks/newStock', stock, this.options)
        .map(res => res.json())
        .catch(this.handleError);
  }

  getAllStocks()
  {
    this.createAuthenticationHeaders();
    return this.http.get(this.backendUrl + '/stocks/getStocks', this.options)
        .map(res => res.json())
        .catch(this.handleError);
  }

  updateStock(stock)
  {
    this.createAuthenticationHeaders();
    console.log("Update Stock Service - " + stock.company);
    return this.http.put(this.backendUrl + '/stocks/updateStock', stock, this.options)
        .map(res => res.json())
        .catch(this.handleError);
  }

  deleteStock(stockId)
  {
    this.createAuthenticationHeaders();
    console.log("Delete Stock Service - " + stockId);
    return this.http.delete(this.backendUrl + '/stocks/deleteStock/' + stockId, this.options)
        .map(res => res.json())
        .catch(this.handleError);
  }

  getQuote(value: string) {
      if (value != "" || value != null) {
        
    var headers = new Headers();
        headers.append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
        headers.append('Content-Type', 'Authorization')
        this.options = new RequestOptions({ headers: headers });

      return this.http.get('http://finance.google.com/finance/info?client=ig&q=NSE:HDFC', this.options)
        .map(res => res.json())
        .catch(this.handleError);
      }
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
