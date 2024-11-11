import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, map, Observable, Subject, switchMap } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  public displayTable$ = new Subject<boolean>();
  public selectedCategory$ = new Subject<Category>();

  constructor(private http: HttpClient) { }

  public getListOfCategories(): Observable<any> {
    const _headers = new HttpHeaders();
    const headers = _headers.set('Content-Type', 'text/xml');
    return this.http.get('assets/categories.xml', { headers: headers, responseType: 'text' })
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

}
