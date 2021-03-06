import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Bill} from '../models/bill.model';
import {Observable} from 'rxjs/Observable';
import {BaseApi} from '../../../shared/core/base-api';

@Injectable()
export class BillService extends BaseApi {
  constructor(
    public http: Http
  ) {
    super(http);
  }

  // getBill(): Observable<Bill> {
  //   return this.http.get(`http://localhost:3000/bill`)
  //     .map((response: Response) => response.json());
  // }

  getBill(): Observable<Bill> {
    return this.get('bill');
  }

  updateBill(bill: Bill): Observable<Bill> {
    return this.put('bill', bill);
  }

  getCurrency(base: string = 'RUB'): Observable<any> {
    return this.http.get(`https://api.exchangeratesapi.io/latest` +
    `?base=${base}`)
      .map((response: Response) => response.json());
  }
}
