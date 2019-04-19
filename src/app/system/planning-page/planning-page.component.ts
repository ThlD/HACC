import { Component, OnInit } from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {Subscription} from 'rxjs/Subscription';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {Bill} from '../shared/models/bill.model';
import {Category} from '../shared/models/category.model';
import {HACCEvent} from '../shared/models/event.model';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'hacc-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit {

  subToLoadData$: Subscription;
  bill: Bill;
  categories: Category[];
  events: HACCEvent[];
  isLoaded = false;

  constructor(
    private billService: BillService,
    private categoriesService: CategoriesService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.subToLoadData$ = combineLatest(
      this.billService.getBill(),
      this.categoriesService.getCategories(),
      this.eventsService.getEvents()
    ).pipe(delay(200))
      .subscribe((data: [Bill, Category[], HACCEvent[] ]) => {
        this.bill = data[0];
        this.categories = data[1];
        this.events = data[2];

        this.isLoaded = true;
    });
  }

  getCategoryCost(cat: Category): number {
    let catEvents = this.events.filter((e) => {
      return e.category === cat.id && e.type === 'outcome';
    });
    return catEvents.reduce((total, e) => {
      total += e.amount;
      return total;
    }, 0);
  }

  private getPercent(cat: Category) {
    const percent = (100 * this.getCategoryCost(cat)) / cat.capacity;
    return percent > 100 ? 100 : percent;
  }

  getCatPercent(cat: Category):string {
    return this.getPercent(cat) + '%';
  }

  getCatColorClass(cat: Category): string {
    const percent = this.getPercent(cat);
    return percent < 60 ? 'success' : percent === 100 ? 'danger' : 'warning';
  }

}
