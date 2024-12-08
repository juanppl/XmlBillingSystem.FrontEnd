import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { XmlExportService } from '../../services/xml-export.service';
import { CustomersService } from '../../services/customers.service';
import { forkJoin } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { Customer } from '../../models/Customer';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillsService } from '../../services/bills.service';
import { BillItem } from '../../models/Bill';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bills-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bills-page.component.html',
  styleUrl: './bills-page.component.scss'
})
export class BillsPageComponent implements OnInit {

  public customers: Customer[] = [];
  public categories: Category[] = [];
  public products: Product[] = [];
  private xmlReferenceObject: any;
  public selectedCustomerId: number = 0;
  public selectedProductId: number = 0;
  public selectedQuantity: number = 0;
  public selectedCustomer: Customer | null = null;
  public listOfProductsSelected: Product[] = [];

  constructor(
    public productsService: ProductsService,
    private exportService: XmlExportService,
    private categoriesServices: CategoriesService,
    private customersService: CustomersService,
    private billsService: BillsService
  ) { }

  ngOnInit(): void {
    this.getInformationForBillGeneration();
  }

  getInformationForBillGeneration() {
    const customersObservable = this.customersService.getListOfCustomers();
    const categoriesObservable = this.categoriesServices.getListOfCategories();
    const productsObservable = this.productsService.getListOfProducts();

    forkJoin({
      categories: categoriesObservable,
      products: productsObservable,
      customers: customersObservable
    })
      .subscribe({
        next: ({ categories, products, customers }) => {
          this.customers = customers.Customers.Customer;
          this.categories = categories.Categories.Category;
          this.products = products.Products.Product;
          this.xmlReferenceObject = customers;
        }
      });
  }

  setSelectedCustomer() {
    this.selectedCustomer = this.customers.find(c => c.customerId == this.selectedCustomerId)!;
  }

  addProductToList() {
    const foundProduct = this.products.find(p => p.productId == this.selectedProductId);
    const productCopy = {...foundProduct};
    productCopy.quantity = this.selectedQuantity;
    productCopy.Price = (productCopy.Price! * this.selectedQuantity);
    this.listOfProductsSelected.push(productCopy! as Product);
    this.selectedProductId = 0;
    this.selectedQuantity = 0;
  }

  deleteProductFromList(product: Product) {
    const index = this.listOfProductsSelected.findIndex(p => p.productId == product.productId);
    this.listOfProductsSelected.splice(index, 1);
  }

  generateBill() {
    const billItems = this.listOfProductsSelected.map((product: Product) => {
      return {
        Product: product,
        Price: product.Price,
        Quantity: product.quantity,
        Stock: product.quantity,
        Subtotal: (product.Price + product.Tax)
      } as BillItem;
    });
    this.billsService.createBill(this.selectedCustomer!.customerId!, billItems)
      .subscribe({
        next: _ => {
          Swal.fire({
            icon: 'success',
            title: 'Factura creada correctamente',
            text: 'Se ha creado la factura correctamente'
          });
          this.selectedCustomer = null;
          this.selectedCustomerId = 0;
          this.listOfProductsSelected = [];
        }
      });
  }

}
