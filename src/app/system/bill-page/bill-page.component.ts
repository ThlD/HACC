import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {Bill} from '../shared/models/bill.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'hacc-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {
  subOnBillPlusCurrency$: Subscription;
  subOnCurrency$: Subscription;

  currency: any;
  bill: Bill;

  isLoaded = false;

  constructor(private billService: BillService) { }

  ngOnInit() {
    this.subOnBillPlusCurrency$ = combineLatest(
      this.billService.getBill(),
      this.billService.getCurrency()
    ).subscribe((data: [Bill, any]) => {
      this.bill = data[0];
      this.currency = data[1];
      this.isLoaded = true;
    });
  }

  ngOnDestroy() {
    this.subOnBillPlusCurrency$.unsubscribe();
    if (this.subOnCurrency$) {
      this.subOnCurrency$.unsubscribe();
    }
  }

  onRefresh() {
    this.isLoaded = false;
    this.subOnCurrency$ = this.billService.getCurrency()
      .delay(200)  // DELAY
      .subscribe((currency: any) => {
      this.currency = currency;
      this.isLoaded = true;
    });
  }

}
