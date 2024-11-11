import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/Category';
import { CategoriesFormComponent } from '../../components/categories-form/categories-form.component';
import { XmlExportService } from '../../services/xml-export.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CategoriesFormComponent],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss'
})
export class CategoriesPageComponent implements OnInit{

  public categories: Category[] = [];
  private xmlReferenceObject: any;
  public isAddingCategory = false;

  constructor (
    private exportService: XmlExportService,
    private categoriesServices: CategoriesService
  ) {
    this.categoriesServices.displayTable$.subscribe(tableDisplayed => this.isAddingCategory = false);
  }

  ngOnInit(): void {
    this.categoriesServices.getListOfCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories.Categories.Category;
          this.xmlReferenceObject = categories;
        }
      });
  }

  public setAddCategoryState(): void {
    this.isAddingCategory = !this.isAddingCategory;
  }

  public editCategory(category: Category): void {
    this.isAddingCategory = true;
    setTimeout(() => {
      this.categoriesServices.selectedCategory$.next(category);
    }, 100);
  }

  public exportToXML(): void {
    this.exportService.downloadXmlFile(`xml-${new Date()}`, this.xmlReferenceObject);
  }

}
