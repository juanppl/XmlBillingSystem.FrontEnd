import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss'
})
export class ProductsFormComponent {

  public product: Product | null = this.initializeProduct();
  @Input({ required: true }) public categories: Category[] = [];
  private subscription$: Subscription;
  public isSaving = false;

  constructor(
    private productService: ProductsService
  ) {
    this.subscription$ = this.productService.selectedProduct$
      .subscribe((product: Product | null) => {
        this.product = product;
        if (!this.product) this.product = this.initializeProduct();
      });
  }

  private initializeProduct(): Product {
    return {
      Name: '',
      Description: '',
      Price: 0,
      Tax: 0,
      Stock: 0,
      IsActive: true,
      Category: {
        categoryId: null,
        Description: '',
        Name: ''
      },
      productId: null
    }
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public save(): void {
    this.isSaving = true;
    if (this.product) {
      this.addOrEditProduct(this.product);
    }
  }

  private addOrEditProduct(product: Product): void {
    this.productService.addOrEditProduct(product)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.productService.displayTable$.next(true);
          this.productService.refreshTable$.next();
          Swal.fire({
            title: product.productId ? "Editado Exitoso!": "Creado Exitoso!",
            text: product.productId ? "Se ha editado el producto exitosamente!" : "Se ha creado el producto exitosamente!",
            icon: "success"
          });
        }
      });
  }

  public cancel(): void {
    this.productService.displayTable$.next(true);
  }
}