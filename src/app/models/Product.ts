import { Category } from "./Category";

export interface Product {
    Name: string;
    Description: string;
    Price: number;
    Tax: number;
    Stock: number;
    IsActive: boolean;
    Category: Category | null;
    productId: number | null;
    quantity?: number;
}