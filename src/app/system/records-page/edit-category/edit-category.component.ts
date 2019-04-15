import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Category} from '../../shared/models/category.model';
import {CategoriesService} from '../../shared/services/categories.service';
import {AnyMessage} from '../../../shared/models/any-message.model';

@Component({
  selector: 'hacc-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() onCategoryEdit = new EventEmitter<Category>();

  currentCategoryId = 1;
  currentCategory: Category;
  message: AnyMessage;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.message = new AnyMessage('success', '');
    this.onCategoryChange();
  }

  onCategoryChange() {
    this.currentCategory = this.categories
      .find(c => c.id === +this.currentCategoryId);
  }

  onSubmit(form: NgForm) {
    let { capacity } = form.value;
    const { name } = form.value;
    if ( capacity < 0 ) {
      capacity *= -1;
    }

    const editedCategory = new Category(name, capacity, +this.currentCategoryId);
    this.categoriesService.updateCategory(editedCategory)
      .subscribe((category: Category) => {
        this.onCategoryEdit.emit(category);
        this.message.text = 'Категория успешно отредактирована.';
        window.setTimeout(() => this.message.text = '', 5000);
      });
  }


}