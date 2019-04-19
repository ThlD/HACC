import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';

import {HACCEvent} from '../../shared/models/event.model';
import {Category} from '../../shared/models/category.model';
import {EventsService} from '../../shared/services/events.service';
import {BillService} from '../../shared/services/bill.service';
import {Bill} from '../../shared/models/bill.model';
import {Subscription} from 'rxjs/Subscription';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {AnyMessage} from '../../../shared/models/any-message.model';

@Component({
  selector: 'hacc-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

  @Input() categories: Category[] = [];
  types = [
    {type: 'income', label: 'Доход'},
    {type: 'outcome', label: 'Расход'}
  ];
  subToUpdateBillAndAddEvent$: Subscription;
  subToGetBill$: Subscription;
  message: AnyMessage;


  constructor(private eventsService: EventsService,
              private billService: BillService) {
  }

  ngOnInit() {
    this.message = new AnyMessage('danger', '');
  }

  showMessage(type: string, text: string) {
    this.message.text = text;
    this.message.type = type;
    window.setTimeout(() => this.message.text = '', 4000);
  }

  onSubmit(form: NgForm) {
    const {type, category, description} = form.value;
    let {amount} = form.value;
    const date = moment().format('DD.MM.YYYY HH:mm:ss');
    if (amount < 0) {
      amount *= -1;
    }
    const event = new HACCEvent(
      type,
      amount,
      +category,
      date,
      description
    );

    this.billService.getBill()
      .subscribe((bill: Bill) => {
        let value = 0;
        if (type === 'outcome') {
          if (amount > bill.value) {

            this.showMessage('danger', `Недостаточно средств на счете. Вам не хватает ${amount - bill.value}`);
            return;
          } else {
            value = bill.value - amount;
          }
        } else {
          value = bill.value + amount;
        }

        this.subToUpdateBillAndAddEvent$ = combineLatest(
          this.billService.updateBill({value, currency: bill.currency}),
          this.eventsService.addEvent(event))
          .subscribe(() => {
            this.showMessage('success', `Новое событие успешно добавлено!`);
            form.setValue({
              amount: 0,
              description: ' ',
              category: 1,
              type: 'outcome'
            });
          });

        // this.subToUpdateBillAndAddEvent$ = this.billService.updateBill({value, currency: bill.currency})
        //   .pipe(
        //     mergeMap(() => {
        //       return this.eventsService.addEvent(event);
        //     })
        //   )
        //   .subscribe(() => {
        //     form.setValue({
        //       amount: 0,
        //       description: ' ',
        //       category: 1,
        //       type: 'outcome'
        //     });
        //   });
      });
  }

  ngOnDestroy() {
    if (this.subToUpdateBillAndAddEvent$) {
      this.subToUpdateBillAndAddEvent$.unsubscribe();
    }
    if (this.subToGetBill$) {
      this.subToGetBill$.unsubscribe();
    }
  }
}
