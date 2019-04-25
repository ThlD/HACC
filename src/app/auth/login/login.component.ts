import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../shared/services/users.service';
import {User} from '../../shared/models/user.model';
import {AnyMessage} from '../../shared/models/any-message.model';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {fadeStateTrigger} from '../../shared/animations/fade.animation';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'hacc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeStateTrigger]
})
export class LoginComponent implements OnInit {
  message: AnyMessage;
  form: FormGroup;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {
    title.setTitle('Вход в систему');
    meta.removeTag(`name='keywords'`);
    meta.removeTag(`name='description'`);
    meta.addTags([
      { name: 'keywords', content: 'логин,вход,система'},
      { name: 'description', content: 'Страница для входа в систему'}
    ]);
  }

  ngOnInit() {
    this.message = new AnyMessage('danger', '');
    this.route.queryParams.subscribe((params: Params) => {
      if (params['nowCanLogin']) {
        this.showMessage({
          type: 'success',
          text: 'Теперь вы можете войти в систему'});
      } else if (params['accessDenied']) {
        this.showMessage({
          text: 'Для работы с системой вам необходимо войти',
          type: 'warning'
        });
      }
    });

    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  private showMessage(message: AnyMessage ) {
    this.message = message;
    window.setTimeout(() => {
      this.message.text = '';
      console.log(this.message);
    }, 5000);
  }

  onSubmit() {
    const formData = this.form.value;
    this.usersService.getUserByEmail(formData.email).subscribe((user: User) => {
      if (user) {
        if (user.password === formData.password) {
          this.authService.login();
          window.localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/system', 'bill']);
        } else {
          this.showMessage({
            type: 'danger',
            text: 'Пароль не верный'});
        }
      } else {
        this.showMessage({
          type: 'danger',
          text: 'Такого пользователя не существует'});
      }
    });
  }
}

