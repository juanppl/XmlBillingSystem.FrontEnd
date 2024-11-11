import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, Subject, switchMap } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { Customer } from '../models/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  public displayTable$ = new Subject<boolean>();
  public selectedCustomer$ = new Subject<Customer>();
  public viewCustomerBills$ = new Subject<Customer>();

  constructor(private http: HttpClient) { }

  public getListOfCustomers(): Observable<any> {
    const _headers = new HttpHeaders();
    const headers = _headers.set('Content-Type', 'text/xml');
    return this.http.get('assets/customers.xml', { headers: headers, responseType: 'text' })
      .pipe(
        switchMap(response =>
          from(parseStringPromise(response, { strict: true, trim: true, explicitArray: false }))
        ),
        map(result => {
          result.Customers.Customer.forEach((customer: any) => {
            console.log(customer);
            // Asegurar que 'customerId' siempre esté presente
            customer.customerId = customer.$.customerId;
        
            // Asegurar que 'Bills.Bill' siempre sea un arreglo
            if (customer.Bills && customer.Bills.Bill) {
                customer.Bills.Bill = Array.isArray(customer.Bills.Bill) ? customer.Bills.Bill : [customer.Bills.Bill];
        
                customer.Bills.Bill.forEach((bill: any) => {
                    // Asegurar que la factura tenga los campos básicos
                    bill.billId = bill.$.billId;
                    bill.date = bill.$.date;
                    bill.referenceNumber = bill.$.referenceNumber;
        
                    // Asegurar que 'BillItems.BillItem' siempre sea un arreglo
                    if (bill.BillItems && bill.BillItems.BillItem) {
                        bill.BillItems.BillItem = Array.isArray(bill.BillItems.BillItem) ? bill.BillItems.BillItem : [bill.BillItems.BillItem];
        
                        bill.BillItems.BillItem.forEach((billItem: any) => {
                            // Asegurar que cada 'BillItem' tenga los campos del producto
                            billItem.Product.productId = billItem.Product.$.productId;
                            billItem.Product.Category.categoryId = billItem.Product.Category.$.categoryId;
        
                            // Asegurar que los campos de la factura estén presentes
                            billItem.Quantity = billItem.Quantity;
                            billItem.Price = billItem.Price;
                            billItem.Stock = billItem.Stock;
                            billItem.Subtotal = billItem.Subtotal;
                        });
                    }
                });
            }
        });
        

          return result;
        })
      );
  }
}
