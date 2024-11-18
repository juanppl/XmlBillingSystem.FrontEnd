import { Component, Input, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Category } from '../../models/Category';
import { forkJoin } from 'rxjs';
import { Product } from '../../models/Product';
import { CurrencyPipe } from '@angular/common';
import { ProductsFormComponent } from '../../components/products-form/products-form.component';
import { XmlExportService } from '../../services/xml-export.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CurrencyPipe, ProductsFormComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit {
  public categories: Category[] = [];
  public products: Product[] = [];
  private xmlReferenceObject: any;
  public isAddingProduct = false;

  constructor(
    public productsService: ProductsService,
    private exportService: XmlExportService,
    private categoriesServices: CategoriesService
  ) {
    this.productsService.displayTable$.subscribe(tableDisplayed => this.isAddingProduct = false);
    this.productsService.refreshTable$.subscribe(_ => this.getProductsAndCategories());
  }

  ngOnInit(): void {
    this.getProductsAndCategories();
  }

  private getProductsAndCategories() {
    const categoriesObservable = this.categoriesServices.getListOfCategories();
    const productsObservable = this.productsService.getListOfProducts();
    
    forkJoin({
      categories: categoriesObservable,
      products: productsObservable
    })
      .subscribe({
        next: ({categories, products}) => {
          this.categories = categories.Categories.Category;
          this.products = products.Products.Product;
          this.xmlReferenceObject = products;
        }
      });
  }

  public setAddProductState(): void {
    this.isAddingProduct = !this.isAddingProduct;
  }

  public editProduct(product: Product): void {
    this.isAddingProduct = true;
    setTimeout(() => {
      this.productsService.selectedProduct$.next(product);
    }, 100);
  }

  public exportToXML(): void {
    this.exportService.downloadXmlFile(`xml-${new Date()}`, this.xmlReferenceObject);
  }

}
