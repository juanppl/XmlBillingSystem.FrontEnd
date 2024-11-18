import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../models/Customer';
import { Subscription } from 'rxjs';
import { CustomersService } from '../../services/customers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './clients-form.component.html',
  styleUrl: './clients-form.component.scss'
})
export class ClientsFormComponent implements OnDestroy {

  public customer: Customer = this.initializeCustomer();
  private subscription$: Subscription;
  public isSaving = false;

  constructor(
    private clientsService: CustomersService
  ) {
    this.subscription$ = this.clientsService.selectedCustomer$
      .subscribe((customer: Customer | null) => {
        if (!customer) {
          this.customer = this.initializeCustomer();
        } else {
          this.customer = customer;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  private initializeCustomer(): Customer {
    return {
      customerId: null,
      Name: '',
      LastName: '',
      Email: '',
      Address: '',
      Phone: '',
      Bills: {
        Bill: []
      }
    }
  }

  public save(): void {
    this.isSaving = true;
    if (this.customer) {
      this.addOrEditCustomer(this.customer!);
    }
  }

  public addOrEditCustomer(customer: Customer) {
    this.clientsService.addOrEditCustomer(customer)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.clientsService.displayTable$.next(true);
          this.clientsService.refreshTable$.next();
          Swal.fire({
            title: customer.customerId ? "Editado Exitoso!": "Creado Exitoso!",
            text: customer.customerId ? "Se ha editado el cliente exitosamente!" : "Se ha creado el cliente exitosamente!",
            icon: "success"
          });
        }
      });
  }

  public cancel(): void {
    this.clientsService.displayTable$.next(true);
  }

}
