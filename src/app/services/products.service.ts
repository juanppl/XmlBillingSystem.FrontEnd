import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, Subject, switchMap } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public displayTable$ = new Subject<boolean>();
  public selectedProduct$ = new Subject<Product>();

  constructor(private http: HttpClient) {
  }

  public getListOfProducts(): Observable<any> {
    const _headers = new HttpHeaders();
    const headers = _headers.set('Content-Type', 'text/xml');
    return this.http.get('assets/products.xml', { headers: headers, responseType: 'text' })
      .pipe(
        switchMap(response =>
          from(parseStringPromise(response, { strict: true, trim: true, explicitArray: false }))
        ),
        map(result => {
          result.Products.Product.forEach((product: any) => {
            product.productId = product.$.productId;
            product.Category.categoryId = product.Category.$.categoryId;
          });
          return result;
        })
      );
  }

}
