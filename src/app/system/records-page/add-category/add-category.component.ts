import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {NgForm} from '@angular/forms';

import {CategoriesService} from '../../shared/services/categories.service';
import {Category} from '../../shared/models/category.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'hacc-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnDestroy {
  @Output() onCategoryAdd = new EventEmitter<Category>();
  subToAddCategory$: Subscription;

  constructor(private categoriesService: CategoriesService) {
  }

  onSubmit(form: NgForm) {
    let {capacity} = form.value;
    const {name} = form.value;
    if (capacity < 0) {
      capacity *= -1;
    }
    const newCategory = new Category(name, capacity);

    this.categoriesService.addCategory(newCategory)
      .subscribe((category: Category) => {
        // form.reset();
        form.form.patchValue({capacity: 1});
        this.onCategoryAdd.emit(category);
      });
  }

  ngOnDestroy() {
    if (this.subToAddCategory$) {
      this.subToAddCategory$.unsubscribe();
    }
  }
}
