import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {EventsService} from '../../shared/services/events.service';
import {CategoriesService} from '../../shared/services/categories.service';
import {mergeMap} from 'rxjs/operators';
import {HACCEvent} from '../../shared/models/event.model';
import {Category} from '../../shared/models/category.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'hacc-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  event: HACCEvent;
  category: Category;

  isLoaded = false;

  subToLoadData$: Subscription;

  constructor(private route: ActivatedRoute,
              private eventsService: EventsService,
              private categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.subToLoadData$ = this.route.params
      .pipe(
        mergeMap((params: Params) => {
          return this.eventsService.getEventById(params['id']);
        }),
        mergeMap((event: HACCEvent) => {
          this.event = event;
          return this.categoriesService.getCategoryById(event.category);
        })
      )
      .subscribe((category: Category) => {
        this.category = category;
        this.isLoaded = true;
      });
  }

  ngOnDestroy(): void {
    if (this.subToLoadData$) {
      this.subToLoadData$.unsubscribe();
    }
  }

}
