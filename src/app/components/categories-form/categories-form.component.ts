import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/Category';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import Swal from 'sweetalert2';

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
    if (this.category) {
      this.addOrEditCategory(this.category);
    }
  }

  addOrEditCategory(category: Category) {
    this.categoriesService.addOrEditCategory(category)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.categoriesService.displayTable$.next(true);
          this.categoriesService.refreshTable$.next();
          Swal.fire({
            icon: 'success',
            title: category.categoryId ? 'Categoria Editada' : 'Categoria Agregada',
            text: category.categoryId ? 'Se edito la categoria satisfactoriamente' : 'Se creo la nueva categoria satisfactoriamente'
          });
        }
      });
  }

  public cancel(): void {
    this.categoriesService.displayTable$.next(true);
  }

}
