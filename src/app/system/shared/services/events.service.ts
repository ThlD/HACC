import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {HACCEvent} from '../models/event.model';
import {BaseApi} from '../../../shared/core/base-api';

@Injectable()
export class EventsService extends BaseApi {
  constructor(public http: Http) {
    super(http);
  }

  addEvent(event: HACCEvent): Observable<HACCEvent> {
    return this.post('events', event);
  }

  getEvents(): Observable<HACCEvent[]> {
    return this.get('events');
  }

  getEventById(id: string): Observable<HACCEvent> {
    return this.get(`events/${id}`);
  }
}
