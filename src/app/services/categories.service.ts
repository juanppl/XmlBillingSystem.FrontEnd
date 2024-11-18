import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, map, Observable, Subject, switchMap } from 'rxjs';
import { parseStringPromise, Builder } from 'xml2js';
import { Category } from '../models/Category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  public displayTable$ = new Subject<boolean>();
  public refreshTable$ = new Subject<void>();
  public selectedCategory$ = new Subject<Category>();

  constructor(private http: HttpClient) { }

  public getListOfCategories(): Observable<any> {
    const _headers = new HttpHeaders();
    const headers = _headers.set('Content-Type', 'text/xml');
    return this.http.get(`${environment.api}Categories/get-list-of-categories`, { headers: headers, responseType: 'text' })
      .pipe(
        switchMap(response =>
          from(parseStringPromise(response, { strict: true, trim: true, explicitArray: false }))
        ),
        map(result => {
          result.Categories.Category.forEach((category: any) => {
            category.categoryId = category.$.categoryId;
          });
          return result;
        })
      );
  }

  public addOrEditCategory(category: Category): Observable<any> {
    const _headers = new HttpHeaders();
    const headers = _headers.set('Content-Type', 'application/xml');
    const builder = new Builder({ headless: true, renderOpts: { pretty: false } });
    const xmlObj = {
      Category: {
        $: category.categoryId ? { categoryId: category.categoryId } : {},
        Name: category.Name,
        Description: category.Description
      }
    };
    return this.http.post(
      `${environment.api}Categories/add-or-edit-category`, 
      builder.buildObject(xmlObj), 
      { headers: headers }
    );
  }

}
