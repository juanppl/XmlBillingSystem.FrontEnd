import { Routes } from '@angular/router';
import { BillsPageComponent } from './pages/bills-page/bills-page.component';
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { component: BillsPageComponent, path: 'bills' },
    { component: ClientsPageComponent, path: 'clients' },
    { component: ProductsPageComponent, path: 'products' },
    { component: CategoriesPageComponent, path: 'categories' }
];
