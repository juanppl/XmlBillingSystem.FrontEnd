import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/Customer';
import { ProductsService } from '../../services/products.service';
import { XmlExportService } from '../../services/xml-export.service';
import { CategoriesService } from '../../services/categories.service';
import { CustomersService } from '../../services/customers.service';
import { ClientsFormComponent } from '../../components/clients-form/clients-form.component';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [ClientsFormComponent],
  templateUrl: './clients-page.component.html',
  styleUrl: './clients-page.component.scss'
})
export class ClientsPageComponent implements OnInit{

  public customers: Customer[] = [];
  private xmlReferenceObject: any;
  public isAddingCustomer = false;

  constructor(
    public productsService: ProductsService,
    private exportService: XmlExportService,
    private categoriesServices: CategoriesService,
    private customersService: CustomersService
  ) {
    this.customersService.displayTable$.subscribe(tableDisplayed => this.isAddingCustomer = false);
    this.customersService.refreshTable$.subscribe(_ => this.getListOfCustomers());
  }

  ngOnInit(): void {
    this.getListOfCustomers();
  }

  public getListOfCustomers(): void {
    this.customersService.getListOfCustomers()
      .subscribe({
        next: (customers: any) => {
          this.customers = customers.Customers.Customer;
          this.xmlReferenceObject = customers;
        }
      });
  }

  public setAddCustomerState(): void {
    this.isAddingCustomer = !this.isAddingCustomer;
  }

  public viewBills(customer: Customer): void {
    this.customersService.viewCustomerBills$.next(customer);
  }

  public editCustomer(customer: Customer): void {
    this.isAddingCustomer = true;
    setTimeout(() => {
      this.customersService.selectedCustomer$.next(customer);
    }, 100);
  }

  public exportToXML(): void {
    this.exportService.downloadXmlFile(`xml-${new Date()}`, this.xmlReferenceObject);
  }

}
