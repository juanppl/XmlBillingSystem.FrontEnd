import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/Category';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.scss'
})
export class CategoriesFormComponent {

  public category: Category | null = this.initializeCategory();
  private subscription$: Subscription;
  public isSaving = false;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {
    this.subscription$ = this.categoriesService.selectedCategory$
      .subscribe((category: Category | null) => {
        this.category = category;
        if (!this.category) this.category = this.initializeCategory();
      });
  }

  private initializeCategory(): Category {
    return {
      categoryId: null,
      Name: '',
      Description: ''
    }
  }

  public save(): void {
    this.isSaving = true;
    if (this.category && this.category?.categoryId && this.category.categoryId != -1) {
      this.editCategory(this.category);
    } else {
      this.addNewCategory(this.category!);
    }
  }

  addNewCategory(category: Category) {
    throw new Error('Method not implemented.');
  }
  
  editCategory(category: Category) {
    throw new Error('Method not implemented.');
  }

  public cancel(): void {
    this.categoriesService.displayTable$.next(true);
  }

}
