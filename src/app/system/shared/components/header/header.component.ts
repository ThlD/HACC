import { Component, OnInit } from '@angular/core';
import {User} from '../../../../shared/models/user.model';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'hacc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  date: Date = new Date();
  user: User;

  constructor(
    private authServise: AuthService,
    private  router: Router
  ) { }

  ngOnInit() {
    this.user = JSON.parse(window.localStorage.getItem('user'));

  }


  onLogout() {
    this.authServise.logout();
    this.router.navigate(['/login']);
  }

}
