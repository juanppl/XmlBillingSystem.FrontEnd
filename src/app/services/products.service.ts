import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, Subject, switchMap } from 'rxjs';
import { parseStringPromise, Builder } from 'xml2js';
import { Product } from '../models/Product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public displayTable$ = new Subject<boolean>();
  public selectedProduct$ = new Subject<Product>();
  public refreshTable$ = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  public getListOfProducts(): Observable<any> {
    const _headers = new HttpHeaders();
    const headers = _headers.set('Content-Type', 'text/xml');
    return this.http.get(`${environment.api}Products/get-list-of-products`, { headers: headers, responseType: 'text' })
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

  public addOrEditProduct(product: Product): Observable<any> {
    const _headers = new HttpHeaders();
    const headers = _headers.set('Content-Type', 'application/xml');
    const builder = new Builder({ headless: true, renderOpts: { pretty: false } });
    const xmlObj = {
      Product: {
        $: { productId: product.productId || 0 },
        Name: product.Name,
        Description: product.Description,
        Price: product.Price,
        Tax: product.Tax,
        Stock: product.Stock,
        IsActive: product.IsActive,
        Category: {
          $: { categoryId: product.Category?.categoryId }
        }
      }
    };
    return this.http.post(
      `${environment.api}Products/add-or-edit-product`, 
      builder.buildObject(xmlObj), 
      { headers: headers }
    );
  }

}
