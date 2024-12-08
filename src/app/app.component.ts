import { Component } from '@angular/core';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { CustomersService } from './services/customers.service';
import { Customer } from './models/Customer';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ToolBarComponent, CurrencyPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public customer: Customer | null = null;
  public subscription$: Subscription;
  
  constructor(
    private clientsService: CustomersService
  ) {
    this.subscription$ = this.clientsService.viewCustomerBills$
      .subscribe((customer: Customer) => this.customer = customer);
  }

}
