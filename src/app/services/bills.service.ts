import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, Subject, switchMap } from 'rxjs';
import { parseStringPromise, Builder } from 'xml2js';
import { Customer } from '../models/Customer';
import { environment } from '../../environments/environment';
import { BillItem } from '../models/Bill';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor(
    private http: HttpClient
  ) { }

  buildItems(billItems: BillItem[]): any[] {
    const list: any[] = [];
    billItems.forEach(billItem => {
      list.push(
        {
          Quantity: billItem.Quantity,
          Price: billItem.Price,
          Stock: billItem.Stock,
          Subtotal: billItem.Subtotal,
          Product: {
            $: { productId: billItem.Product.productId }
          }
        }
      );
    });
    return list;
  }

  createBill(customerId: number, billItems: BillItem[]): Observable<any> {
    const _headers = new HttpHeaders();
    const headers = _headers.set('Content-Type', 'application/xml');
    const builder = new Builder({ headless: true, renderOpts: { pretty: false } });

    const billRequest = {
      Customer: {
        $: { customerId: customerId },
        Bills: {
          Bill: [
            {
              BillItems: {
                BillItem: [
                  ...this.buildItems(billItems)       
                ]
              }
            }
          ]
        }
      }
    };

    const xml = builder.buildObject(billRequest);
    return this.http.post(`${environment.api}Billing/create-new-bill`, xml, { headers });
  }

}
