import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {UsersService} from '../../shared/services/users.service';
import {User} from '../../shared/models/user.model';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'hacc-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
    title.setTitle('Регистрация');
    meta.removeTag(`name='keywords'`);
    meta.removeTag(`name='description'`);
    meta.addTags([
      { name: 'keywords', content: 'регистрация,система'},
      { name: 'description', content: 'Страница для регистрации в систему'}
    ]);
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], [this.forbiddenEmails.bind(this)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'name': new FormControl(null, [Validators.required]),
      'agree': new FormControl(false, [Validators.requiredTrue])
    });
  }

  onSubmit() {
    const {email, password, name } = this.form.value;
    const user = new User(email, password, name);

    this.usersService.createNewUser(user).subscribe(() => {
      this.router.navigate(['/login'], {
        queryParams: {
          nowCanLogin: true
        }
      });
    });
  }

  forbiddenEmails(control: FormControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      this.usersService.getUserByEmail(control.value)
        .subscribe((user: User) => {
          if (user) {
            const validationError: ValidationErrors = {
              'forbiddenEmail': true
            };
            resolve(validationError);
          } else {
            resolve(null);
          }
        });
    });
  }

}
